import { Component, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PagingModel } from 'src/app/e-diary/models/Commons/PagingModel';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import { PagingConfig } from 'src/app/e-diary/models/PagingConfig';
import { RefTypeModel } from 'src/app/e-diary/models/cau-hinh/RefTypeModel';
import { formMauModel } from 'src/app/e-diary/models/form-mau';
import {
  ProcessFormFilter,
  ProcessFormModel,
} from 'src/app/e-diary/models/nhat-ky-van-hanh/ProcessFormModel';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { ProcessFormService } from 'src/app/e-diary/services/dynamic-process/process-form.service';
import { ESConst } from 'src/app/e-diary/utils/Const';
import { FunctionCode } from 'src/app/e-diary/utils/Enum';
import { TrucCaCreateModalComponent } from '../truc-ca-create-modal/truc-ca-create-modal.component';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-truc-ca-list',
  templateUrl: './truc-ca-list.component.html',
})
export class TrucCaListComponent {
  @Input() RefTypeModel!: RefTypeModel;

  breadcrumbTitle: string = '';
  loading = false;

  pageIndex: number = 1;
  totalItem: number = 0;
  pageSize: number = 10;
  tableSizes: any = [10, 15, 20];
  pageCount: number[] = [];
  pagingConfig: PagingConfig = {} as PagingConfig;

  searchForm!: FormGroup;

  lstItem: ProcessFormModel[] = [];
  listForm: formMauModel[] = [];

  //#region popup property
  functionCode?: FunctionCode = null;
  showpopup: boolean = false;
  popupItem: ProcessFormModel;
  @ViewChild('popup') popup: TrucCaCreateModalComponent;
  //#endregion

  //#region Định nghĩa các enum, const, dictionary
  FunctionCode = FunctionCode;
  DicStatusStyle = ESConst.DicStatusStyle;
  DicStatusDesc = ESConst.DicStatusDesc;

  DicStatusStyle_OnShiftDuty = ESConst.DicStatusStyle_OnShiftDuty;
  DicStatusDesc_OnShiftDuty = ESConst.DicStatusDesc_OnShiftDuty;
  //#endregion

  //#region FunctionCodes allow permission
  lstFunctionCode: string[];
  lstFunctionCodePopup: string[];
  //#endregion

  constructor(
    private title: Title,
    private toastr: ToastrService,
    private commonService: CommonService,
    private diaryService: ProcessFormService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.searchForm = new FormGroup({
      name: new FormControl(''),
      status: new FormControl(null),
      statusOnShiftDuty: new FormControl(null),
    });

    this.pagingConfig = {
      itemsPerPage: this.pageSize,
      currentPage: this.pageIndex,
      totalItems: this.totalItem,
    };
  }

  ngOnInit(): void {
    this.breadcrumbTitle = this.route.snapshot.data.breadcrumbTitle;
    this.title.setTitle(this.route.snapshot.data.title);

    this.loadData(1);
  }

  onSearch(): void {
    this.loadData(1);
  }

  clearFilterData() {
    // clear data filter
    this.searchForm.reset();
  }

  loadData(pageIndex: number) {
    this.pageIndex = pageIndex;
    let formNhapModelFilter: ProcessFormFilter = {
      PageIndex: this.pageIndex,
      PageSize: this.pageSize,
      Name: this.searchForm.value.name,
      Status:
        this.searchForm.value.status == 'null'
          ? null
          : this.searchForm.value.status,
      RefTypeId: this.RefTypeModel.Id,

      StatusDutyShift:
        this.searchForm.value.statusOnShiftDuty == 'null'
          ? null
          : this.searchForm.value.statusOnShiftDuty,
    };

    this.loading = true;
    this.diaryService.getDiaryPaging(formNhapModelFilter).subscribe(
      (res: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(res)) {
          this.lstItem = res.Data.Items;
          this.totalItem = res.Data.TotalRecords;
          this.pageCount = new Array(res.Data.PageCount);
        } else {
          this.toastr.error(`${res.Message}`, 'Lỗi');
        }
        this.lstFunctionCode = res.FunctionCodes;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        if (error.status === HttpStatusCode.MethodNotAllowed)
          this.lstFunctionCode = error.error.FunctionCodes;
      }
    );
  }

  onChangePagination(pagingConfig: PagingModel) {
    this.pageSize = pagingConfig.PageSize;
    this.loadData(pagingConfig.PageIndex);
  }

  onCreateQuickly() {
    this.loading = true;
    this.diaryService
      .createQuicklyDiaryForNow_CaTruc(this.RefTypeModel.Id)
      .subscribe(
        (result: ResponseModel) => {
          if (!this.commonService.checkTypeResponseData(result)) {
            this.toastr.error(result.Message, 'Lỗi');
            this.loading = false;
            return;
          }

          this.gotoFormNhap(result.Data.Id);
          this.loading = false;
        },
        (error) => {
          this.loading = false;
        }
      );
  }

  onOpenModalCreate() {
    this.functionCode = FunctionCode.CREATE;
    this.lstFunctionCodePopup = this.lstFunctionCode;
    this.showpopup = true;
    this.popupItem = {
      StartDTG: new Date(),
      RefTypeId: this.RefTypeModel.Id,
    };
  }

  onSubmitModal(item: ProcessFormModel) {
    this.loading = true;
    this.diaryService.createQuicklyDiary_CaTruc(item).subscribe(
      (result: ResponseModel) => {
        this.loading = false;
        if (!this.commonService.checkTypeResponseData(result)) {
          this.toastr.error(result.Message, 'Lỗi');
          this.loading = false;
          return;
        }

        this.toastr.success('Thêm mới thành công!', 'Thành công');
        this.gotoFormNhap(result.Data.Id);
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  onHideModal() {
    this.showpopup = false;
  }

  gotoFormNhap(id: number) {
    let url = `/processform/reftype/${this.RefTypeModel.Id}/cap-nhat/${id}`;
    this.commonService.gotoPage(url);
  }

  //#region Delete
  onConfirmDel(item: ProcessFormModel) {
    this.commonService
      .confirm(
        'Xác nhận',
        'Bạn chắc chắn muốn xóa bản ghi: ' + item.Name + ' này?',
        ['Có', 'Không']
      )
      .subscribe((answer) => {
        if (answer) {
          this.DeleteItem(item);
        }
      });
  }

  DeleteItem(item: ProcessFormModel) {
    this.loading = true;
    this.diaryService.deleteProcessForm(item).subscribe(
      (result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.toastr.success('Đã xóa thành công!', 'Thành công');
          this.loadData(1);
        } else {
          this.toastr.error(`${result.Message}`, 'Xóa lỗi');
        }
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
  }
  //#endregion
}
