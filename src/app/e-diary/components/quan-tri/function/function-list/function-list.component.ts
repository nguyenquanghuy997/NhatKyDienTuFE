import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FunctionCode, ResponseTypeES } from 'src/app/e-diary/utils/Enum';
import {
  FunctionFilter,
  FunctionModel,
} from 'src/app/e-diary/models/quan-tri/FunctionModel';
import { FunctionModalComponent } from '../function-modal/function-modal.component';
import { FunctionService } from 'src/app/e-diary/services/quan-tri/function.service';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import { PagingModel } from 'src/app/e-diary/models/Commons/PagingModel';
import { DeleteModel } from 'src/app/e-diary/models/Commons/DeleteModel';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-function-list',
  templateUrl: './function-list.component.html',
  styleUrls: ['./function-list.component.css'],
})
export class FunctionListComponent {
  breadcrumbTitle: string = '';
  loading = false;

  //#region property Search
  searchForm!: FormGroup;
  lstItem: FunctionModel[] = [];
  showAdvanceSearch: boolean = false;
  pageIndex: number = 1;
  pageSize: number = 10;
  totalItem: number = 0;
  pageCount: number[] = [];
  //#endregion

  //#region Properties Popup
  functionCode?: FunctionCode = null;
  showpopup: boolean = false;
  popupItem: FunctionModel = {
    Id: null,
    Name: '',
    Code: '',
    IsActive: true,
    Note: '',
  };
  //#endregion
  //#region FunctionCodes allow permission
  lstFunctionCode: string[];
  lstFunctionCodePopup: string[];
  //#endregion

  FunctionCode = FunctionCode;
  @ViewChild('popup') popup: FunctionModalComponent;

  constructor(
    private functionService: FunctionService,
    private commonService: CommonService,
    private toastr: ToastrService,
    private title: Title,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.searchForm = new FormGroup({
      Name: new FormControl(''),
      Code: new FormControl(''),
      IsActive: new FormControl(null),
    });

    this.breadcrumbTitle = this.route.snapshot.data.breadcrumbTitle;
    this.title.setTitle(this.route.snapshot.data.title);

    this.onSearchData(1);
  }

  onSearchData(pageIndex?: number) {
    this.loading = true;
    this.pageIndex = pageIndex ?? 1;
    let filter: FunctionFilter = {
      PageIndex: this.pageIndex,
      PageSize: this.pageSize,
      Name: this.searchForm.value.Name,
      Code: this.searchForm.value.Code,
      IsActive:
        this.searchForm.value.IsActive == 'null'
          ? null
          : this.searchForm.value.IsActive,
    };
    this.functionService.getPagingItem(filter).subscribe(
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

  onShowAdvanceSearch() {
    this.showAdvanceSearch = !this.showAdvanceSearch;
  }

  onChangePagination(pagingConfig: PagingModel) {
    this.pageSize = pagingConfig.PageSize;
    this.pageIndex = pagingConfig.PageIndex;
    this.onSearchData(this.pageIndex);
  }

  //#region Popup
  onOpenModalCreate() {
    this.functionCode = FunctionCode.CREATE;
    this.lstFunctionCodePopup = this.lstFunctionCode;
    this.showpopup = true;
    this.popupItem = {
      Id: null,
      Code: '',
      Name: '',
      Note: '',
      IsActive: true,
    };
    this.popup.ShowModal();
  }

  onOpenModalUpdate(id: number) {
    this.loading = true;
    this.functionService.getItemEditById(id).subscribe(
      (result: ResponseModel) => {
        if (!this.commonService.checkTypeResponseData(result)) {
          this.toastr.error(`${result.Message}`, 'Lỗi');
          this.loading = false;
          return;
        }
        if (!result.FunctionCodes.includes(FunctionCode.EDIT)) {
          this.loading = false;
          this.toastr.error(
            `Không có quyền cập nhật bản ghi`,
            'Không có quyền!'
          );
          return;
        }
        this.lstFunctionCodePopup = result.FunctionCodes;
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
  }

  onOpenModalDisplay(id: number) {
    this.loading = true;
    this.functionService.getItemById(id).subscribe(
      (result: ResponseModel) => {
        if (!this.commonService.checkTypeResponseData(result)) {
          this.toastr.error(`${result.Message}`, 'Lỗi');
          this.loading = false;
          return;
        }
        if (!result.FunctionCodes.includes(FunctionCode.DISPLAY)) {
          this.loading = false;
          this.toastr.error(
            `Không có quyền xem chi tiết bản ghi`,
            'Không có quyền!'
          );
          return;
        }
        this.lstFunctionCodePopup = result.FunctionCodes;
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

  onSubmitModal(item: FunctionModel) {
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

  onDeleteModal(item: FunctionModel) {
    this.onConfirmDel(item, this.popup);
  }
  //#endregion

  //#region Addnew-Edit
  CreateItem(item: FunctionModel) {
    this.functionService.createItem(item).subscribe(
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

  UpdateItem(item: FunctionModel) {
    this.functionService.updateItem(item).subscribe(
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
  onConfirmDel(item: FunctionModel, callback: FunctionModalComponent) {
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

  DeleteItem(item: FunctionModel, callback: FunctionModalComponent) {
    this.loading = true;
    let { Id, Version } = item;
    let itemDel: DeleteModel = { Id, Version };
    this.functionService.deleteItem(itemDel).subscribe(
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
