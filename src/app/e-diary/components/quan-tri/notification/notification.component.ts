import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { PagingModel } from 'src/app/e-diary/models/Commons/PagingModel';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import {
  sysUserFilter,
  sysUserModel,
} from 'src/app/e-diary/models/quan-tri/sysUserModel';
import {
  NotificationFilterModel,
  NotificationModel,
} from 'src/app/e-diary/models/quan-tri/NotificationModel';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { NotifcationService } from 'src/app/e-diary/services/quan-tri/notification.service';
import { UserService } from 'src/app/e-diary/services/quan-tri/user.service';
import { ESConst } from 'src/app/e-diary/utils/Const';
import { FunctionCode, NotificationType } from 'src/app/e-diary/utils/Enum';
import { Utility } from 'src/app/e-diary/utils/Utility';
import { DatePipe } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
})
export class NotificationComponent {
  breadcrumbTitle: string = '';
  loading = false;
  showPopup: boolean = false;
  respone: NotificationModel;
  notificationTypeMapping = ESConst.NotificationTypeMapping;
  notificationTypes = Object.values(NotificationType).filter(
    (value) => typeof value === 'number'
  );
  //#region property Search
  lstItem: NotificationModel[] = [];
  pageIndex: number = 1;
  pageSize: number = 10;
  totalItem: number = 0;
  pageCount: number[] = [];
  listUser: sysUserModel[] = [];
  selectedDateValue: Date[];
  //#endregion

  FunctionCode = FunctionCode;
  lstFunctionCode: string[];

  searchForm!: FormGroup;
  bsConfig: Partial<BsDatepickerConfig>;
  datepipe: DatePipe = new DatePipe('en-US');
  constructor(
    private notifcationService: NotifcationService,
    private userService: UserService,
    private toastr: ToastrService,
    private title: Title,
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService
  ) {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    this.selectedDateValue = [yesterday, today];

    this.searchForm = new FormGroup({
      Content: new FormControl(''),
      CreatedUserId: new FormControl(null),
      Type: new FormControl(null),
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
    this.breadcrumbTitle = this.route.snapshot.data.breadcrumbTitle;
    this.title.setTitle(this.route.snapshot.data.title);
    this.getListUser();
    this.onSearchData(1);
  }

  onSearchData(pageIndex?: number) {
    this.loading = true;
    this.pageIndex = pageIndex ?? 1;

    var dateFrom: Date;
    var dateTo: Date;
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
    } else {
      dateFrom = new Date();
      dateTo = new Date();
    }
    let filter: NotificationFilterModel = {
      PageIndex: this.pageIndex,
      PageSize: this.pageSize,
      Content: this.searchForm.get('Content').value ?? undefined,
      CreatedUserId: this.searchForm.get('CreatedUserId').value ?? undefined,
      Type: this.searchForm.get('Type').value ?? undefined,
      fromDate: dateFrom,
      toDate: dateTo,
    };
    this.notifcationService.getPagingItem(filter).subscribe(
      (result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.totalItem = result.Data.TotalRecords;
          this.pageCount = new Array(result.Data.PageCount);
          this.lstItem = result.Data.Items;
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
    this.onSearchData(this.pageIndex);
  }

  getListUser(): void {
    let userFilter: sysUserFilter = {
      IsActive: true,
    };
    this.userService
      .getListItem(userFilter)
      .subscribe((result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.listUser = result.Data;
        } else {
          this.toastr.error(
            `${result.Message}`,
            'Load danh sách người dùng lỗi'
          );
        }
      });
  }
}
