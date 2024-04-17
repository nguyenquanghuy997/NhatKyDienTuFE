import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PagingModel } from 'src/app/e-diary/models/Commons/PagingModel';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import {
  ShiftCategoryFilter,
  ShiftCategoryModel,
} from 'src/app/e-diary/models/danh-muc/ShiftCategoryModel';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { ShiftCategoryService } from 'src/app/e-diary/services/danh-muc/shift-category.service';
import { FunctionCode } from 'src/app/e-diary/utils/Enum';
import { ShiftCategoryModalComponent } from '../shift-category-modal/shift-category-modal.component';
import { DeleteModel } from 'src/app/e-diary/models/Commons/DeleteModel';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-shift-category-list',
  templateUrl: './shift-category-list.component.html',
  styleUrls: ['./shift-category-list.component.css'],
})
export class ShiftCategoryListComponent {
  loading = false;

  //#region Propeties Index
  searchForm!: FormGroup;

  lstItem: ShiftCategoryModel[] = [];

  pageIndex: number = 1;
  pageSize: number = 10;
  totalItem: number = 0;
  pageCount: number[] = [];
  //#endregion

  //#region Properties Popup
  functionCode?: FunctionCode = null;
  popupItem: ShiftCategoryModel;

  //#region FunctionCodes allow permission
  lstFunctionCode: string[];
  lstFunctionCodePopup: string[];
  //#endregion

  FunctionCode = FunctionCode;
  @ViewChild('popup') popup: ShiftCategoryModalComponent;
  //#endregion

  constructor(
    private shiftCategoryService: ShiftCategoryService,
    private commonService: CommonService,
    private toastr: ToastrService,
    private title: Title,
    private route: ActivatedRoute
  ) {
    this.searchForm = new FormGroup({
      Name: new FormControl(''),
      IsActive: new FormControl(null),
    });

    this.title.setTitle(this.route.snapshot.data.title);

    this.onSearchData(1);
  }

  //#region Search
  onSearchData(pageIndex?: number) {
    this.pageIndex = pageIndex ?? 1;
    this.loading = true;
    let filter: ShiftCategoryFilter = {
      PageIndex: this.pageIndex,
      PageSize: this.pageSize,
      Name: this.searchForm.value.Name,
      IsActive:
        this.searchForm.value.IsActive == 'null'
          ? null
          : this.searchForm.value.IsActive,
    };

    this.shiftCategoryService.getShiftCategoryPaging(filter).subscribe(
      (result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.totalItem = result.Data.TotalRecords;
          this.pageCount = new Array(result.Data.PageCount);
          this.lstItem = result.Data.Items;
          this.lstFunctionCodePopup = result.FunctionCodes;
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
    this.functionCode = FunctionCode.CREATE;
    this.popup.ShowModal();
    this.popupItem = {
      IsActive: true,
    };
  }

  onOpenModalDisplay(id: number) {
    this.loading = true;
    this.shiftCategoryService.getShiftCategoryById(id).subscribe(
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
    this.shiftCategoryService.getShiftCategoryEditById(id).subscribe(
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

  onSubmitModal(item: ShiftCategoryModel) {
    this.loading = true;
    // check thời gian trùng
    if (this.functionCode == FunctionCode.CREATE) {
      this.CreateItem(item);
    } else if (this.functionCode == FunctionCode.EDIT) {
      this.UpdateItem(item);
    }
  }

  onSwitchEdit() {
    this.functionCode = FunctionCode.EDIT;
  }

  onDeleteModal(item: ShiftCategoryModel) {
    this.onConfirmDel(item, this.popup);
  }
  //#endregion

  //#region Addnew-Edit
  CreateItem(item: ShiftCategoryModel) {
    this.shiftCategoryService.createShiftCategory(item).subscribe(
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

  UpdateItem(item: ShiftCategoryModel) {
    this.shiftCategoryService.updateShiftCategory(item).subscribe(
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
  onConfirmDel(
    item: ShiftCategoryModel,
    callback: ShiftCategoryModalComponent
  ) {
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

  DeleteItem(item: ShiftCategoryModel, callback: ShiftCategoryModalComponent) {
    this.loading = true;
    let { Id, Version } = item;
    let itemDel: DeleteModel = { Id, Version };
    this.shiftCategoryService.deleteShiftCategory(itemDel).subscribe(
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
