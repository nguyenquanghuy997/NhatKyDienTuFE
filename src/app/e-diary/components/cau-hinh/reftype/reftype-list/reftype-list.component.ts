import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import { FormModel } from 'src/app/e-diary/models/cau-hinh/FormModel';
import { FlowModel } from 'src/app/e-diary/models/cau-hinh/FlowModel';
import { RefTypeService } from 'src/app/e-diary/services/cau-hinh/ref-type.service';
import { CommonService } from 'src/app/e-diary/services/common.service';
import {
  RefTypeFilter,
  RefTypeModel,
} from 'src/app/e-diary/models/cau-hinh/RefTypeModel';
import { ReftypeModalComponent } from '../reftype-modal/reftype-modal.component';
import { FunctionCode, NgSelectMessage } from 'src/app/e-diary/utils/Enum';
import { PagingModel } from 'src/app/e-diary/models/Commons/PagingModel';
import { ESConst } from 'src/app/e-diary/utils/Const';
import { ShiftCategoryModel } from 'src/app/e-diary/models/danh-muc/ShiftCategoryModel';
import { DeleteModel } from 'src/app/e-diary/models/Commons/DeleteModel';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-reftype-list',
  templateUrl: './reftype-list.component.html',
  styleUrls: ['./reftype-list.component.css'],
})
export class ReftypeListComponent implements OnInit {
  breadcrumbTitle: string = '';
  loading = false;
  id: number;
  isShowDetailOnLoad: boolean = false;

  //#region Propeties Index
  searchForm!: FormGroup;
  lstFlowSearch: FlowModel[] = [];
  lstFormSearch: FormModel[] = [];
  lstShiftCategorySearch: ShiftCategoryModel[] = [];

  lstRefType: RefTypeModel[] = [];

  showAdvanceSearch: boolean = false;

  pageIndex: number = 1;
  pageSize: number = 10;
  totalItem: number = 0;
  pageCount: number[] = [];
  //#endregion

  //#region Properties Popup
  functionCode?: FunctionCode = null;
  lstFunctionCode: string[];
  FunctionCode = FunctionCode;
  lstFunctionCodePopup: string[];

  popupItem: RefTypeModel = {
    Id: -1,
    Name: '',
    Note: '',
    FlowId: -1,
    FormId: -1,
    ShiftCategoryId: null,
    HasCA: false,
    HasOTP: false,
    IsDeleted: false,
    CreatedUserId: -1,
    CreatedDTG: new Date(),
    UpdatedUserId: -1,
    UpdatedDTG: new Date(),
    Version: -1,

    FlowName: '',
    FormName: '',
    ShiftCategoryName: '',
  };
  @ViewChild('popup') popup: ReftypeModalComponent;
  //#endregion
  ngSelectMessage = NgSelectMessage;
  constructor(
    private refTypeService: RefTypeService,
    private commonService: CommonService,
    private toastr: ToastrService,
    private title: Title,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.searchForm = new FormGroup({
      name: new FormControl(''),
      flowId: new FormControl(null),
      formId: new FormControl(null),
      hasCA: new FormControl(null),
      hasOTP: new FormControl(null),
      shiftCategoryId: new FormControl(null),
    });

    this.route.queryParams.subscribe((val) => {
      this.id = val[ESConst.PatchParams.id];
    });
    this.SetupForm();
  }

  ngOnInit(): void {
    this.breadcrumbTitle = this.route.snapshot.data.breadcrumbTitle;
    this.title.setTitle(this.route.snapshot.data.title);

    this.onSearchData(1);
  }

  SetupForm() {
    // load lst flow
    // load lst form
    this.loading = true;
    this.refTypeService.GetDataSetupFormView().subscribe(
      (result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.lstFlowSearch = result.Data.Flows;
          this.lstFormSearch = result.Data.Forms;
          this.lstShiftCategorySearch = result.Data.ShiftCategories;
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

  //#region Search
  onSearchData(pageIndex?: number) {
    this.pageIndex = pageIndex ?? 1;
    this.loading = true;
    let filter: RefTypeFilter = {
      PageIndex: this.pageIndex,
      PageSize: this.pageSize,
      Name: this.searchForm.value.name,
      FlowId:
        this.searchForm.value.flowId == 'null'
          ? null
          : this.searchForm.value.flowId,
      FormId:
        this.searchForm.value.formId == 'null'
          ? null
          : this.searchForm.value.formId,
      ShiftCategoryId:
        this.searchForm.value.shiftCategoryId == 'null'
          ? null
          : this.searchForm.value.shiftCategoryId,
      HasCA:
        this.searchForm.value.hasCA == 'null'
          ? null
          : this.searchForm.value.hasCA,
      HasOTP:
        this.searchForm.value.hasOTP == 'null'
          ? null
          : this.searchForm.value.hasOTP,
    };
    this.refTypeService.getRefTypePaging(filter).subscribe(
      (result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.totalItem = result.Data.TotalRecords;
          this.pageCount = new Array(result.Data.PageCount);
          this.lstRefType = result.Data.Items;
          this.lstFunctionCodePopup = result.FunctionCodes;

          // nếu có Id trên url thì show detail
          if (this.id && this.isShowDetailOnLoad == false) {
            // do không truyền đc giá trị từ (this) của code ts qua code html, nên cần cho vào biến bình thường trước
            this.onOpenModalDisplay(this.id);
            this.isShowDetailOnLoad = true;
          }
        } else {
          this.toastr.error(`${result.Message}`, 'Lỗi');
        }
        this.lstFunctionCode = result.FunctionCodes;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        if (error.status === HttpStatusCode.MethodNotAllowed)
          this.lstFunctionCode = error.error.FunctionCodes;
      }
    );
  }

  onShowAdvanceSearch() {
    this.showAdvanceSearch = !this.showAdvanceSearch;
  }
  //#endregion

  //#region Paging
  onChangePagination(pagingConfig: PagingModel) {
    this.pageSize = pagingConfig.PageSize;
    this.pageIndex = pagingConfig.PageIndex;
    this.onSearchData(pagingConfig.PageIndex);
  }
  //#endregion

  //#region Popup
  onOpenModalCreate() {
    this.popup.SetupForm();
    this.popup.ShowModal();
    this.lstFunctionCodePopup = this.lstFunctionCode;
    this.functionCode = FunctionCode.CREATE;
    this.popupItem = {
      Name: '',
      Note: '',
      ParentId: null,
      FlowId: null,
      FormId: null,
      ShiftCategoryId: null,
      HasCA: false,
      HasOTP: false,
    };
  }

  onOpenModalUpdate(id: number) {
    this.loading = true;
    this.refTypeService.getSysRefTypeEditById(id).subscribe(
      (result: ResponseModel) => {
        if (!this.commonService.checkTypeResponseData(result)) {
          this.toastr.error(`${result.Message}`, 'Lỗi');
          this.loading = false;
          return;
        }
        this.lstFunctionCodePopup = result.FunctionCodes;
        if (!result.FunctionCodes.includes(FunctionCode.EDIT)) {
          this.loading = false;
          this.toastr.error(
            `Không có quyền cập nhật bản ghi`,
            'Không có quyền!'
          );
          return;
        }
        this.popupItem = result.Data;
        this.functionCode = FunctionCode.EDIT;
        this.popup.SetupForm();
        this.popup.ShowModal();

        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  onOpenModalDisplay(id: number) {
    this.loading = true;
    this.refTypeService.getSysRefTypeById(id).subscribe(
      (result: ResponseModel) => {
        if (!this.commonService.checkTypeResponseData(result)) {
          this.toastr.error(`${result.Message}`, 'Lỗi');
          this.loading = false;
          return;
        }
        this.lstFunctionCodePopup = result.FunctionCodes;
        if (!this.lstFunctionCodePopup.includes(FunctionCode.DISPLAY)) {
          this.loading = false;
          this.toastr.error(
            `Không có quyền xem chi tiết bản ghi`,
            'Không có quyền!'
          );
          return;
        }
        this.functionCode = FunctionCode.DISPLAY;

        this.popupItem = result.Data;
        this.loading = false;
        this.popup.ShowModal();
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  onSubmitModal(item: RefTypeModel) {
    this.loading = true;
    if (this.functionCode == FunctionCode.CREATE) {
      this.CreateItem(item);
    } else if (this.functionCode == FunctionCode.EDIT) {
      this.UpdateItem(item);
    }
  }

  onHideModal() {
    this.lstFunctionCodePopup = [];
    // Remove query params
    if (this.id) {
      const queryParams = {};
      this.router.navigate([], {
        queryParams,
        replaceUrl: true,
        relativeTo: this.route,
      });
    }
  }

  onEditModal(item: RefTypeModel) {
    // this.functionCode = FunctionCode.EDIT;
    // this.popupItem = item;
    this.onOpenModalUpdate(item.Id);
  }

  onDeleteModal(item: RefTypeModel) {
    this.onConfirmDel(item, this.popup);
  }
  //#endregion

  //#region Addnew-Edit
  CreateItem(item: RefTypeModel) {
    this.refTypeService.createSysRefType(item).subscribe(
      (result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.toastr.success('Thêm mới thành công!', 'Thành công');
          this.popup.HideModal();
          this.onSearchData(this.pageIndex);
        } else {
          this.toastr.error(`${result.Message}`, 'Thêm mới lỗi');
        }
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  UpdateItem(item: RefTypeModel) {
    this.refTypeService.updateSysRefType(item).subscribe(
      (result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.toastr.success('Cập nhật thành công!', 'Thành công');
          this.popup.HideModal();
          this.onSearchData(this.pageIndex);
        } else {
          this.toastr.error(`${result.Message}`, 'Cập nhật lỗi');
        }
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
  }
  //#endregion

  //#region Delete
  onConfirmDel(item: RefTypeModel, callback: ReftypeModalComponent) {
    this.commonService
      .confirm(
        'Xác nhận',
        'Bạn chắc chắn muốn xóa bản ghi: ' + item.Name + ' này?',
        ['Có', 'Không']
      )
      .subscribe((answer) => {
        if (answer) {
          this.DeleteItem(item, callback);
        }
      });
  }

  DeleteItem(item: RefTypeModel, callback: ReftypeModalComponent) {
    this.loading = true;
    let { Id, Version } = item;
    let itemDel: DeleteModel = { Id, Version };
    this.refTypeService.deleteSysRefType(itemDel).subscribe(
      (result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.toastr.success('Đã xóa thành công!', 'Thành công');
          this.onSearchData(1);
          if (callback) callback.HideModal();
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
