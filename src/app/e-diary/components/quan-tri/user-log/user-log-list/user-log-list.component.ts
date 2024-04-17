import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
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
import { UserLogService } from 'src/app/e-diary/services/quan-tri/user-log.service';
import { FunctionCode } from 'src/app/e-diary/utils/Enum';
import { Utility } from 'src/app/e-diary/utils/Utility';
import { UserLogModalComponent } from '../user-log-modal/user-log-modal.component';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-user-log-list',
  templateUrl: './user-log-list.component.html',
  styleUrls: ['./user-log-list.component.css'],
})
export class UserLogListComponent {
  breadcrumbTitle: string = '';
  loading = false;
  showPopup: boolean = false;
  respone: UserLogModel;

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
  //#endregion

  @ViewChild('popup') popup: UserLogModalComponent;

  constructor(
    private userLogService: UserLogService,
    private toastr: ToastrService,
    private title: Title,
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService
  ) {
    this.searchForm = new FormGroup({
      Username: new FormControl(''),
      FeatureName: new FormControl(''),
      FunctionName: new FormControl(''),
      rangeDate: new FormControl(null),
    });

    this.bsConfig = {
      rangeInputFormat: 'DD/MM/YYYY',
      dateInputFormat: 'DD/MM/YYYY',
      showWeekNumbers: false,
      isAnimated: true,
    };
  }

  ngOnInit(): void {
    this.breadcrumbTitle = this.route.snapshot.data.breadcrumbTitle;
    this.title.setTitle(this.route.snapshot.data.title);
    this.onSearchData(1);
  }

  onSearchData(pageIndex?: number) {
    this.loading = true;
    if (this.pageIndex != (pageIndex ?? 1)) this.pageIndex = pageIndex ?? 1;

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
      FeatureName: this.searchForm.value.FeatureName,
      FunctionName: this.searchForm.value.FunctionName,
      Username: this.searchForm.value.Username,
      fromDate: dateFrom,
      toDate: dateTo,
    };
    this.userLogService.getPagingItem(filter).subscribe(
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
    this.onSearchData(this.pageIndex);
  }

  onOpenModalDisplay(id: number) {
    this.loading = true;
    this.userLogService.getItemById(id).subscribe(
      (result: any) => {
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
        this.showPopup = true;
        this.popup.ShowModal();
        this.respone = result.Data;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  onHideModal() {
    this.showPopup = false;
    this.lstFunctionCodePopup = [];
  }
}
