import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PagingModel } from 'src/app/e-diary/models/Commons/PagingModel';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import {
  ConfigModel,
  ConfigModelFilter,
} from 'src/app/e-diary/models/cau-hinh/ConfigModel';
import { ConfigService } from 'src/app/e-diary/services/cau-hinh/config.service';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { FunctionCode } from 'src/app/e-diary/utils/Enum';
import { ConfigModalComponent } from '../config-modal/config-modal.component';
import { DeleteModel } from 'src/app/e-diary/models/Commons/DeleteModel';
import { error } from 'console';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-common',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css'],
})
export class ConfigComponent {
  loading = false;
  respone: ConfigModel;

  //#region property Search
  searchForm!: FormGroup;
  lstItem: ConfigModel[] = [];
  pageIndex: number = 1;
  pageSize: number = 10;
  totalItem: number = 0;
  pageCount: number[] = [];
  //#endregion

  //#region FunctionCodes allow permission
  functionCode?: FunctionCode = null;
  lstFunctionCode: string[];
  lstFunctionCodePopup: string[];
  FunctionCode = FunctionCode;
  //#endregion

  @ViewChild('popup') popup: ConfigModalComponent;

  constructor(
    private configService: ConfigService,
    private commonService: CommonService,
    private toastr: ToastrService,
    private title: Title,
    private route: ActivatedRoute
  ) {
    this.searchForm = new FormGroup({
      Code: new FormControl(''),
      Name: new FormControl(''),
    });

    this.title.setTitle(this.route.snapshot.data.title);
    this.onSearchData(1);
  }

  onSearchData(pageIndex?: number) {
    this.loading = true;
    this.pageIndex = pageIndex ?? 1;

    let filter: ConfigModelFilter = {
      PageIndex: this.pageIndex,
      PageSize: this.pageSize,
      Code: this.searchForm.value.Code,
      Name: this.searchForm.value.Name,
    };
    this.configService.getPagingItem(filter).subscribe(
      (result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.totalItem = result.Data.TotalRecords;
          this.pageCount = new Array(result.Data.PageCount);
          this.lstItem = result.Data.Items;
        } else {
          this.toastr.error(`${result.Message}`, 'Lỗi');
        }
        this.lstFunctionCode = result.FunctionCodes;
        this.lstFunctionCodePopup = result.FunctionCodes;
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

  onOpenModalCreate() {
    this.functionCode = FunctionCode.CREATE;
    this.popup.ShowModal();
    this.respone = {
      Id: null,
    };
  }

  onOpenModalDisplay(id: number) {
    this.loading = true;
    this.configService.getItemById(id).subscribe(
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
        this.respone = result.Data;
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
    this.configService.getItemEditById(id).subscribe(
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
        this.respone = result.Data;
        this.popup.ShowModal();
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  onSubmitModal(item: ConfigModel) {
    this.loading = true;
    if (this.functionCode == FunctionCode.CREATE) {
      this.CreateItem(item);
    } else if (
      this.functionCode == FunctionCode.EDIT ||
      this.functionCode == FunctionCode.DISPLAY
    ) {
      this.UpdateItem(item);
    }
  }

  onSwitchEdit() {
    this.functionCode = FunctionCode.EDIT;
  }

  onDeleteModal(item: ConfigModel) {
    this.onConfirmDel(item, this.popup);
  }

  //#region Addnew-Edit
  CreateItem(item: ConfigModel) {
    this.configService.createItem(item).subscribe(
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

  UpdateItem(item: ConfigModel) {
    this.configService.updateItem(item).subscribe(
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
  onConfirmDel(item: ConfigModel, callback: ConfigModalComponent) {
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

  DeleteItem(item: ConfigModel, callback: ConfigModalComponent) {
    this.loading = true;
    let { Id } = item;
    let itemDel: DeleteModel = { Id };
    this.configService.deleteItem(itemDel).subscribe(
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
