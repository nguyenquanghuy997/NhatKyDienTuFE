import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FunctionCode, ResponseTypeES } from 'src/app/e-diary/utils/Enum';
import {
  RuleFilter,
  RuleModel,
} from 'src/app/e-diary/models/quan-tri/RuleModel';
import { RuleModalComponent } from '../rule-modal/rule-modal.component';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { RuleService } from 'src/app/e-diary/services/cau-hinh/rule.service';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import { PagingModel } from 'src/app/e-diary/models/Commons/PagingModel';
import { ESConst } from 'src/app/e-diary/utils/Const';
import { DeleteModel } from 'src/app/e-diary/models/Commons/DeleteModel';
import { HttpStatusCode } from '@angular/common/http';

declare var $: any;
@Component({
  selector: 'app-rule-list',
  templateUrl: './rule-list.component.html',
  styleUrls: ['./rule-list.component.css'],
})
export class RuleListComponent {
  breadcrumbTitle: string = '';
  loading = false;
  id: number;
  isShowDetailOnLoad: boolean = false;

  //#region property Search
  searchForm!: FormGroup;
  lstItem: RuleModel[] = [];
  showAdvanceSearch: boolean = false;
  pageIndex: number = 1;
  pageSize: number = 10;
  totalItem: number = 0;
  pageCount: number[] = [];
  //#endregion

  //#region Properties Popup
  functionCode?: FunctionCode = null;
  popupItem: RuleModel = {
    Id: null,
    Name: '',
    IsActive: true,
    Note: '',
  };
  //#endregion

  //#region FunctionCodes allow permission
  lstFunctionCode: string[];
  lstFunctionCodePopup: string[];
  //#endregion

  FunctionCode = FunctionCode;
  @ViewChild('popup') popup: RuleModalComponent;

  constructor(
    private ruleService: RuleService,
    private commonService: CommonService,
    private toastr: ToastrService,
    private title: Title,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.searchForm = new FormGroup({
      Name: new FormControl(''),
      IsActive: new FormControl(null),
    });

    this.breadcrumbTitle = this.route.snapshot.data.breadcrumbTitle;
    this.title.setTitle(this.route.snapshot.data.title);

    this.route.queryParams.subscribe((val) => {
      this.id = val[ESConst.PatchParams.id];
      this.onSearchData();
    });
  }

  onSearchData() {
    this.loading = true;
    let filter: RuleFilter = {
      PageIndex: this.pageIndex,
      PageSize: this.pageSize,
      Name: this.searchForm.value.Name,
      IsActive:
        this.searchForm.value.IsActive == 'null'
          ? null
          : this.searchForm.value.IsActive,
    };
    this.ruleService.getPagingItem(filter).subscribe(
      (result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.totalItem = result.Data.TotalRecords;
          this.pageCount = new Array(result.Data.PageCount);
          this.lstItem = result.Data.Items;
          this.lstFunctionCodePopup = result.FunctionCodes;
          this.loading = false;

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
    this.onSearchData();
  }

  //#region Popup
  onOpenModalCreate() {
    this.popup.SetupModalAddnew();
    this.lstFunctionCodePopup = this.lstFunctionCode;
    this.functionCode = FunctionCode.CREATE;
    this.popupItem = {
      Id: null,
      Name: '',
      Note: '',
      IsActive: true,
    };
    this.popup.ShowModal();
  }

  onOpenModalUpdate(id: number) {
    this.loading = true;
    this.ruleService.getItemEditById(id).subscribe(
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
        this.functionCode = FunctionCode.EDIT;
        this.popup.ShowModal();
        this.popupItem = result.Data;
        this.popup.SetupModalEdit();
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  onOpenModalDisplay(id: number) {
    this.loading = true;
    this.ruleService.getItemById(id).subscribe(
      (result: ResponseModel) => {
        if (!this.commonService.checkTypeResponseData(result)) {
          this.toastr.error(`${result.Message}`, 'Lỗi');
          this.loading = false;
          return;
        }
        this.lstFunctionCodePopup = result.FunctionCodes;
        if (!result.FunctionCodes.includes(FunctionCode.DISPLAY)) {
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

  onSubmitModal(item: RuleModel) {
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

  onDeleteModal(item: RuleModel) {
    this.onConfirmDel(item, this.popup);
  }
  //#endregion

  //#region Addnew-Edit
  CreateItem(item: RuleModel) {
    this.ruleService.createItem(item).subscribe(
      (result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.toastr.success('Thêm mới thành công!', 'Thành công');
          this.popup.HideModal();
          this.onSearchData();
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

  UpdateItem(item: RuleModel) {
    this.ruleService.updateItem(item).subscribe(
      (result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.toastr.success('Cập nhật thành công!', 'Thành công');
          this.popup.HideModal();
          this.onSearchData();
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
  onConfirmDel(item: RuleModel, callback: RuleModalComponent) {
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

  DeleteItem(item: RuleModel, callback: RuleModalComponent) {
    this.loading = true;
    let { Id, Version } = item;
    let itemDel: DeleteModel = { Id, Version };
    this.ruleService.deleteItem(itemDel).subscribe(
      (result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.toastr.success('Đã xóa thành công!', 'Thành công');
          this.onSearchData();
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
