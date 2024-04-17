import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart } from 'chart.js';
import moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import {
  EquipmentModel,
  EquipmentModelFilter,
} from 'src/app/e-diary/models/cau-hinh/EquipmentModel';
import { contentStatistic } from 'src/app/e-diary/models/nhat-ky-van-hanh/ProcessFormModel';
import { DiaryModelFilter } from 'src/app/e-diary/models/tim-kiem/tim-kiem';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { EquipmentService } from 'src/app/e-diary/services/danh-muc/equipment.service';
import { StatisticService } from 'src/app/e-diary/services/dashboard/statistic.service';
import {
  FunctionCode,
  NgSelectMessage,
  ResponseTypeES,
} from 'src/app/e-diary/utils/Enum';
import { Utility } from 'src/app/e-diary/utils/Utility';
declare var $: any;
@Component({
  selector: 'app-index-statistic',
  templateUrl: './index-statistic.component.html',
  styleUrls: ['./index-statistic.component.css'],
})
export class IndexStatisticComponent {
  breadcrumbTitle: string = '';
  loading = false;
  totalItem: number = 0;
  searchForm: FormGroup;
  lstData: contentStatistic[] = [];
  minDate: Date;
  maxDate: Date;
  selectedDateValue: Date[];
  selectedTime: Date = new Date();
  datepickerConfig: Partial<BsDatepickerConfig> = {
    containerClass: 'theme-dark-blue',
    showWeekNumbers: false,
    dateInputFormat: 'YYYY-MM-DD',
  };
  //#region FunctionCodes allow permission
  lstFunctionCode: string[];
  //#endregion
  FunctionCode = FunctionCode;
  listEquipment: EquipmentModel[] = [];
  lstTag: any[] = [];
  EquipmentId: number;
  selectedEquipment: number;
  selectedTag: number;
  labelsChat: string[] = [];
  valuesChat: number[] = [];
  label: string = '';
  unitNameYAxis: string = '';
  dateFromSearch = '';
  dateToSearch = '';
  public chart: any;
  EquipmentSelected: EquipmentModel;
  ngSelectMessage = NgSelectMessage;
  constructor(
    private titleService: Title,
    public toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private thietBiService: EquipmentService,
    private statisticService: StatisticService,
    public router: Router,
    private commonService: CommonService
  ) {}
  ngOnInit(): void {
    this.breadcrumbTitle = this.activatedRoute.snapshot.data.breadcrumbTitle;
    this.titleService.setTitle('Thống kê');
    this.initDataFormSearch();
    this.loading = false;
    let currentDate = new Date();
    let startDateDefault = new Date(
      currentDate.getTime() - 10 * 24 * 60 * 60 * 1000
    );
    // this.selectedDateValue = [startDateDefault, currentDate]; // Khởi tạo một phạm vi ngày mặc định
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params) {
        if (params.eqId) this.EquipmentId = parseInt(params.eqId);
        if (params.tagId) this.selectedTag = parseInt(params.tagId);

        if (params.startDate) {
          startDateDefault = new Date(params.startDate);
        }
        if (params.endDate) {
          currentDate = new Date(params.endDate);
        }
      }
      this.selectedDateValue = [startDateDefault, currentDate];
      this.searchForm = new FormGroup({
        rangeDate: new FormControl(this.selectedDateValue),
        Equipment: new FormControl(null),
        EquipmentTagId: new FormControl(null),
      });
      this.searchForm.patchValue({
        Equipment: this.EquipmentId,
        EquipmentTagId: this.selectedTag,
      });
      if (this.EquipmentId > 0) {
        this.searchForm.controls['Equipment'].setValue(this.EquipmentId);
      }
      this.onSearch();
    });
  }

  createLineChart(): void {
    var options = {
      responsive: true,
      maintainAspectRatio: false,
      title: {
        display: true,
        position: 'top',
        text: 'Line Graph',
        fontSize: 18,
        fontColor: '#111',
      },
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          fontColor: '#333',
          // fontSize: 16,
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Thời gian',
            color: '#911',
            font: {
              weight: 'bold',
              // lineHeight: 1.2,
            },
            // padding: { top: 5, left: 0, right: 0, bottom: 0 },
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            // Include a dollar sign in the ticks
            callback: function (value, index, ticks) {
              // return '$' + value;
              return value;
            },
          },

          title: {
            display: true,
            text: 'Đơn vị tính (' + this.unitNameYAxis + ')',
            color: '#191',
          },
        },
      },
    };
    const canvas = document.getElementById('myChart') as HTMLCanvasElement;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.labelsChat,
          datasets: [
            {
              label: this.label, //'Dữ Liệu Biểu Đồ Đường',
              data: this.valuesChat,
              // borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
              pointRadius: 5,
              backgroundColor: 'blue',
              borderColor: 'lightblue',
              fill: false,
            },
          ],
        },
        options: options,
      });
    }
  }
  clearDataChat() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
    this.labelsChat = [];
    this.valuesChat = [];
  }
  initDataFormSearch() {
    this.getListEquipment();
  }

  loadData() {
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
      this.dateFromSearch = moment(
        this.searchForm.get('rangeDate').value[0]
      ).format('DD/MM/YYYY');

      this.dateToSearch = moment(
        this.searchForm.get('rangeDate').value[1]
      ).format('DD/MM/YYYY');
    } else {
      this.dateFromSearch = '';
      this.dateToSearch = '';
    }

    let diaryModelFilter: DiaryModelFilter = {
      KeySearch: this.searchForm.value.KeySearch,
      Code: this.searchForm.value.code,
      fromDate: dateFrom,
      toDate: dateTo,
      equipmentId: this.EquipmentId,
      equipmentTagId:
        this.searchForm.value.EquipmentTagId == 'null'
          ? null
          : this.searchForm.value.EquipmentTagId,
    };
    this.loading = true;
    this.clearDataChat();
    this.statisticService.getDataStatistic(diaryModelFilter).subscribe(
      (res: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(res)) {
          this.lstData = res.Data;
          if (res.Data) {
            this.totalItem = res.Data.length;
            res.Data.forEach((element: contentStatistic) => {
              this.labelsChat.push(element.timeFollowStr);
              this.valuesChat.push(parseFloat(element.value) ?? null);
            });
            setTimeout(() => {
              this.createLineChart();
            }, 300);
          } else {
            this.totalItem = 0;
          }
        } else {
          this.toastr.error(`${res.Message}`, 'lỗi');
        }
        this.lstFunctionCode = res.FunctionCodes;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  public onSearch(reset: boolean = false): void {
    this.loadData();
  }

  getListEquipment(reset: boolean = false): void {
    let equipmentFilter: EquipmentModelFilter = {
      IsActive: true,
    };
    this.thietBiService
      .getListEquipmentWithTag(equipmentFilter)
      .subscribe((result: ResponseModel) => {
        if (result.Type == ResponseTypeES.Success) {
          this.listEquipment = result.Data;
          this.EquipmentSelected = this.listEquipment.find(
            (x) => x.Id == this.EquipmentId
          );
          if (this.EquipmentSelected)
            this.lstTag = this.EquipmentSelected.EquipmentTags;
        } else if (result.Type == ResponseTypeES.Warning) {
          this.toastr.warning(`${result.Message}`, 'Cảnh báo');
        } else {
          this.toastr.error(`${result.Message}`, 'Load danh sách thiết bị lỗi');
        }
      });
  }

  onSelectChangeEquipement(event: any) {
    if (event === undefined) return;
    this.EquipmentId = event == 'null' ? null : event.Id;
    this.searchForm.controls['EquipmentTagId'].setValue(null);
    this.lstTag = event.EquipmentTags;
    this.label = event.BreadcrumbName;
    this.unitNameYAxis = '';
  }

  onClearEquipment() {
    this.searchForm.controls['EquipmentTagId'].setValue(null);
    this.EquipmentId = null;
    this.lstTag = null;
    this.label = '';
    this.unitNameYAxis = '';
  }

  onSelectChangeTag(event: any) {
    if (event === undefined) return;
    let tagName = this.lstTag.find((x) => x.Id == event).TagName;
    if (this.EquipmentId) {
      this.EquipmentSelected = this.listEquipment.find(
        (x) => x.Id == this.EquipmentId
      );
      this.label = this.EquipmentSelected.BreadcrumbName + ' - ' + tagName;
    } else this.label = '';
    this.unitNameYAxis = this.lstTag.find((x) => x.Id == event).UnitName;
  }

  onClearTag() {
    this.searchForm.controls['EquipmentTagId'].setValue(null);
    this.EquipmentId = null;
    this.label = this.searchForm.controls['Equipment'].value
      ? this.listEquipment.find(
          (x) => x.Id == this.searchForm.controls['Equipment'].value
        ).BreadcrumbName
      : '';
    this.unitNameYAxis = '';
  }
}
export const DateTimeValidator = (fc: FormControl) => {
  const date = new Date(fc.value);
  const isValid = !isNaN(date.valueOf());
  return isValid
    ? null
    : {
        isValid: {
          valid: false,
        },
      };
};
