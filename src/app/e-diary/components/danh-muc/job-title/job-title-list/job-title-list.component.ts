import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  JobTitleFilter,
  JobTitleModel,
} from 'src/app/e-diary/models/danh-muc/JobTitleModel';
import { FunctionCode } from 'src/app/e-diary/utils/Enum';
import { JobTitleModalComponent } from '../job-title-modal/job-title-modal.component';
import { JobTitleService } from 'src/app/e-diary/services/danh-muc/job-title.service';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import { PagingModel } from 'src/app/e-diary/models/Commons/PagingModel';
import { DeleteModel } from 'src/app/e-diary/models/Commons/DeleteModel';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-job-title-list',
  templateUrl: './job-title-list.component.html',
  styleUrls: ['./job-title-list.component.css'],
})
export class JobTitleListComponent {
  loading = false;

  //#region Propeties Index
  searchForm!: FormGroup;

  lstItem: JobTitleModel[] = [];

  showAdvanceSearch: boolean = false;

  pageIndex: number = 1;
  pageSize: number = 10;
  totalItem: number = 0;
  pageCount: number[] = [];
  //#endregion

  //#region Properties Popup
  functionCode?: FunctionCode = null;
  popupItem: JobTitleModel;

  //#region FunctionCodes allow permission
  lstFunctionCode: string[];
  lstFunctionCodePopup: string[];
  //#endregion

  FunctionCode = FunctionCode;
  @ViewChild('popup') popup: JobTitleModalComponent;
  //#endregion

  constructor(
    private jobTitleService: JobTitleService,
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

  //#region Search
  onSearchData(pageIndex?: number) {
    this.pageIndex = pageIndex ?? 1;
    this.loading = true;
    let filter: JobTitleFilter = {
      PageIndex: this.pageIndex,
      PageSize: this.pageSize,
      Name: this.searchForm.value.Name,
      IsActive:
        this.searchForm.value.IsActive == 'null'
          ? null
          : this.searchForm.value.IsActive,
    };

    this.jobTitleService.getJobTitlePaging(filter).subscribe(
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
    this.functionCode = FunctionCode.CREATE;
    this.popup.ShowModal();
    this.popupItem = {
      IsActive: true,
    };
  }

  onOpenModalDisplay(id: number, isEdit: boolean) {
    this.loading = true;
    this.jobTitleService.getJobTitleById(id).subscribe(
      (result: any) => {
        if (!this.commonService.checkTypeResponseData(result)) {
          this.toastr.error(`${result.Message}`, 'Lỗi');
          this.loading = false;
          return;
        }
        this.lstFunctionCodePopup = result.FunctionCodes;
        if (isEdit) {
          if (!result.FunctionCodes.includes(FunctionCode.EDIT)) {
            this.toastr.error(
              `Không có quyền xem chi tiết bản ghi`,
              'Không có quyền!'
            );
            return;
          }
          this.functionCode = FunctionCode.EDIT;
        } else {
          if (!result.FunctionCodes.includes(FunctionCode.DISPLAY)) {
            this.toastr.error(
              `Không có quyền xem chi tiết bản ghi`,
              'Không có quyền!'
            );
            return;
          }
          this.functionCode = FunctionCode.DISPLAY;
        }

        this.popupItem = result.Data;
        this.popup.ShowModal();
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  onSubmitModal(item: JobTitleModel) {
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

  onDeleteModal(item: JobTitleModel) {
    this.onConfirmDel(item, this.popup);
  }
  //#endregion

  //#region Addnew-Edit
  CreateItem(item: JobTitleModel) {
    this.jobTitleService.createJobTitle(item).subscribe(
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

  UpdateItem(item: JobTitleModel) {
    this.jobTitleService.updateJobTitle(item).subscribe(
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
  onConfirmDel(item: JobTitleModel, callback: JobTitleModalComponent) {
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

  DeleteItem(item: JobTitleModel, callback: JobTitleModalComponent) {
    this.loading = true;
    let { Id, Version } = item;
    let itemDel: DeleteModel = { Id, Version };
    this.jobTitleService.deleteJobTitle(itemDel).subscribe(
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
