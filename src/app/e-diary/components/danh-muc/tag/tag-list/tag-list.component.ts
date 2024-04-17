import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PagingModel } from 'src/app/e-diary/models/Commons/PagingModel';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import { TagFilter, TagModel } from 'src/app/e-diary/models/danh-muc/TagModel';
import {
  UnitFilter,
  UnitModel,
} from 'src/app/e-diary/models/danh-muc/UnitModel';
import { TagService } from 'src/app/e-diary/services/danh-muc/tag.service';
import { UnitService } from 'src/app/e-diary/services/danh-muc/unit.service';
import { FunctionCode, NgSelectMessage } from 'src/app/e-diary/utils/Enum';
import { CommonService } from '../../../../services/common.service';
import { TagModalComponent } from '../tag-modal/tag-modal.component';
import { DeleteModel } from 'src/app/e-diary/models/Commons/DeleteModel';
import { HttpStatusCode } from '@angular/common/http';

declare var $: any;
@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
})
export class TagListComponent {
  loading = false;

  searchForm!: FormGroup;

  lstItem: TagModel[] = [];

  showAdvanceSearch: boolean = false;

  popupItem: TagModel;

  pageIndex: number = 1;
  totalItem: number = 0;
  pageSize: number = 10;
  pageCount: number[] = [];

  listUnitSearch: UnitModel[] = [];
  functionCode?: FunctionCode = null;
  lstFunctionCode: string[];
  lstFunctionCodePopup: string[];

  FunctionCode = FunctionCode;
  ngSelectMessage = NgSelectMessage;

  @ViewChild('popup') popup: TagModalComponent;

  constructor(
    private thongTinService: TagService,
    private titleService: Title,
    public toastr: ToastrService,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private donViTinhService: UnitService
  ) {
    this.searchForm = new FormGroup({
      name: new FormControl(''),
      code: new FormControl(''),
      status: new FormControl(null),
      unitId: new FormControl(null),
    });

    this.titleService.setTitle(this.route.snapshot.data.title);

    this.getListUnit();
    this.onSearchData(1);
  }

  onHideShow() {
    this.showAdvanceSearch = !this.showAdvanceSearch;
  }

  onSearchData(pageIndex: number) {
    this.pageIndex = pageIndex ?? 1;
    this.loading = true;

    let filter: TagFilter = {
      PageIndex: this.pageIndex,
      PageSize: this.pageSize,
      Name: this.searchForm.value.name,
      Code: this.searchForm.value.code,
      IsActive:
        this.searchForm.value.status == 'null'
          ? null
          : this.searchForm.value.status,
      UnitId:
        this.searchForm.value.unitId == 'null'
          ? null
          : this.searchForm.value.unitId,
    };

    this.thongTinService.getThongTinPaging(filter).subscribe(
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

  onOpenModalCreate() {
    this.functionCode = FunctionCode.CREATE;
    this.popup.ShowModal();
    this.popupItem = {
      Id: null,
      IsActive: true,
    };
  }

  onOpenModalDisplay(id: number) {
    this.loading = true;
    this.thongTinService.getItemById(id).subscribe(
      (result: ResponseModel): void => {
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
    this.thongTinService.getItemEditById(id).subscribe(
      (result: ResponseModel): void => {
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

  onSubmitModal(item: TagModel) {
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

  onDeleteModal(item: TagModel) {
    this.onConfirmDel(item, this.popup);
  }

  CreateItem(item: TagModel) {
    this.thongTinService.createThongTin(item).subscribe(
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

  UpdateItem(item: TagModel) {
    this.thongTinService.updateThongTin(item).subscribe(
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

  onConfirmDel(item: TagModel, callback: TagModalComponent) {
    this.commonService
      .confirm(
        'Xác nhận',
        'Bạn chắc chắn muốn xóa thông tin: ' + item.Name + ' này?',
        ['Có', 'Không']
      )
      .subscribe((answer) => {
        if (answer) {
          this.DeleteItem(item, callback);
        }
      });
  }

  DeleteItem(item: TagModel, callback: TagModalComponent) {
    this.loading = true;
    let { Id, Version } = item;
    let itemDel: DeleteModel = { Id, Version };
    this.thongTinService.deleteThongTin(itemDel).subscribe(
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
  //
  onShowAdvanceSearch() {
    this.showAdvanceSearch = !this.showAdvanceSearch;
  }

  getListUnit(): void {
    let donViTinhFilter: UnitFilter = {
      IsActive: true,
    };
    this.donViTinhService
      .getUnitList(donViTinhFilter)
      .subscribe((result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.listUnitSearch = result.Data;
        } else {
          this.toastr.error(
            `${result.Message}`,
            'Load danh sách thiết bị cha lỗi'
          );
        }
      });
  }
}
