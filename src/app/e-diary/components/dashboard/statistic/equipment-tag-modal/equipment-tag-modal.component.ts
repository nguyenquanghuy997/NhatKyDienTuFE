import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';
import moment from 'moment';
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
import { Utility } from 'src/app/e-diary/utils/Utility';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-equipment-tag-modal',
  templateUrl: './equipment-tag-modal.component.html',
  styleUrls: ['./equipment-tag-modal.component.css'],
})
export class EquipmentTagModalComponent {
  @Output() onSubmitModal = new EventEmitter();
  @Output() onHideModal = new EventEmitter();
  searchForm!: FormGroup;
  totalItem: number = 0;
  listEquipment: EquipmentModel[] = [];
  lstTag: any[] = [];
  EquipmentId: number;
  TagId: number;
  labelsChat: string[] = [];
  valuesChat: number[] = [];
  label: string = '';
  dateFromSearch = '';
  dateToSearch = '';
  unitNameYAxis: string = '';
  loading = false;
  lstData: contentStatistic[] = [];
  selectedDateValue: Date[];
  selectedTag: number;
  public chart: any;
  modal;
  @ViewChild('myModalSuggest') myModalSuggest: ElementRef;
  @ViewChild('myChart') myChart: ElementRef<HTMLCanvasElement>;
  constructor(
    private thietBiService: EquipmentService,
    private toastr: ToastrService,
    private router: Router,
    private statisticService: StatisticService,
    private commonService: CommonService
  ) {}
  ngOnInit(): void {
    // this.activatedRoute.queryParams.subscribe((params) => {});
    const currentDate = new Date();
    const startDateDefault = new Date(
      currentDate.getTime() - 10 * 24 * 60 * 60 * 1000
    );
    this.selectedDateValue = [startDateDefault, currentDate]; // Khởi tạo một phạm vi ngày mặc định
    this.searchForm = new FormGroup({
      rangeDate: new FormControl(this.selectedDateValue),
      Equipment: new FormControl(null),
      EquipmentTagId: new FormControl(null),
    });
  }

  initPopup(KeySearch) {
    this.totalItem = 0;
    this.listEquipment = [];
    this.lstTag = [];
    this.labelsChat = [];
    this.valuesChat = [];
    this.label = '';
    this.dateFromSearch = '';
    this.dateToSearch = '';
    this.unitNameYAxis = '';
    this.lstData = [];
    this.searchForm.patchValue({
      Equipment: null,
      EquipmentTagId: null,
    });
    let parentFilter: EquipmentModelFilter = {
      IsActive: true,
      KeySearch: KeySearch,
    };
    this.thietBiService
      .getListEquipmentWithTag(parentFilter)
      .subscribe((result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.listEquipment = result.Data;
          if (this.listEquipment.length > 0) {
            this.searchForm.patchValue({
              Equipment: Object.values(this.listEquipment)[0].Id,
            });
            this.EquipmentId = Object.values(this.listEquipment)[0].Id;
            this.lstTag = Object.values(this.listEquipment)[0].EquipmentTags;
            if (this.lstTag) {
              this.searchForm.controls.EquipmentTagId.setValue(
                this.lstTag[0].Id
              );
            }
          }
          this.loadData();
        } else {
          this.toastr.error(
            `${result.Message}`,
            'Load danh sách thiết bị cha lỗi'
          );
        }
      });
  }

  HideModal() {
    this.modal.hide();
  }

  onHide() {
    this.modal.hide();
    this.onHideModal.emit();
  }
  ShowModal() {
    this.modal = new bootstrap.Modal(this.myModalSuggest.nativeElement);
    this.modal.show();
  }

  onSelectChangeEquipement(event: any) {
    if (event === undefined) return;
    this.EquipmentId = event == 'null' ? null : event.Id;
    this.lstTag = null;
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
    this.label = this.searchForm.controls['Equipment'].value
      ? this.listEquipment.find(
          (x) => x.Id == this.searchForm.controls['Equipment'].value
        ).BreadcrumbName +
        ' - ' +
        tagName
      : '';
    this.unitNameYAxis = this.lstTag.find((x) => x.Id == event).UnitName;
  }

  onClearTag() {
    this.searchForm.controls['EquipmentTagId'].setValue(null);
    this.EquipmentId = null;
    this.label = '';
    this.unitNameYAxis = '';
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
            },
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
    const ctx = this.myChart.nativeElement.getContext('2d');

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.labelsChat,
        datasets: [
          {
            label: this.label,
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

  clearDataChat() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
    this.labelsChat = [];
    this.valuesChat = [];
  }

  onSearch() {
    this.loadData();
  }

  loadData() {
    let dateFrom: Date;
    let dateTo: Date;
    if (this.searchForm.get('rangeDate').value) {
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
          this.loading = false;
          if (res.Data) {
            this.totalItem = res.Data.length;
            res.Data.forEach((element: contentStatistic) => {
              this.labelsChat.push(element.timeFollowStr);
              this.valuesChat.push(parseFloat(element.value) ?? null);
            });
            setTimeout(() => {
              this.createLineChart();
            }, 300);
          }
        } else {
          this.toastr.error(`${res.Message}`, 'lỗi');
        }

        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  redirectStatistic() {
    this.router.navigate([`Statistic/nhat-ky`], {
      queryParams: {
        eqId: this.EquipmentId,
        tagId: this.searchForm.value.EquipmentTagId,
        startDate: this.selectedDateValue[0],
        endDate: this.selectedDateValue[1],
      },
    });
    this.HideModal();
  }
}
