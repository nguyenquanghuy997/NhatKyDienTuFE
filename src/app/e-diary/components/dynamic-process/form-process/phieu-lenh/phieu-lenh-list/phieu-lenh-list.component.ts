import { Component, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PagingConfig } from 'src/app/e-diary/models/PagingConfig';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { formMauModel } from 'src/app/e-diary/models/form-mau';
import { RefTypeService } from 'src/app/e-diary/services/cau-hinh/ref-type.service';
import { ProcessFormService } from 'src/app/e-diary/services/dynamic-process/process-form.service';
import { RefTypeModel } from 'src/app/e-diary/models/cau-hinh/RefTypeModel';
import { PagingModel } from 'src/app/e-diary/models/Commons/PagingModel';
import { ESConst } from 'src/app/e-diary/utils/Const';
import { FunctionCode, ResponseTypeES } from 'src/app/e-diary/utils/Enum';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import { Utility } from 'src/app/e-diary/utils/Utility';
import {
  ProcessFormFilter,
  ProcessFormModel,
} from 'src/app/e-diary/models/nhat-ky-van-hanh/ProcessFormModel';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import * as moment from 'moment';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-phieu-lenh-list',
  templateUrl: './phieu-lenh-list.component.html',
})
export class PhieuLenhListComponent {
  @Input() RefTypeModel!: RefTypeModel;

  breadcrumbTitle: string = '';
  loading = false;
  pageIndex: number = 1;
  totalItem: number = 0;
  pageSize: number = 10;
  tableSizes: any = [10, 15, 20];
  pageCount: number[] = [];

  pagingConfig: PagingConfig = {} as PagingConfig;
  bsConfig: Partial<BsDatepickerConfig>;

  searchForm!: FormGroup;
  lstItem: ProcessFormModel[] = [];
  selectedDateValue: Date[];

  //#region FunctionCodes allow permission
  lstFunctionCode: string[];
  //#endregion

  FunctionCode = FunctionCode;
  DicStatusStyle = ESConst.DicStatusStyle;
  DicStatusDesc = ESConst.DicStatusDesc;

  constructor(
    private title: Title,
    private toastr: ToastrService,
    private processFormService: ProcessFormService,
    private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService
  ) {
    const currentDate = new Date();
    const startDateDefault = new Date(
      currentDate.getTime() - 10 * 24 * 60 * 60 * 1000
    );
    this.selectedDateValue = [startDateDefault, currentDate]; // Khởi tạo một phạm vi ngày mặc định

    this.searchForm = new FormGroup({
      name: new FormControl(''),
      status: new FormControl(null),
      rangeDate: new FormControl(this.selectedDateValue),
    });

    this.pagingConfig = {
      itemsPerPage: this.pageSize,
      currentPage: this.pageIndex,
      totalItems: this.totalItem,
    };

    this.bsConfig = {
      rangeInputFormat: 'DD/MM/YYYY',
      dateInputFormat: 'DD/MM/YYYY',
      showWeekNumbers: false,
      isAnimated: true,
    };
  }

  ngOnInit(): void {
    this.breadcrumbTitle = this.route.snapshot.data.breadcrumbTitle;
    this.title.setTitle(this.route.snapshot.data.title);
    this.loadData();
  }

  onSearch(): void {
    this.loadData(1);
  }

  clearFilterData() {
    // clear data filter
    this.searchForm.reset();
  }

  loadData(pageIndex?: number) {
    this.pageIndex = pageIndex ?? 1;

    let fromDate: Date;
    let toDate: Date;
    if (
      this.searchForm.get('rangeDate').value &&
      this.searchForm.get('rangeDate').value[0] != null &&
      this.searchForm.get('rangeDate').value[1] != null
    ) {
      fromDate = new Date(
        Utility.fncOffsetTimeUtc(this.searchForm.get('rangeDate').value[0])
      );
      toDate = new Date(
        Utility.fncOffsetTimeUtc(this.searchForm.get('rangeDate').value[1])
      );
    }

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
      FromDate: fromDate,
      ToDate: toDate,
    };
    this.loading = true;
    this.processFormService.getDiaryPaging(formNhapModelFilter).subscribe(
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

  changePagination(pagingConfig: PagingModel) {
    this.pageSize = pagingConfig.PageSize;
    this.loadData(pagingConfig.PageIndex);
  }

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
    this.processFormService.deleteProcessForm(item).subscribe(
      (result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.toastr.success('Đã xóa thành công!', 'Thành công');
          this.loadData(1);
        } else {
          this.toastr.error(`${result.Message}`, 'Lỗi');
        }
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
  }
}
