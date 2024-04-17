import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FunctionCode } from 'src/app/e-diary/utils/Enum';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import {
  FeatureFilter,
  FeatureModel,
} from 'src/app/e-diary/models/cau-hinh/FeatureModel';
import { RefTypeModel } from 'src/app/e-diary/models/cau-hinh/RefTypeModel';
import { FeatureService } from 'src/app/e-diary/services/cau-hinh/feature.service';
import { RefTypeService } from 'src/app/e-diary/services/cau-hinh/ref-type.service';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { FeatureModalComponent } from '../feature-modal/feature-modal.component';
import { FeatureFunctionModel } from 'src/app/e-diary/models/cau-hinh/FeatureFunctionModel';
import { PagingModel } from 'src/app/e-diary/models/Commons/PagingModel';
import { ESConst } from 'src/app/e-diary/utils/Const';
import { FunctionModel } from 'src/app/e-diary/models/quan-tri/FunctionModel';
import { DeleteModel } from 'src/app/e-diary/models/Commons/DeleteModel';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-feature-list',
  templateUrl: './feature-list.component.html',
  styleUrls: ['./feature-list.component.css'],
})
export class FeatureListComponent implements OnInit {
  breadcrumbTitle: string = '';
  loading = true;
  id: number;
  isShowDetailOnLoad: boolean = false;

  //#region property Search
  searchForm!: FormGroup;
  lstRefTypeSearch: RefTypeModel[] = [];
  lstFunctionSearch: FunctionModel[] = [];
  lstFeature: FeatureModel[] = [];
  showAdvanceSearch: boolean = false;
  pageIndex: number = 1;
  pageSize: number = 10;
  totalItem: number = 0;
  pageCount: number[] = [];
  //#endregion

  //#region Properties Popup
  functionCode?: FunctionCode = null;
  popupItem: FeatureModel = {
    Id: null,
    ParentId: null,
    Name: '',
    Icon: '',
    Url: '',
    IsActive: true,
    OnMobile: false,
    Note: '',
    RefTypeId: null,
    NO: null,
    RefTypeName: '',
    ParentName: '',
  };
  lstFeatureFunction_Addnew: FeatureFunctionModel[] = [];
  //#endregion

  //#region FunctionCodes allow permission
  lstFunctionCode: string[];
  lstFunctionCodePopup: string[];
  //#endregion

  FunctionCode = FunctionCode;

  @ViewChild('popup') popup: FeatureModalComponent;

  constructor(
    private featureService: FeatureService,
    private commonService: CommonService,
    private toastr: ToastrService,
    private title: Title,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.searchForm = new FormGroup({
      Name: new FormControl(''),
      RefTypeId: new FormControl(null),
      IsActive: new FormControl(null),
      Url: new FormControl(''),
      ParentName: new FormControl(''),
      OnMobile: new FormControl(null),
      FunctionId: new FormControl(null),
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
    // load ds nghiệp vụ
    // load ds function
    this.featureService
      .getDataSetupFormView()
      .subscribe((result: ResponseModel) => {
        if (!this.commonService.checkTypeResponseData(result)) {
          console.error(result.Exception);
          this.toastr.error(`${result.Message}`, 'Load dữ liệu setup lỗi!');
          return;
        }
        this.lstRefTypeSearch = result.Data.RefTypes;
        this.lstFunctionSearch = result.Data.Functions;
      });

    // load ds Function build theo model FeatureFunction dùng cho popup Addnew
    this.featureService
      .getListFeatureFunction2CreateFeature()
      .subscribe((result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.lstFeatureFunction_Addnew = result.Data;
        } else {
          this.toastr.error(`${result.Message}`, 'Xóa lỗi');
        }
      });
  }

  onSearchData(pageIndex?: number) {
    this.pageIndex = pageIndex ?? 1;
    this.loading = true;
    let filter: FeatureFilter = {
      PageIndex: this.pageIndex,
      PageSize: this.pageSize,
      Name: this.searchForm.value.Name,
      ParentName: this.searchForm.value.ParentName,
      RefTypeId:
        this.searchForm.value.RefTypeId == 'null'
          ? null
          : this.searchForm.value.RefTypeId,
      IsActive:
        this.searchForm.value.IsActive == 'null'
          ? null
          : this.searchForm.value.IsActive,
      OnMobile:
        this.searchForm.value.OnMobile == 'null'
          ? null
          : this.searchForm.value.OnMobile,
      Url: this.searchForm.value.Url,
      FunctionId:
        this.searchForm.value.FunctionId == 'null'
          ? null
          : this.searchForm.value.FunctionId,
    };
    this.featureService.getFeaturePaging(filter).subscribe(
      (result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.totalItem = result.Data.TotalRecords;
          this.pageCount = new Array(result.Data.PageCount);
          this.lstFeature = result.Data.Items;
          this.lstFunctionCodePopup = result.FunctionCodes;
          // nếu có Id trên url thì show detail
          if (this.id && this.isShowDetailOnLoad == false) {
            // do không truyền đc giá trị từ (this) của code ts qua code html, nên cần cho vào biến bình thường trước
            let id = this.id;
            $(document).ready(function () {
              document.getElementById('Item_' + id).click();
              this.isShowDetailOnLoad == true;
            });
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

  onChangePagination(pagingConfig: PagingModel) {
    this.pageSize = pagingConfig.PageSize;
    this.pageIndex = pagingConfig.PageIndex;
    this.onSearchData(pagingConfig.PageIndex);
  }

  //#region Popup
  onOpenModalCreate() {
    this.popup.SetupPopup();
    this.popup.ShowModal();
    this.lstFunctionCodePopup = this.lstFunctionCode;
    this.functionCode = FunctionCode.CREATE;
    this.popupItem = {
      Id: null,
      ParentId: null,
      Name: '',
      Icon: '',
      Url: '',
      IsActive: true,
      OnMobile: false,
      Note: '',
      RefTypeId: null,
      NO: null,
      RefTypeName: '',
      ParentName: '',
      FeatureFunctions: this.lstFeatureFunction_Addnew,
    };
  }

  onOpenModalUpdate(id: number) {
    this.loading = true;
    this.featureService.getFeatureEditById(id).subscribe(
      (result: ResponseModel) => {
        if (!this.commonService.checkTypeResponseData(result)) {
          this.toastr.error(`${result.Message}`, 'Lỗi');
          this.loading = false;
          return;
        }
        this.lstFunctionCodePopup = result.FunctionCodes;

        if (!this.lstFunctionCodePopup.includes(FunctionCode.EDIT)) {
          this.loading = false;
          this.toastr.error(
            `Không có quyền cập nhật bản ghi`,
            'Không có quyền!'
          );
          return;
        }
        this.popup.SetupPopup();
        this.popup.ShowModal();
        this.functionCode = FunctionCode.EDIT;

        this.popupItem = result.Data;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  onOpenModalDisplay(id: number) {
    this.loading = true;
    this.featureService.getFeatureById(id).subscribe(
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
        this.popup.ShowModal();
        this.popupItem = result.Data;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  onSubmitModal(item: FeatureModel) {
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

  onEditModal(id: number) {
    this.onOpenModalUpdate(id);
  }

  onDeleteModal(item: FeatureModel) {
    this.onConfirmDel(item, this.popup);
  }
  //#endregion

  //#region Addnew-Edit
  CreateItem(item: FeatureModel) {
    this.featureService.createSysRefType(item).subscribe(
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

  UpdateItem(item: FeatureModel) {
    this.featureService.updateSysRefType(item).subscribe(
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
  onConfirmDel(item: FeatureModel, callback: FeatureModalComponent) {
    this.commonService
      .confirm(
        'Xác nhận',
        `Bạn chắc chắn muốn xóa bản ghi: ${item.Name} này?`,
        ['Có', 'Không']
      )
      .subscribe((answer) => {
        if (answer) {
          this.DeleteItem(item, callback);
        }
      });
  }

  DeleteItem(item: FeatureModel, callback: FeatureModalComponent) {
    this.loading = true;
    let { Id } = item;
    let itemDel: DeleteModel = { Id };
    this.featureService.deleteSysRefType(itemDel).subscribe(
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
