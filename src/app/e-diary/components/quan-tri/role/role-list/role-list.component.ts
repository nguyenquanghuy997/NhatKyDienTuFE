import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PagingModel } from 'src/app/e-diary/models/Commons/PagingModel';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import {
  RoleModel,
  RoleModelFilter,
} from 'src/app/e-diary/models/quan-tri/RoleModel';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { RoleModalComponent } from '../role-modal/role-modal.component';
import { RoleService } from 'src/app/e-diary/services/quan-tri/role.service';
import { FunctionCode, ResponseTypeES } from 'src/app/e-diary/utils/Enum';
import { DeleteModel } from 'src/app/e-diary/models/Commons/DeleteModel';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.css'],
})
export class RoleListComponent {
  breadcrumbTitle: string = '';
  loading = false;

  //#region property Search
  searchForm!: FormGroup;
  lstItem: RoleModel[] = [];
  showAdvanceSearch: boolean = false;
  pageIndex: number = 1;
  pageSize: number = 10;
  totalItem: number = 0;
  pageCount: number[] = [];
  //#endregion

  //#region Properties Popup
  functionCode?: FunctionCode = null;
  //#region FunctionCodes allow permission
  lstFunctionCode: string[];
  lstFunctionCodePopup: string[];
  //#endregion

  FunctionCode = FunctionCode;
  showpopup: boolean = false;
  popupItem: RoleModel = {
    Id: null,
    Name: '',
    IsActive: true,
    Note: '',
  };
  //#endregion

  @ViewChild('popup') popup: RoleModalComponent;

  constructor(
    private vaiTroService: RoleService,
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
  }

  ngOnInit(): void {
    this.breadcrumbTitle = this.route.snapshot.data.breadcrumbTitle;
    this.title.setTitle(this.route.snapshot.data.title);
    this.onSearchData(1);
  }

  onSearchData(pageIndex?: number) {
    this.loading = true;
    this.pageIndex = pageIndex ?? 1;
    let filter: RoleModelFilter = {
      PageIndex: this.pageIndex,
      PageSize: this.pageSize,
      Name: this.searchForm.value.Name,
      IsActive:
        this.searchForm.value.IsActive == 'null'
          ? null
          : this.searchForm.value.IsActive,
    };
    this.vaiTroService.getPagingItem(filter).subscribe(
      (result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.totalItem = result.Data.TotalRecords;
          this.pageCount = new Array(result.Data.PageCount);
          this.lstItem = result.Data.Items;
          this.lstFunctionCodePopup = result.FunctionCodes;
          this.loading = false;
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
    this.lstFunctionCodePopup = this.lstFunctionCode;
    this.functionCode = FunctionCode.CREATE;
    this.showpopup = true;
    this.popupItem = {
      Id: null,
      Name: '',
      Note: '',
      IsActive: true,
    };
    this.popup.ShowModal();
    $('body').on('shown.bs.modal', '#RoleModal', function () {
      $('input:visible:enabled:first', this).focus();
    });
  }

  onOpenModalUpdate(id: number) {
    this.loading = true;
    this.vaiTroService.getItemEditById(id).subscribe(
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
        this.showpopup = true;
        this.popup.ShowModal();
        this.popupItem = result.Data;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
    $('body').on('shown.bs.modal', '#RoleModal', function () {
      $('input:visible:enabled:first', this).focus();
    });
  }

  onOpenModalDisplay(id: number) {
    this.loading = true;
    this.vaiTroService.getItemById(id).subscribe(
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
        this.showpopup = true;
        this.popup.ShowModal();
        this.popupItem = result.Data;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  onSubmitModal(item: RoleModel) {
    this.loading = true;
    if (this.functionCode == FunctionCode.CREATE) {
      this.CreateItem(item);
    } else if (this.functionCode == FunctionCode.EDIT) {
      this.UpdateItem(item);
    }
  }

  onHideModal() {
    this.showpopup = false;
    this.lstFunctionCodePopup = [];
  }

  onEditModal(id: number) {
    this.onOpenModalUpdate(id);
  }

  onDeleteModal(item: RoleModel) {
    this.onConfirmDel(item, this.popup);
  }
  //#endregion

  //#region Addnew-Edit
  CreateItem(item: RoleModel) {
    this.vaiTroService.createItem(item).subscribe(
      (result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.toastr.success('Thêm mới thành công!', 'Thành công');
          this.popup.HideModal();
          this.showpopup = false;
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

  UpdateItem(item: RoleModel) {
    this.vaiTroService.updateItem(item).subscribe(
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
  onConfirmDel(item: RoleModel, callback: RoleModalComponent) {
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

  DeleteItem(item: RoleModel, callback: RoleModalComponent) {
    this.loading = true;
    let { Id, Version } = item;
    let itemDel: DeleteModel = { Id, Version };
    this.vaiTroService.deleteItem(itemDel).subscribe(
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
}
