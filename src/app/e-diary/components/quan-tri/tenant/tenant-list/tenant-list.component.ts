import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PagingModel } from 'src/app/e-diary/models/Commons/PagingModel';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import {
  TenantFilter,
  TenantModel,
} from 'src/app/e-diary/models/quan-tri/TenantModel';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { TenantService } from 'src/app/e-diary/services/quan-tri/tenant.service';
import { FunctionCode, NgSelectMessage } from 'src/app/e-diary/utils/Enum';
import { TenantModalComponent } from '../tenant-modal/tenant-modal.component';
import { DeleteModel } from 'src/app/e-diary/models/Commons/DeleteModel';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-tenant-list',
  templateUrl: './tenant-list.component.html',
  styleUrls: ['./tenant-list.component.css'],
})
export class TenantListComponent {
  loading = false;
  searchForm!: FormGroup;
  lstItem: TenantModel[] = [];
  pageIndex: number = 1;
  pageSize: number = 10;
  totalItem: number = 0;
  pageCount: number[] = [];
  //#region Properties Popup
  functionCode?: FunctionCode = null;
  popupItem: TenantModel;

  //#region FunctionCodes allow permission
  lstFunctionCode: string[];
  lstFunctionCodePopup: string[];
  //#endregion
  FunctionCode = FunctionCode;
  ngSelectMessage = NgSelectMessage;
  @ViewChild('popup') popup: TenantModalComponent;

  constructor(
    private tenantService: TenantService,
    private commonService: CommonService,
    private toastr: ToastrService,
    private title: Title,
    private route: ActivatedRoute
  ) {
    this.searchForm = new FormGroup({
      Name: new FormControl(''),
      Code: new FormControl(''),
      IsActive: new FormControl(null),
    });

    this.title.setTitle(this.route.snapshot.data.title);

    this.onSearchData(1);
  }

  onSearchData(pageIndex?: number) {
    this.pageIndex = pageIndex ?? 1;
    this.loading = true;
    let filter: TenantFilter = {
      PageIndex: this.pageIndex,
      PageSize: this.pageSize,
      Name: this.searchForm.value.Name,
      Code: this.searchForm.value.Code,
      IsActive:
        this.searchForm.value.IsActive == 'null'
          ? null
          : this.searchForm.value.IsActive,
    };

    this.tenantService.getTenantPaging(filter).subscribe(
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

  onChangePagination(pagingConfig: PagingModel) {
    this.pageSize = pagingConfig.PageSize;
    this.pageIndex = pagingConfig.PageIndex;
    this.onSearchData(pagingConfig.PageIndex);
  }

  //#region Popup
  onOpenModalCreate() {
    this.functionCode = FunctionCode.CREATE;
    this.popupItem = {
      Id: null,
      IsActive: true,
    };
    this.popup.ShowModal();
  }

  onOpenModalDisplay(id: number) {
    this.loading = true;
    this.tenantService.getTenantdById(id).subscribe(
      (result: any) => {
        if (!this.commonService.checkTypeResponseData(result)) {
          this.toastr.error(`${result.Message}`, 'Lỗi');
          this.loading = false;
          return;
        }
        this.lstFunctionCodePopup = result.FunctionCodes;

        if (!result.FunctionCodes.includes(FunctionCode.DISPLAY)) {
          this.toastr.error(
            `Không có quyền xem chi tiết bản ghi`,
            'Không có quyền!'
          );
          return;
        }
        this.functionCode = FunctionCode.DISPLAY;

        this.popupItem = result.Data;
        this.popup.ShowModal();
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  onOpenModalEdit(id: number) {
    this.loading = true;
    this.tenantService.getTenantdById(id).subscribe(
      (result: any) => {
        if (!this.commonService.checkTypeResponseData(result)) {
          this.toastr.error(`${result.Message}`, 'Lỗi');
          this.loading = false;
          return;
        }
        this.lstFunctionCodePopup = result.FunctionCodes;
        if (!result.FunctionCodes.includes(FunctionCode.EDIT)) {
          this.toastr.error(
            `Không có quyền xem chi tiết bản ghi`,
            'Không có quyền!'
          );
          return;
        }
        this.functionCode = FunctionCode.EDIT;

        this.popupItem = result.Data;
        this.popup.ShowModal();
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  onSubmitModal(item: TenantModel) {
    this.loading = true;
    // check thời gian trùng
    if (this.functionCode == FunctionCode.CREATE) {
      this.CreateItem(item);
    } else if (
      this.functionCode == FunctionCode.EDIT ||
      this.functionCode == FunctionCode.DISPLAY
    ) {
      this.UpdateItem(item);
    }
  }

  onDeleteModal(item: TenantModel) {
    this.onConfirmDel(item, this.popup);
  }

  onSwitchEdit() {
    this.functionCode = FunctionCode.EDIT;
  }
  //#endregion

  //#region Addnew-Edit
  CreateItem(item: TenantModel) {
    this.tenantService.createTenant(item).subscribe(
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

  UpdateItem(item: TenantModel) {
    this.tenantService.updateTenant(item).subscribe(
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
  onConfirmDel(item: TenantModel, callback: TenantModalComponent) {
    let { Id, Version } = item;
    let itemDel: DeleteModel = { Id, Version };
    this.commonService
      .confirm(
        'Xác nhận',
        'Bạn chắc chắn muốn xóa bản ghi: ' + item.Name + ' này?',
        ['Có', 'Không']
      )
      .subscribe((answer) => {
        if (answer) {
          this.DeleteItem(itemDel, callback);
        }
      });
  }

  DeleteItem(item: DeleteModel, callback: TenantModalComponent) {
    this.loading = true;
    this.tenantService.deleteTenant(item).subscribe(
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
