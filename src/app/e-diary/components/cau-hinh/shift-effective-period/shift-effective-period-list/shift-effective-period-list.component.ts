import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PagingModel } from 'src/app/e-diary/models/Commons/PagingModel';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import { ShiftCategoryModel } from 'src/app/e-diary/models/danh-muc/ShiftCategoryModel';
import {
  ShiftEffectivePeriodFilter,
  ShiftEffectivePeriodModel,
} from 'src/app/e-diary/models/danh-muc/ShiftEffectivePeriodModel';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { ShiftCategoryService } from 'src/app/e-diary/services/danh-muc/shift-category.service';
import { ShiftEffectivePeriodService } from 'src/app/e-diary/services/danh-muc/shift-effective-period.service';
import { FunctionCode, NgSelectMessage } from 'src/app/e-diary/utils/Enum';
import { ShiftEffectivePeriodConfigModalComponent } from '../shift-effective-period-config-modal/shift-effective-period-config-modal.component';
import { JobTitleModel } from 'src/app/e-diary/models/danh-muc/JobTitleModel';
import { ShiftEffectivePeriodEditModalComponent } from '../shift-effective-period-edit-modal/shift-effective-period-edit-modal.component';
import { DeleteModel } from 'src/app/e-diary/models/Commons/DeleteModel';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-shift-effective-period-list',
  templateUrl: './shift-effective-period-list.component.html',
  styleUrls: ['./shift-effective-period-list.component.css'],
})
export class ShiftEffectivePeriodComponent {
  loading = false;

  //#region Propeties Index
  searchForm!: FormGroup;

  lstShiftCategory: ShiftCategoryModel[] = [];
  lstJobTitle: JobTitleModel[] = [];
  lstItem: ShiftEffectivePeriodModel[] = [];

  showAdvanceSearch: boolean = false;

  pageIndex: number = 1;
  pageSize: number = 10;
  totalItem: number = 0;
  pageCount: number[] = [];
  //#endregion

  //#region Properties Popup
  functionCodeConfig?: FunctionCode = null;
  popupConfigItem: ShiftEffectivePeriodModel;
  popupEditItem: ShiftEffectivePeriodModel;

  //#region FunctionCodes allow permission
  lstFunctionCode: string[];
  lstFunctionCodePopup: string[];
  //#endregion

  FunctionCode = FunctionCode;
  ngSelectMessage = NgSelectMessage;
  @ViewChild('popupConfig')
  popupConfig: ShiftEffectivePeriodConfigModalComponent;
  @ViewChild('popupEdit') popupEdit: ShiftEffectivePeriodEditModalComponent;
  //#endregion
  constructor(
    private shiftCategoryService: ShiftCategoryService,
    private shiftEffectivePeriodService: ShiftEffectivePeriodService,
    private commonService: CommonService,
    private toastr: ToastrService,
    private title: Title,
    private route: ActivatedRoute
  ) {
    this.searchForm = new FormGroup({
      Name: new FormControl(''),
      ShiftCategoryId: new FormControl(null),
      IsActive: new FormControl(true),
    });

    this.title.setTitle(this.route.snapshot.data.title);

    this.onSearchData(1);

    this.shiftCategoryService
      .getListShiftCategory({ IsActive: true })
      .subscribe((result: ResponseModel) => {
        this.lstShiftCategory = result.Data;
      });
  }

  //#region Search
  onSearchData(pageIndex?: number) {
    this.pageIndex = pageIndex ?? 1;
    this.loading = true;
    let filter: ShiftEffectivePeriodFilter = {
      PageIndex: this.pageIndex,
      PageSize: this.pageSize,
      Name: this.searchForm.value.Name,
      ShiftCategoryId: this.searchForm.value.ShiftCategoryId,
      IsActive:
        this.searchForm.value.IsActive == 'null'
          ? null
          : this.searchForm.value.IsActive,
    };

    this.shiftEffectivePeriodService
      .getShiftEffectivePeriodPaging(filter)
      .subscribe(
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
    this.functionCodeConfig = FunctionCode.CREATE;
    this.popupConfigItem = {
      Id: null,
      IsActive: true,
    };
    this.popupConfig.ShowModal();
  }

  onOpenModalDisplay(id: number) {
    this.loading = true;
    this.shiftEffectivePeriodService.getShiftEffectivePeriodById(id).subscribe(
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
        this.functionCodeConfig = FunctionCode.DISPLAY;

        this.popupConfigItem = result.Data;
        this.popupConfig.ShowModal();
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  onOpenModalConfig(id: number) {
    this.loading = true;
    this.shiftEffectivePeriodService
      .getShiftEffectivePeriodEditById(id)
      .subscribe(
        (result: any) => {
          if (!this.commonService.checkTypeResponseData(result)) {
            this.toastr.error(`${result.Message}`, 'Lỗi');
            this.loading = false;
            return;
          }
          this.lstFunctionCodePopup = result.FunctionCodes;
          if (!result.FunctionCodes.includes(FunctionCode.EDIT)) {
            this.toastr.error(
              `Không có quyền cấu hình bản ghi`,
              'Không có quyền!'
            );
            return;
          }
          this.functionCodeConfig = FunctionCode.EDIT;

          this.popupConfigItem = result.Data;
          this.popupConfig.ShowModal();
          this.loading = false;
        },
        (error) => {
          this.loading = false;
        }
      );
  }

  onOpenModalEdit(id: number) {
    this.loading = true;
    this.shiftEffectivePeriodService
      .getShiftEffectivePeriodEditById(id)
      .subscribe(
        (result: any) => {
          if (!this.commonService.checkTypeResponseData(result)) {
            this.toastr.error(`${result.Message}`, 'Lỗi');
            this.loading = false;
            return;
          }
          this.lstFunctionCodePopup = result.FunctionCodes;
          if (!result.FunctionCodes.includes(FunctionCode.EDIT)) {
            this.toastr.error(`Không có quyền sửa bản ghi`, 'Không có quyền!');
            return;
          }

          this.popupEditItem = result.Data;
          this.popupEdit.ShowModal();
          this.loading = false;
        },
        (error) => {
          this.loading = false;
        }
      );
  }

  onSubmitEditModal(item: ShiftEffectivePeriodModel) {
    this.loading = true;

    this.UpdateEditItem(item);
  }

  onSubmitConfigModal(item: ShiftEffectivePeriodModel) {
    this.loading = true;
    // check thời gian trùng
    if (this.functionCodeConfig == FunctionCode.CREATE) {
      this.CreateItem(item);
    } else if (
      this.functionCodeConfig == FunctionCode.EDIT ||
      this.functionCodeConfig == FunctionCode.DISPLAY
    ) {
      this.UpdateConfigItem(item);
    }
  }

  onDeleteModal(item: ShiftEffectivePeriodModel) {
    this.onConfirmDel(item, this.popupConfig);
  }

  onSwitchConfig() {
    this.functionCodeConfig = FunctionCode.EDIT;
  }
  //#endregion

  //#region Addnew-Edit
  CreateItem(item: ShiftEffectivePeriodModel) {
    this.shiftEffectivePeriodService.createShiftEffectivePeriod(item).subscribe(
      (result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.toastr.success('Thêm mới thành công!', 'Thành công');
          this.popupConfig.HideModal();
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

  UpdateConfigItem(item: ShiftEffectivePeriodModel) {
    this.shiftEffectivePeriodService
      .updateConfigShiftEffectivePeriod(item)
      .subscribe(
        (result: ResponseModel) => {
          if (this.commonService.checkTypeResponseData(result)) {
            this.toastr.success('Cấu hình thành công!', 'Thành công');
            this.popupConfig.HideModal();
            this.onSearchData(this.pageIndex);
          } else {
            this.toastr.error(`${result.Message}`, 'Cấu hình lỗi');
          }
          this.loading = false;
        },
        (error) => {
          this.loading = false;
        }
      );
  }

  UpdateEditItem(item: ShiftEffectivePeriodModel) {
    this.shiftEffectivePeriodService
      .updateEditShiftEffectivePeriod(item)
      .subscribe(
        (result: ResponseModel) => {
          if (this.commonService.checkTypeResponseData(result)) {
            this.toastr.success('Cập nhật thành công!', 'Thành công');
            this.popupEdit.HideModal();
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
    item: ShiftEffectivePeriodModel,
    callback: ShiftEffectivePeriodConfigModalComponent
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

  DeleteItem(
    item: ShiftEffectivePeriodModel,
    callback: ShiftEffectivePeriodConfigModalComponent
  ) {
    this.loading = true;
    let { Id, Version } = item;
    let itemDel: DeleteModel = { Id, Version };
    this.shiftEffectivePeriodService
      .deleteShiftEffectivePeriod(itemDel)
      .subscribe(
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

  UpdateColor(event, item: ShiftEffectivePeriodModel) {
    this.loading = true;
    item.ShiftComponentModels = null;
    item.ShiftModels = null;
    item.Color = event;
    this.shiftEffectivePeriodService
      .updateColorShiftEffectivePeriod(item)
      .subscribe(
        (result: ResponseModel) => {
          if (this.commonService.checkTypeResponseData(result)) {
            this.toastr.info('Thay đổi màu thành công!', 'Thành công', {
              positionClass: 'toast-bottom-right',
            });
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
