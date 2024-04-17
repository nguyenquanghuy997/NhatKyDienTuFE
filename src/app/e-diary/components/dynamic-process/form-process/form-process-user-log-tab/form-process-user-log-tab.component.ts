import { HttpStatusCode } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { PagingModel } from 'src/app/e-diary/models/Commons/PagingModel';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import {
  UserLogFilterModel,
  UserLogModel,
} from 'src/app/e-diary/models/quan-tri/UserLogModel';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { ProcessFormService } from 'src/app/e-diary/services/dynamic-process/process-form.service';
import { FunctionCode } from 'src/app/e-diary/utils/Enum';
import { Utility } from 'src/app/e-diary/utils/Utility';

@Component({
  selector: 'app-form-process-user-log-tab',
  templateUrl: './form-process-user-log-tab.component.html',
  styleUrls: ['./form-process-user-log-tab.component.css'],
})
export class FormProcessUserLogTabComponent {
  @Input() RefId!: number;
  @Input() RefTypeId!: number;
  @Input() FlowId!: number;

  loading = false;
  popupItem: UserLogModel;

  //#region property Search
  searchForm!: FormGroup;
  lstItem: UserLogModel[] = [];
  showAdvanceSearch: boolean = false;
  pageIndex: number = 1;
  pageSize: number = 10;
  totalItem: number = 0;
  pageCount: number[] = [];
  bsConfig: Partial<BsDatepickerConfig>;
  //#endregion

  //#region FunctionCodes allow permission
  functionCode?: FunctionCode = null;
  lstFunctionCode: string[];
  lstFunctionCodePopup: string[];
  FunctionCode = FunctionCode;
  selectedDateValue: Date[];
  //#endregion

  constructor(
    private processFormService: ProcessFormService,
    private toastr: ToastrService,
    private router: Router,
    private commonService: CommonService
  ) {
    this.searchForm = new FormGroup({
      Username: new FormControl(''),
      FeatureName: new FormControl(''),
      FunctionName: new FormControl(''),
      rangeDate: new FormControl(this.selectedDateValue),
    });

    this.bsConfig = {
      rangeInputFormat: 'DD/MM/YYYY',
      dateInputFormat: 'DD/MM/YYYY',
      showWeekNumbers: false,
      isAnimated: true,
    };
  }

  ngOnInit(): void {
    this.onSearchData(1);
  }

  onSearchData(pageIndex?: number) {
    this.loading = true;
    this.pageIndex = pageIndex ?? 1;

    let dateFrom: Date;
    let dateTo: Date;
    if (
      this.searchForm.get('rangeDate').value &&
      this.searchForm.get('rangeDate').value[0] != null &&
      this.searchForm.get('rangeDate').value[1] != null
    ) {
      dateFrom = new Date(
        Utility.fncOffsetTimeUtc(this.searchForm.get('rangeDate').value[0])
      );
      dateTo = new Date(
        Utility.fncOffsetTimeUtc(this.searchForm.get('rangeDate').value[1])
      );
    }

    let filter: UserLogFilterModel = {
      PageIndex: this.pageIndex,
      PageSize: this.pageSize,
      RefId: this.RefId,
      RefTypeId: this.RefTypeId,
      FunctionName: this.searchForm.value.FunctionName,
      Username: this.searchForm.value.Username,
      fromDate: dateFrom,
      toDate: dateTo,
    };
    this.processFormService.getPagingUserLog(filter).subscribe(
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

  onOpenModalDisplay(id: number) {
    this.loading = true;
    this.processFormService.getUserLogById(id, this.RefTypeId).subscribe(
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
        this.onShowModal();
        this.popupItem = result.Data;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  onHideModal() {
    this.lstFunctionCodePopup = [];
    ($('#UserLogModal') as any).modal('hide');
  }

  onShowModal() {
    ($('#UserLogModal') as any).modal('show');
  }
}
