import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PagingConfig } from 'src/app/e-diary/models/PagingConfig';
import { formMauModel } from 'src/app/e-diary/models/form-mau';
import {
  FunctionCode,
  NgSelectMessage,
  ResponseTypeES,
} from 'src/app/e-diary/utils/Enum';
import { SearchModalComponent } from '../search-modal/search-modal.component';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { DashboardSearchService } from 'src/app/e-diary/services/dashboard/dashboard-search.service';
import { ShiftService } from 'src/app/e-diary/services/danh-muc/shift.service';
import { ProcessFormService } from 'src/app/e-diary/services/dynamic-process/process-form.service';
import {
  ShiftModel,
  ShiftFilter,
} from 'src/app/e-diary/models/danh-muc/ShiftModel';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import * as moment from 'moment';
import { DiaryModelFilter } from 'src/app/e-diary/models/tim-kiem/tim-kiem';
import { PagingModel } from 'src/app/e-diary/models/Commons/PagingModel';
import {
  EquipmentModel,
  EquipmentModelFilter,
} from 'src/app/e-diary/models/cau-hinh/EquipmentModel';
import { EquipmentService } from 'src/app/e-diary/services/danh-muc/equipment.service';
import { ProcessFormModel } from 'src/app/e-diary/models/nhat-ky-van-hanh/ProcessFormModel';
import { ShiftCategoryModel } from 'src/app/e-diary/models/danh-muc/ShiftCategoryModel';
import { ShiftCategoryService } from 'src/app/e-diary/services/danh-muc/shift-category.service';
import { RefTypeService } from 'src/app/e-diary/services/cau-hinh/ref-type.service';
import { RefTypeModel } from 'src/app/e-diary/models/cau-hinh/RefTypeModel';
import { ESConst } from 'src/app/e-diary/utils/Const';
import { Utility } from 'src/app/e-diary/utils/Utility';
import { HttpStatusCode } from '@angular/common/http';

declare var $: JQueryStatic;
@Component({
  selector: 'app-search-list',
  templateUrl: './search-list.component.html',
  styleUrls: ['./search-list.component.css'],
})
export class SearchListComponent {
  breadcrumbTitle: string = '';
  loading = false;
  pageIndex: number = 1;
  totalItem: number = 0;
  pageSize: number = 10;
  tableSizes: any = [10, 15, 20];
  pageCount: number[] = [];
  pagingConfig: PagingConfig = {} as PagingConfig;
  searchForm!: FormGroup;
  listForm: formMauModel[] = [];
  listDiary: ProcessFormModel[] = [];
  showModal: boolean = false;
  minDate: Date;
  maxDate: Date;
  selectedDateValue: Date[];
  //#region FunctionCodes allow permission
  lstFunctionCode: string[];
  //#endregion
  FunctionCode = FunctionCode;
  listEquipment: EquipmentModel[] = [];
  lstTag: any[] = [];
  EquipmentId: number;
  ngSelectMessage = NgSelectMessage;
  lstShiftCategory: ShiftCategoryModel[];
  lstRefType: RefTypeModel[] = [];
  @ViewChild('popup') popup: SearchModalComponent;
  @ViewChild('inputField') inputField: ElementRef;
  DicStatusStyle_OnShiftDuty = ESConst.DicStatusStyle_OnShiftDuty;
  DicStatusDesc_OnShiftDuty = ESConst.DicStatusDesc_OnShiftDuty;

  constructor(
    private titleService: Title,
    public toastr: ToastrService,
    private timKiemService: DashboardSearchService,
    private shiftService: ShiftService,
    private activatedRoute: ActivatedRoute,
    private thietBiService: EquipmentService,
    public router: Router,
    private api: ProcessFormService,
    private fb: FormBuilder,
    private commonService: CommonService,
    private shiftCategoryService: ShiftCategoryService,
    private refTypeService: RefTypeService
  ) {
    const today = new Date();
    const oneWeekLater = new Date(today.getDate() + 10);
    this.selectedDateValue = [today, oneWeekLater];
    this.pagingConfig = {
      itemsPerPage: this.pageSize,
      currentPage: this.pageIndex,
      totalItems: this.totalItem,
    };
  }
  lstShift: ShiftModel[] = [];
  ngOnInit(): void {
    this.breadcrumbTitle = this.activatedRoute.snapshot.data.breadcrumbTitle;
    this.titleService.setTitle('Tra cứu nhật ký');
    this.initDataFormSearch();
    this.loading = false;
    const currentDate = new Date();
    const startDateDefault = new Date(
      currentDate.getTime() - 10 * 24 * 60 * 60 * 1000
    );
    this.selectedDateValue = [startDateDefault, currentDate]; // Khởi tạo một phạm vi ngày mặc định
    this.activatedRoute.queryParams.subscribe((params) => {
      this.searchForm = new FormGroup({
        KeySearch: new FormControl(params.keyword),
        code: new FormControl(''),
        status: new FormControl(null),
        unitId: new FormControl(null),
        rangeDate: new FormControl(this.selectedDateValue),
        Equipment: new FormControl(null),
        EquipmentTagId: new FormControl(null),
        refTypeId: new FormControl(null),
      });
      this.onSearch();
    });
  }

  initDataFormSearch() {
    type NewType = ShiftFilter;

    // danh sách ca trực
    let ShiftFilter: NewType = {
      IsActive: true,
    };
    this.shiftService
      .getListShift(ShiftFilter)
      .subscribe((result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.lstShift = result.Data;
        } else {
          this.toastr.error(`${result.Message}`, 'Load danh sách ca trực lỗi!');
        }
      });
    // danh sách thiết bị
    this.getListEquipment();

    this.getListShiftCategory();
  }

  loadData(pageIndex: number) {
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
    this.pageIndex = pageIndex;
    let diaryModelFilter: DiaryModelFilter = {
      PageIndex: this.pageIndex,
      PageSize: this.pageSize,
      KeySearch: this.searchForm.value.KeySearch,
      Code: this.searchForm.value.code,
      fromDate: dateFrom,
      toDate: dateTo,
      equipmentId: this.EquipmentId,
      equipmentTagId:
        this.searchForm.value.EquipmentTagId == 'null'
          ? null
          : this.searchForm.value.EquipmentTagId,
      refTypeId: this.searchForm.controls.refTypeId.value,
    };
    this.loading = true;
    this.timKiemService.getDiaryPaging(diaryModelFilter).subscribe(
      (res: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(res)) {
          this.totalItem = res.Data.TotalRecords;
          this.pageCount = new Array(res.Data.PageCount);
          this.listDiary = res.Data.Items;
        } else {
          this.toastr.error(`${res.Message}`, 'lỗi');
        }
        this.lstFunctionCode = res.FunctionCodes;
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
    this.loadData(pagingConfig.PageIndex);
  }
  public onSearch(reset: boolean = false): void {
    this.loadData(1);
  }

  highlightText(text: string): string {
    if (!text || !this.searchForm.value.KeySearch) {
      return text;
    }
    let keywords = this.searchForm.value.KeySearch.split(' ');

    var replacements = [];
    for (let keyword of keywords) {
      if (keyword.length > 1) replacements.push(keyword);
    }
    // const highlightedText = text.replace(/.*<em>/, '<em>');
    for (var i = 0; i < replacements.length; i++) {
      var regex = new RegExp(replacements[i], 'gi');
      text = text.replace(regex, `<span class="highlighted-text">$&</span>`);
    }
    return text;
  }

  // view kết quả tìm kiếm
  onOpenModalDetail(id: number, refTypeId: number) {
    this.loading = true;
    this.api.getItemById(id, refTypeId).subscribe(
      (res: any) => {
        this.api.getDiaryByRefTypeId(refTypeId).subscribe(
          (result: any) => {
            this.popup.htmlContent = result.Data.Context;
            //
            if (res.Data.Content) {
              let jsonArray = JSON.parse(res.Data.Content);
              $(document).ready(function () {
                jsonArray.forEach((item) => {
                  $("[id='" + item.id + "']").val(item.value);
                });
                $('#myForm :input').prop('readonly', true);
                $('#myForm :input').css({
                  'background-color': '#ffffff',
                  border: 'none',
                  'border-style': 'none',
                });

                // setTimeout(function () {
                //   highlight('ông');
                // }, 5000);
              });
            }
            this.loading = false;
          },
          (error) => {
            this.loading = false;
          }
        );
      },
      (error) => {
        this.loading = false;
      }
    );
  }
  onHideModal() {
    this.showModal = false;
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
        } else if (result.Type == ResponseTypeES.Warning) {
          this.toastr.warning(`${result.Message}`, 'Cảnh báo');
        } else {
          console.error(`${result.Exception}`);
          this.toastr.error(`${result.Message}`, 'Load danh sách thiết bị lỗi');
        }
      });
  }
  selectedOption = null;
  onSelectChangeEquipement(event: any) {
    console.log('Selected option changed:', event);
    if (event === undefined) return;
    this.EquipmentId = event == 'null' ? null : event.Id;
    this.lstTag = null;
    this.searchForm.controls['EquipmentTagId'].setValue(null);
    this.lstTag = event.EquipmentTags;
    // You can perform additional actions here based on the selected option
  }
  onClearEquipment() {
    this.searchForm.controls['EquipmentTagId'].setValue(null);
    this.EquipmentId = null;
    this.lstTag = null;
  }
  //danh sách loại ca trực
  getListShiftCategory() {
    this.shiftCategoryService
      .getListShiftCategory({ IsActive: true })
      .subscribe((result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.lstShiftCategory = result.Data;
        } else {
          this.toastr.error(`${result.Message}`, 'Lỗi');
        }
      });
  }

  onChangeShiftCategorSelect(id) {
    if (!id) return;
    this.getListRefType(id);
  }

  onClearShiftCategor() {
    this.searchForm.controls['refTypeId'].setValue(null);
    this.lstRefType = null;
  }

  // ds nghiệp vụ
  getListRefType(id) {
    this.refTypeService
      .getListRefType({ ShiftCategoryId: id })
      .subscribe((result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.lstRefType = result.Data;
        } else {
          this.toastr.error(`${result.Message}`, 'Lỗi');
        }
      });
  }
}

function highlight(word) {
  var element = $('.markdown');
  var rgxp = new RegExp(word, 'g');
  var repl = '<span class="marker">' + word + '</span>';
  element.html(element.html().replace(word, repl));
}
