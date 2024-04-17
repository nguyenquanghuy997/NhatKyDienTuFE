import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PagingModel } from 'src/app/e-diary/models/Commons/PagingModel';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import { FunctionCode } from 'src/app/e-diary/utils/Enum';
import { UnitFilter, UnitModel } from '../../../../models/danh-muc/UnitModel';
import { CommonService } from '../../../../services/common.service';
import { UnitService } from '../../../../services/danh-muc/unit.service';
import { UnitModalComponent } from '../unit-modal/unit-modal.component';
import { DeleteModel } from 'src/app/e-diary/models/Commons/DeleteModel';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-unit-list',
  templateUrl: './unit-list.component.html',
})
export class UnitComponent {
  loading = false;

  searchForm!: FormGroup;

  lstItem: UnitModel[] = [];

  showAdvanceSearch: boolean = false;

  popupItem: UnitModel;

  pageIndex: number = 1;
  totalItem: number = 0;
  pageSize: number = 10;
  pageCount: number[] = [];

  functionCode?: FunctionCode = null;
  lstFunctionCode: string[];
  lstFunctionCodePopup: string[];

  FunctionCode = FunctionCode;

  @ViewChild('popup') popup: UnitModalComponent;

  constructor(
    private donViTinhService: UnitService,
    private titleService: Title,
    public toastr: ToastrService,
    private route: ActivatedRoute,
    private commonService: CommonService
  ) {
    this.searchForm = new FormGroup({
      name: new FormControl(''),
      status: new FormControl(null),
    });

    this.titleService.setTitle(this.route.snapshot.data.title);
    this.onSearchData(1);
  }

  onSearchData(pageIndex: number) {
    this.pageIndex = pageIndex ?? 1;
    this.loading = true;

    let donViTinhFilter: UnitFilter = {
      PageIndex: this.pageIndex,
      PageSize: this.pageSize,
      Name: this.searchForm.value.name,
      IsActive:
        this.searchForm.value.status == 'null'
          ? null
          : this.searchForm.value.status,
    };

    this.donViTinhService.getUnitPaging(donViTinhFilter).subscribe(
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

  changePagination(pagingConfig: PagingModel) {
    this.pageSize = pagingConfig.PageSize;
    this.pageIndex = pagingConfig.PageIndex;
    this.onSearchData(pagingConfig.PageIndex);
  }

  openModalCreate() {
    this.functionCode = FunctionCode.CREATE;
    this.popup.ShowModal();
    this.popupItem = {
      Id: null,
      IsActive: true,
    };
  }

  onOpenModalDisplay(id: number) {
    this.loading = true;
    this.donViTinhService.getUnitById(id).subscribe(
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
    this.donViTinhService.getUnitEditById(id).subscribe(
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

  onSubmitModal(item: UnitModel) {
    this.loading = true;
    if (this.functionCode == FunctionCode.CREATE) {
      this.CreateItem(item);
    } else if (this.functionCode == FunctionCode.EDIT) {
      this.UpdateItem(item);
    }
  }

  onSwitchEdit() {
    this.functionCode = FunctionCode.EDIT;
  }

  onDeleteModal(item: UnitModel) {
    this.onConfirmDel(item, this.popup);
  }

  CreateItem(item: UnitModel) {
    this.donViTinhService.createUnit(item).subscribe(
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

  UpdateItem(item: UnitModel) {
    this.donViTinhService.updateUnit(item).subscribe(
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

  onConfirmDel(item: UnitModel, callback: UnitModalComponent) {
    this.commonService
      .confirm(
        'Xác nhận',
        'Bạn chắc chắn muốn xóa đơn vị tính: ' + item.Name + ' này?',
        ['Có', 'Không']
      )
      .subscribe((answer) => {
        if (answer) {
          this.DeleteItem(item, callback);
        }
      });
  }

  DeleteItem(item: UnitModel, callback: UnitModalComponent) {
    this.loading = true;
    let { Id, Version } = item;
    let itemDel: DeleteModel = { Id, Version };
    this.donViTinhService.deleteUnit(itemDel).subscribe(
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
