import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { FullCalendarComponent } from '@fullcalendar/angular';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import viLocale from '@fullcalendar/core/locales/vi';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import moment from 'moment';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import {
  ShiftScheduleDeleteModel,
  ShiftScheduleFilter,
  ShiftScheduleModel,
} from 'src/app/e-diary/models/cau-hinh/ShiftScheduleModel';
import { ShiftCategoryModel } from 'src/app/e-diary/models/danh-muc/ShiftCategoryModel';
import { ShiftScheduleService } from 'src/app/e-diary/services/cau-hinh/shiftSchedule.service';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { ShiftCategoryService } from 'src/app/e-diary/services/danh-muc/shift-category.service';
import { FunctionCode, NgSelectMessage } from 'src/app/e-diary/utils/Enum';
import { ShiftScheduleModalComponent } from '../shift-schedule-modal/shift-schedule-modal.component';
import { Utility } from 'src/app/e-diary/utils/Utility';
import { error } from 'console';
import { HttpStatusCode } from '@angular/common/http';
@Component({
  selector: 'app-shift-schedule-list',
  templateUrl: './shift-schedule-list.component.html',
  styleUrls: ['./shift-schedule-list.component.css'],
})
export class ShiftScheduleListComponent {
  loading = false;

  //#region Propeties Index
  searchForm!: FormGroup;

  lstItem: ShiftScheduleModel[] = [];
  // lstItemPagination: ShiftScheduleModel[] = [];
  shiftCategoryItem: ShiftCategoryModel = {};

  showAdvanceSearch: boolean = false;

  pageIndex: number = 1;
  pageSize: number = 10;
  totalItem: number = 0;
  pageCount: number[] = [];
  bsValue = new Date();
  //#endregion

  //#region Properties Popup
  functionCode?: FunctionCode = null;
  popupItem: ShiftScheduleModel;
  lstShiftCategory: ShiftCategoryModel[];

  //#region FunctionCodes allow permission
  lstFunctionCode: string[];
  lstFunctionCodePopup: string[];
  //#endregion

  ngSelectMessage = NgSelectMessage;

  FunctionCode = FunctionCode;
  @ViewChild('popup') popup: ShiftScheduleModalComponent;
  @ViewChild('fullcalendar') calendarComponent: FullCalendarComponent;
  //#endregion

  //DateShow
  eventItems: EventInput[] = [];
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    selectable: true,
    plugins: [bootstrapPlugin, interactionPlugin, dayGridPlugin, listPlugin],
    locale: viLocale,
    themeSystem: 'bootstrap',
    eventDisplay: 'block',
    // editable: true,
    height: 620,
    events: this.eventItems,
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      meridiem: false,
    },
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,listWeek',
    },
    showNonCurrentDates: false,
    fixedWeekCount: false,
    //dayMaxEvents: 2, // for all non-TimeGrid views
    eventClick: (info) => {
      this.onOpenModalDisplay(
        info.event.extendedProps.ShiftEffectivePeriodId,
        info.event.extendedProps.StartDTG,
        false
      );
    },
    select: (info) => {
      let endDate = new Date(info.end);
      endDate.setDate(endDate.getDate() - 1);
      this.detectActionSelect(info.start, endDate);
    },
    customButtons: {
      next: {
        click: this.nextMonth.bind(this),
      },
      prev: {
        click: this.prevMonth.bind(this),
      },
      today: {
        click: this.todayMonth.bind(this),
        text: 'Hôm nay',
      },
    },
  };
  //

  constructor(
    private shiftScheduleService: ShiftScheduleService,
    private shiftCategoryService: ShiftCategoryService,
    private commonService: CommonService,
    private toastr: ToastrService,
    private title: Title,
    private route: ActivatedRoute,
    private changeDetec: ChangeDetectorRef
  ) {
    this.searchForm = new FormGroup({
      ShiftCategoryId: new FormControl(null),
      rangeDate: new FormControl(this.currentMonth()),
    });

    this.shiftCategoryService
      .getListShiftCategory({ IsActive: true })
      .subscribe((result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.lstShiftCategory = result.Data;
          if (this.lstShiftCategory && this.lstShiftCategory.length > 0) {
            this.searchForm.controls.ShiftCategoryId.setValue(
              this.lstShiftCategory[0].Id
            );
            this.shiftCategoryItem = this.lstShiftCategory[0];
          }
          this.onSearchData(1);
        } else {
          this.toastr.error(`${result.Message}`, 'Lỗi');
        }
      });

    this.title.setTitle(this.route.snapshot.data.title);
  }

  ngAfterContentChecked() {
    this.changeDetec.detectChanges();
  }

  //#region Search
  onSearchData(pageIndex?: number) {
    this.pageIndex = pageIndex ?? 1;
    this.loading = true;
    let fromDate: Date;
    let toDate: Date;
    if (
      this.searchForm.get('rangeDate').value &&
      this.searchForm.get('rangeDate').value[0] != null &&
      this.searchForm.get('rangeDate').value[1] != null
    ) {
      fromDate = new Date(
        Utility.fncOffsetTimeUtc(this.searchForm.get('rangeDate').value[0])
      );
      toDate = new Date(
        Utility.fncOffsetTimeUtc(this.searchForm.get('rangeDate').value[1])
      );
    }

    let filter: ShiftScheduleFilter = {
      PageIndex: this.pageIndex,
      PageSize: this.pageSize,
      fromDate: fromDate,
      toDate: toDate,
      ShiftCategoryId: this.searchForm.controls.ShiftCategoryId.value,
    };

    this.shiftScheduleService.getListShiftSchedule(filter).subscribe(
      (result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.totalItem = result.Data.length;
          this.lstItem = result.Data;
          // this.lstItemPagination = this.paginate(
          //   this.lstItem,
          //   this.pageSize,
          //   this.pageIndex
          // );
          this.eventItems = [];
          this.lstItem.forEach((item) => {
            let startDate = moment(item.StartDTG)
              .locale('vi-VN')
              .format('dddd');

            item.StartDTGString =
              startDate.charAt(0).toUpperCase() +
              startDate.slice(1) +
              ' ngày ' +
              moment(item.StartDTG).locale('vi-VN').format('DD/MM/YYYY');

            let arrayChild = this.lstItem.filter(
              (p) =>
                moment(item.StartDTG).locale('vi-VN').format('DD/MM/YYYY') ==
                moment(p.StartDTG).locale('vi-VN').format('DD/MM/YYYY')
            );

            item.ChildIds = arrayChild.map((a) => a.Id);
            this.eventItems.push({
              start: item.StartDTG,
              end: item.EndDTG,
              title: `${item.ShiftName} (${moment(item.StartDTG).format(
                'HH:mm'
              )} - ${moment(item.EndDTG).format('HH:mm')})`,
              color: item.ShiftEffectivePeriodColor,
              id: item.Id.toString(),
              extendedProps: {
                ShiftEffectivePeriodId: item.ShiftEffectivePeriodId,
                StartDTG: item.StartDTG,
              },
            });
          });
          this.calendarOptions.events = this.eventItems;
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
  // onChangePagination(pagingConfig: PagingModel) {
  //   this.pageSize = pagingConfig.PageSize;
  //   this.pageIndex = pagingConfig.PageIndex;
  //   this.lstItemPagination = this.paginate(
  //     this.lstItem,
  //     pagingConfig.PageSize,
  //     pagingConfig.PageIndex
  //   );
  // }

  // paginate(array, page_size, page_number) {
  //   if (array.length > 0) {
  //     this.pageCount = new Array(Math.ceil(array.length / page_size));
  //   } else {
  //     this.pageCount = new Array(0);
  //   }
  //   let result = array.slice(
  //     (page_number - 1) * page_size,
  //     page_number * page_size
  //   );
  //   let index = 0;
  //   result.forEach((item) => {
  //     let arrayChild = result.filter(
  //       (p) =>
  //         moment(item.StartDTG).locale('vi-VN').format('DD/MM/YYYY') ==
  //         moment(p.StartDTG).locale('vi-VN').format('DD/MM/YYYY')
  //     );
  //     item.ChildNumber = arrayChild.length;
  //     item.ChildFirst = arrayChild[0].Id == item.Id ? true : false;
  //     item.index = item.ChildFirst ? index++ : index;
  //   });
  //   return result;
  // }
  //#endregion

  //#region Popup
  onOpenModalCreate(startDate = new Date(), endDate = new Date()) {
    this.functionCode = FunctionCode.CREATE;
    this.popup.ShowModal();
    this.popupItem = { Id: null, StartDTG: startDate, EndDTG: endDate };
  }

  onOpenModalDisplay(id: number, date: Date, isEdit: boolean) {
    this.loading = true;
    this.shiftScheduleService
      .getShiftScheduleByShiftEffectivePeriodId({
        ShiftEffectivePeriodId: id,
        StartDTG: date,
      })
      .subscribe(
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
          this.popupItem.StartDTG = new Date(this.popupItem.StartDTG);
          this.popupItem.StartDTG.setHours(10);
          this.popupItem.EndDTG = this.popupItem.StartDTG;
          this.popup.ShowModal();
          this.loading = false;
        },
        (error) => {
          this.loading = false;
        }
      );
  }

  onSubmitModal(item: ShiftScheduleModel) {
    this.loading = true;
    item.ShiftScheduleMembers = item.ShiftScheduleMembers.filter(
      (p) => p.UserId
    );
    //check thời gian trùng
    if (this.functionCode == FunctionCode.CREATE) {
      this.CreateItem(item);
    } else if (this.functionCode == FunctionCode.EDIT) {
      this.UpdateItem(item);
    }
  }

  onSwitchEdit() {
    this.functionCode = FunctionCode.EDIT;
  }

  onDeleteModal(item: ShiftScheduleModel) {
    this.onConfirmDel(item, this.popup);
  }
  //#endregion

  //#region Addnew-Edit
  CreateItem(item: ShiftScheduleModel) {
    this.shiftScheduleService.createShiftSchedule(item).subscribe(
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

  UpdateItem(item: ShiftScheduleModel) {
    this.shiftScheduleService.updateShiftSchedule(item).subscribe(
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
  onDelete(item: ShiftScheduleModel) {
    item.ShiftScheduleIds = item.ChildIds;
    this.onConfirmDel(item, this.popup);
  }

  onConfirmDel(
    item: ShiftScheduleModel,
    callback: ShiftScheduleModalComponent
  ) {
    this.commonService
      .confirm('Xác nhận', 'Bạn chắc chắn muốn xóa bản ghi này?', [
        'Có',
        'Không',
      ])
      .subscribe((answer) => {
        if (answer) {
          this.DeleteItem(item, callback);
        }
      });
  }

  DeleteItem(item: ShiftScheduleModel, callback: ShiftScheduleModalComponent) {
    this.loading = true;
    let { Id, ShiftScheduleIds } = item;
    let itemDel: ShiftScheduleDeleteModel = { Id, ShiftScheduleIds };
    this.shiftScheduleService.deleteShiftSchedule(itemDel).subscribe(
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

  changeShiftCategory() {
    this.shiftCategoryItem = this.lstShiftCategory.find((p) => {
      return p.Id == this.searchForm.controls.ShiftCategoryId.value;
    });
    this.onSearchData();
  }

  changeDate(date) {
    if (this.calendarComponent) {
      this.searchForm.controls.rangeDate.setValue([
        new Date(date.getFullYear(), date.getMonth(), 1),
        new Date(date.getFullYear(), date.getMonth() + 1, 0),
      ]);
      const calendarApi = this.calendarComponent.getApi();
      calendarApi.gotoDate(date);
      this.onSearchData();
    }
  }

  // Calender
  nextMonth(e) {
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.next();
    this.bsValue = calendarApi.view.currentStart;
  }

  prevMonth(e) {
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.prev();
    this.bsValue = calendarApi.view.currentStart;
  }

  currentMonth() {
    let date = new Date();
    return [
      new Date(date.getFullYear(), date.getMonth(), 1),
      new Date(date.getFullYear(), date.getMonth() + 1, 0),
    ];
  }

  todayMonth() {
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.today();
    this.bsValue = new Date();
  }

  detectActionSelect(start, end) {
    if (
      start.getTime() == end.getTime() &&
      this.lstItem.some(
        (p) => new Date(p.StartDTG).getDate() == start.getDate()
      )
    ) {
      let firstItem = this.lstItem.find(
        (p) => new Date(p.StartDTG).getDate() == start.getDate()
      );
      this.onOpenModalDisplay(
        firstItem.ShiftEffectivePeriodId,
        firstItem.StartDTG,
        false
      );
      return;
    }
    this.onOpenModalCreate(start, end);
  }
  //
}
