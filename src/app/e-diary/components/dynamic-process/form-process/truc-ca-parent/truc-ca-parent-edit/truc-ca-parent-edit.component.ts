import { HttpStatusCode } from '@angular/common/http';
import { Component, ElementRef, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import Cleave from 'cleave.js';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import { EquipmentModel } from 'src/app/e-diary/models/cau-hinh/EquipmentModel';
import { RefTypeModel } from 'src/app/e-diary/models/cau-hinh/RefTypeModel';
import { ProcessFormModel } from 'src/app/e-diary/models/nhat-ky-van-hanh/ProcessFormModel';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { ProcessFormService } from 'src/app/e-diary/services/dynamic-process/process-form.service';
import { ESConst } from 'src/app/e-diary/utils/Const';
import { FunctionCode, cleaveInputClass } from 'src/app/e-diary/utils/Enum';
import { Utility } from 'src/app/e-diary/utils/Utility';

@Component({
  selector: 'app-truc-ca-parent-edit',
  templateUrl: './truc-ca-parent-edit.component.html',
  styleUrls: ['./truc-ca-parent-edit.component.css'],
})
export class TrucCaParentEditComponent {
  @Input() RefTypeModel: RefTypeModel;
  @Input() listEquipment: EquipmentModel[] = [];
  loading = true;
  id!: number;

  item: ProcessFormModel;
  lstFunctionCode: string[];

  FunctionCode = FunctionCode;

  DicStatusStyleInput_OnShiftDuty = ESConst.DicStatusStyleInput_OnShiftDuty;
  DicStatusDesc_OnShiftDuty = ESConst.DicStatusDesc_OnShiftDuty;

  DicStatusStyleInput = ESConst.DicStatusStyleInput;
  DicStatusDesc = ESConst.DicStatusDesc;

  inputElements: any;
  @Input('appCleave') cleaveOptions: any;

  constructor(
    private processFormService: ProcessFormService,
    private activatedRoute: ActivatedRoute,
    public toastr: ToastrService,
    private title: Title,
    public router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private el: ElementRef
  ) {
    this.title.setTitle(this.route.snapshot.data.title);
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((val) => {
      this.RefTypeModel.Id = val[ESConst.PatchParams.refTypeId];
      this.id = val[ESConst.PatchParams.id];

      this.loadData();

      this.forcusOutInput();
    });
  }
  loadData() {
    this.loading = true;
    this.processFormService
      .getItemEditById(this.id, this.RefTypeModel.Id)
      .subscribe(
        (result: ResponseModel) => {
          this.lstFunctionCode = result.FunctionCodes;
          if (!this.commonService.checkTypeResponseData(result)) {
            this.toastr.error(`${result.Message}`, 'Lỗi');
            this.loading = false;
            return;
          }

          this.item = result.Data;
          if (!this.item.Context) {
            this.toastr.error(`Không tìm thấy thiết kế form`, 'Lỗi!');
            return;
          }
          this.bindData();

          this.loading = false;
        },
        (error) => {
          this.loading = false;
          if (error.status === HttpStatusCode.MethodNotAllowed)
            this.lstFunctionCode = error.error.FunctionCodes;
        }
      );
  }

  bindData() {
    let jsonArray = JSON.parse(this.item.Content);
    $(document).ready(function () {
      if (jsonArray !== null && jsonArray.length > 0) {
        setTimeout(() => {
          jsonArray.forEach((item) => {
            // $("[id='" + item.id + "']").val(item.value);
            $('.previewFormDong')
              .contents()
              .find("[id='" + item.id + "']")
              .val(item.value);
          });
        }, 300);
      }
    });
  }
  forcusOutInput() {
    $('input')
      .focusout(function () {
        if ($(this).val() == '') {
          $(this).css('border', 'solid 2px red');
        } else {
          // If it is not blank.
          $(this).css('border', 'solid 2px green');
        }
      })
      .trigger('focusout');
  }
  // set dữ liệu cho các input cùng dòng có time, phục vụ thống kê
  isTimeFormatValid(input: string, flag: number): boolean {
    // Mẫu biểu thức chính quy để kiểm tra định dạng HH:mm
    const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    const timeRegexHms = /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    if (flag == 1) return timeRegex.test(input);
    else if (flag == 2) return timeRegexHms.test(input);
  }

  setTimeFollowOnRow() {
    if (document.querySelector('#myFrame')) {
      const iframeElement: HTMLIFrameElement =
        document.querySelector('#myFrame');
      const iframeDoc =
        iframeElement.contentDocument || iframeElement.contentWindow.document;
      let tables = iframeDoc.querySelectorAll('table.data-table');
      let startDateDuty: Date;
      let endDateDuty: Date;
      if (this.item.StartDTG) {
        startDateDuty = new Date(this.item.StartDTG);
      }
      if (this.item.EndDTG) {
        endDateDuty = new Date(this.item.EndDTG);
      }
      if (
        this.item.StartDTG == null &&
        this.item.EndDTG == null &&
        this.item.CreatedDTG
      ) {
        startDateDuty = new Date(this.item.CreatedDTG);
        this.item.StartDTG = startDateDuty;
      }
      // Loop through each table
      tables.forEach((table) => {
        const rows = table.querySelectorAll('tr');
        rows.forEach((row, rowIndex) => {
          // Kiểm tra xem hàng có chứa bảng con không
          const nestedTables = row.querySelectorAll('table');
          if (nestedTables.length > 0) {
            // don't nothing
          } else {
            const dateInput: HTMLInputElement = row.querySelector(
              `.${cleaveInputClass.DATE},.${cleaveInputClass.TIME_HH_MM},.${cleaveInputClass.TIME_HH_MM_SS},.${cleaveInputClass.DATEPICKER}`
            );
            if (dateInput && dateInput != null) {
              let inputValue = dateInput.value;
              let momentDate: any;
              let daySave: any;
              // check time HH:mm
              if (inputValue != '') {
                let checkHhmm = Utility.fnccheckTime(inputValue, 1);
                let checkHhmmss = Utility.fnccheckTime(inputValue, 2);
                let checkDateTimeHms = Utility.fnccheckTime(inputValue, 3);
                if (checkHhmm) {
                  daySave = moment(startDateDuty).format('YYYY-MM-DD');
                  momentDate = Utility.fncOffsetTimeUtc(
                    `${daySave} ${inputValue.toString()}`
                  );
                }
                if (checkHhmmss) {
                  const [h, m, s] = inputValue.toString().split(':');
                  daySave = moment(startDateDuty).format('YYYY-MM-DD');
                  momentDate = Utility.fncOffsetTimeUtc(
                    `${daySave} ${inputValue.toString()}`
                  );
                }
                if (checkDateTimeHms) {
                  const formattedDate = moment(
                    inputValue,
                    'DD/MM/YYYY HH:mm'
                  ).format('YYYY/MM/DD HH:mm');
                  momentDate = Utility.fncOffsetTimeUtc(`${formattedDate}`);
                  console.log('momentDate: ', momentDate);
                }
                if (inputValue.toString().length == 10) {
                  momentDate = Utility.fncOffsetTimeUtc(
                    `${inputValue.toString()}`
                  );
                }

                let rowspanValue: number = 0;
                const firstTd = row.querySelector('td:first-child');
                if (firstTd) {
                  rowspanValue = parseInt(
                    firstTd.getAttribute('rowspan') || '1',
                    10
                  );
                  // Lặp qua các td cùng hàng và hàng bên dưới và gán giá trị cho [data-timefollow]
                  for (let i = rowIndex; i < rowIndex + rowspanValue; i++) {
                    const nextRow = rows[i];
                    const otherInputs = Array.from(
                      nextRow.querySelectorAll('input,textarea')
                    ).filter((otherInput) => otherInput !== dateInput);
                    otherInputs.forEach((nextInput) => {
                      if (nextInput) {
                        nextInput.setAttribute('data-timefollow', momentDate);
                      }
                    });
                  }
                }
              }
            }
          }
        });
      });
    }
  }
  onSaveDiary() {
    let isAllInputsValid = this.validateAllInputs();
    console.log('isAllInputsValid: ', isAllInputsValid);
    if (isAllInputsValid) {
    } else {
      this.toastr.error('Vui lòng kiểm tra lại các trường thông tin!', 'Lỗi');
      return;
    }
    // let checkInputDate = this.checkIputDateInValid();
    // if (checkInputDate) {
    // } else return;

    this.setTimeFollowOnRow();
    // // lấy data form động
    // var jsonmodifiedData = this.getJsonModifiedData();
    // // mapp data to save
    // this.item.Content = jsonmodifiedData;
    // lưu json array để tìm kiếm
    var modifiedDataSearch = this.getJsonSearch();
    this.item.Content = JSON.stringify(modifiedDataSearch);
    this.loading = true;
    this.processFormService.updateDiary(this.item, this.id).subscribe(
      (result: ResponseModel) => {
        if (!this.commonService.checkTypeResponseData(result)) {
          this.loading = false;
          console.error(result.Exception);
          this.toastr.error(result.Message, 'Lỗi');
          this.loading = false;
          return;
        }
        this.toastr.success('Cập nhật thành công!', 'Thành công');
        this.gotoFormChiTiet();
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  getJsonModifiedData(): string {
    /* If your HTML form does not have elements that allow multiple selections
    <select multiple>, checkboxes that have the same name, etc.), then you can simply do the following: */
    // // cách 1
    //
    // // 1: get form data
    // const formData: any = new FormData(form);
    // // 2: store form data in object
    // const jsonObject = Object.fromEntries(formData);
    // // 3: convert form data object to a JSON string
    // const jsonString = JSON.stringify(jsonObject);

    // // cách 2

    // // 1: get form data
    // const formData2 = new FormData(form);
    // // 2: store form data in object
    // const jsonObject2 = formDataToObject(formData2);
    // // 3: convert form data object to a JSON string
    // const jsonString2 = JSON.stringify(jsonObject2);

    // var obj = JSON.parse(jsonString2);

    // // lưu theo format mới 21/06/2023
    var formData = $('#myForm').serializeArray();

    var modifiedData = formData.map(function (item) {
      return {
        name: item.name,
        value: item.value,
        id: $('[name="' + item.name + '"]').data('key'), //$('input[name="' + item.name + '"]').data('key'),
        tagCode: $('[name="' + item.name + '"]').data('tag'), // $('input[name="' + item.name + '"]').data('tag'),
        minBlock: $('[name="' + item.name + '"]').data('minblock'),
        maxBlock: $('[name="' + item.name + '"]').data('maxblock'),
        minWarn: $('[name="' + item.name + '"]').data('minwarn'),
        maxWarn: $('[name="' + item.name + '"]').data('maxwarn'),
        equipmentId: $('[name="' + item.name + '"]').data('equipmentid'),
        equipmentTagId: $('[name="' + item.name + '"]').data('equipmenttagid'),
        equipmentName: $('[name="' + item.name + '"]').data('equipmentname'),
        equipmentTagName: $('[name="' + item.name + '"]').data(
          'equipmenttagname'
        ),
        timeFollow:
          $('[name="' + item.name + '"]').data('timefollow') != ''
            ? new Date($('[name="' + item.name + '"]').data('timefollow'))
            : null,
      };
    });
    var jsonmodifiedData = JSON.stringify(modifiedData);
    return jsonmodifiedData;
  }

  getJsonSearch() {
    if (document.querySelector('#myFrame')) {
      const iframeElement: HTMLIFrameElement =
        document.querySelector('#myFrame');
      const iframeDocument =
        iframeElement.contentDocument || iframeElement.contentWindow.document;
      const inputElements = iframeDocument.querySelectorAll('input,textarea');
      const formData = [];
      let startDateDuty: Date;
      if (this.item.StartDTG) {
        startDateDuty = new Date(
          Utility.fncOffsetTimeUtc(`${this.item.StartDTG.toString()}`)
        );
      }
      inputElements.forEach((inputElement: any) => {
        const attributes = inputElement.attributes;
        const attributeInfo = {};
        for (let i = 0; i < attributes.length; i++) {
          const attribute = attributes[i];
          attributeInfo[attribute.name] = attribute.value;
        }
        const inputInfo = {
          name: inputElement.name,
          id: inputElement.id,
          value: inputElement.value,
          tagCode: attributeInfo['data-tag'],
          minBlock: parseFloat(attributeInfo['data-minblock'] ?? null),
          maxBlock: parseFloat(attributeInfo['data-maxblock'] ?? null),
          minWarn: parseFloat(attributeInfo['data-minwarn'] ?? null),
          maxWarn: parseFloat(attributeInfo['data-maxwarn'] ?? null),
          equipmentId: parseInt(attributeInfo['data-equipmentid'] ?? null),
          equipmentTagId: parseInt(
            attributeInfo['data-equipmenttagid'] ?? null
          ),
          equipmentName: attributeInfo['data-equipmentname'] ?? '',
          equipmentTagName: attributeInfo['data-equipmenttagname'] ?? '',
          timeFollow: attributeInfo['data-timefollow']
            ? new Date(attributeInfo['data-timefollow'])
            : parseInt(attributeInfo['data-equipmenttagid'] ?? null) > 0
            ? startDateDuty
            : null,
        };
        formData.push(inputInfo);
      });
      return formData;
    }
  }

  validateAllInputs = () => {
    let allInputsValid = true;
    if (document.querySelector('#myFrame')) {
      const iframeElement: HTMLIFrameElement =
        document.querySelector('#myFrame');
      const iframeDocument =
        iframeElement.contentDocument || iframeElement.contentWindow.document;
      let inputs = iframeDocument.querySelectorAll('input.input-number');
      inputs.forEach((inputElement: HTMLInputElement) => {
        let inputId = inputElement.id;
        if (!this.validateInput(iframeDocument, inputId, inputElement)) {
          allInputsValid = false;
        }
      });
    }
    return allInputsValid;
  };

  gotoFormChiTiet() {
    this.loading = true;
    this.router.navigate([
      `processform/reftype`,
      this.RefTypeModel.Id,
      `chi-tiet`,
      this.id,
    ]);
  }

  checkIputDateInValid() {
    let dateValid = true;
    if (document.querySelector('#myFrame')) {
      const iframeElement: HTMLIFrameElement =
        document.querySelector('#myFrame');
      const iframeDocument =
        iframeElement.contentDocument || iframeElement.contentWindow.document;
      let dateInputs = iframeDocument.querySelectorAll(
        'input[name^="dateTime-"]'
      );
      let startDateDuty: Date;
      let endDateDuty: Date;

      if (this.item.StartDTG) {
        startDateDuty = new Date(this.item.StartDTG);
      }
      if (this.item.EndDTG) {
        endDateDuty = new Date(this.item.EndDTG);
      }
      dateInputs.forEach(function (inputElement: HTMLInputElement) {
        // Do something with each dateInput
        let inputId = inputElement.id;
        if (
          !checkTimeValid(
            iframeDocument,
            inputId,
            inputElement,
            startDateDuty,
            endDateDuty
          )
        ) {
          dateValid = false;
        }
      });
    }
    return dateValid;
  }
  handleContentIframeResize(iframe: HTMLIFrameElement) {
    var resizeObserver = new ResizeObserver(() => {
      this.updateIframeHeight(iframe);
    });
    resizeObserver.observe(iframe.contentDocument.documentElement);
  }
  updateIframeHeight(iframe: HTMLIFrameElement) {
    var iframeContent = iframe.contentDocument || iframe.contentWindow.document;
    var iframeContentHeight = iframeContent.documentElement.scrollHeight;
    iframe.style.height = iframeContentHeight + 'px';
  }
  computeValue(value1: string, value2: string): string {
    // Thực hiện xử lý và trả về giá trị kết quả
    return `${moment(value1).format('DD/MM/YYYY HH:mm')} - ${moment(
      value2
    ).format('DD/MM/YYYY HH:mm')}`;
  }

  onReceiveLstEquiment(event) {
    this.listEquipment = event;
  }

  convertstringToDecimal(value: string): number {
    if (value == '' || value == null) return null;
    return parseFloat(value.replace(',', '')); // Loại bỏ dấu phẩy nếu có
  }

  validateInput(iframeDocument, id, inputElement: HTMLInputElement): boolean {
    if ($('#error-' + id).length) {
      $('#error-' + id).remove();
    }
    const divToRemove = iframeDocument.querySelector(
      'div.error-message#error-' + id
    );
    if (divToRemove) {
      divToRemove.parentNode.removeChild(divToRemove);
    }
    let mess_err = '';
    let EquipmentId = parseInt(
      inputElement.getAttribute('data-equipmentid') ?? null
    );
    let TagId = parseInt(inputElement.getAttribute('data-tagid') ?? null);
    let EquipmentObj = this.listEquipment
      .flatMap((result) => result.EquipmentTags)
      .find((tag) => tag.EquipmentId === EquipmentId && tag.TagId === TagId);
    if (EquipmentObj) {
      const minBlock = EquipmentObj.MinBlocking ?? null;
      const maxBlock = EquipmentObj.MaxBlocking ?? null;
      const minWarn = EquipmentObj.MinWarning ?? null;
      const maxWarn = EquipmentObj.MaxWarning ?? null;
      if (inputElement.value) {
        const numericValue = this.convertstringToDecimal(inputElement.value);
        if (numericValue < minBlock && !isNaN(minBlock) && minBlock != null) {
          mess_err = `Giá trị nhập vào phải >=  ${minBlock}`;
        } else if (
          numericValue > maxBlock &&
          !isNaN(maxBlock) &&
          maxBlock != null
        ) {
          mess_err = `Giá trị nhập vào phải <=  ${maxBlock}`;
        }
        if (mess_err) {
          $('#' + id).after(
            `<span class="error-message" style="color: red;" id="error-${id}">${mess_err}</span>`
          );
          const divElement = document.createElement('div');
          divElement.className = 'error-message'; // Thêm class 'error-message'
          divElement.style.color = 'red'; // Thêm style 'color: red;'
          divElement.id = `error-${id}`; // Thêm id dựa trên id của phần tử input
          divElement.textContent = mess_err;
          inputElement.parentNode.insertBefore(
            divElement,
            inputElement.nextSibling
          );
          return false;
        }
      }
    }
    if (mess_err !== '') {
      return false; // Validation failed
    }
    return true; // Validation passed
  }
}

function checkTimeInday(targetTime, date1, date2) {
  console.log(' date1G: ', date1, ' date2G: ', date2);
  // Sau đó, bạn có thể so sánh chúng bằng cách sử dụng các phép so sánh
  var dateString1 = moment(date1).format('YYYY-MM-DD');
  var dateString2 = moment(date2).format('YYYY-MM-DD');
  var date1_ = new Date(dateString1);
  var date2_ = new Date(dateString2);
  date1_.setHours(0, 0, 0, 0);
  date2_.setHours(0, 0, 0, 0);
  const timeStart = moment(date1, 'ddd MMM DD YYYY HH:mm:ss ZZ');
  const timeEnd = moment(date2, 'ddd MMM DD YYYY HH:mm:ss ZZ');
  const timeMoment = moment(targetTime.toString(), 'HH:mm:ss');
  const hour = timeMoment.hour();
  const minute = timeMoment.minute();
  const second = timeMoment.second();
  if (date1_.getTime() > date2_.getTime()) {
    return 0;
  } else if (date1_.getTime() == date2_.getTime()) {
    const inputDateTime = moment(dateString1).set({
      hour: timeMoment.get('hour'),
      minute: timeMoment.get('minute'),
      second: timeMoment.get('second'),
    });
    console.log('inputDateTime==', inputDateTime);
    if (
      moment(inputDateTime).isSameOrAfter(timeStart) &&
      moment(inputDateTime).isSameOrBefore(timeEnd)
    ) {
      return 3;
    } else return 0; // không thuộc ngày ca;
  } else if (date1_.getTime() < date2_.getTime()) {
    // gán date = startdate
    const inputDateTimeTemp = new Date(dateString1);
    inputDateTimeTemp.setHours(hour, minute, second, 0);
    //nếu date >= startdate thì thuộc ngày bắt đầu
    if (moment(inputDateTimeTemp).isSameOrAfter(timeStart)) {
      return 1;
    }
    // gán date = endate nếu date <= endDate thì thuộc ngày kết thúc
    const inputDateTimeTempEnd = new Date(dateString2);
    inputDateTimeTempEnd.setHours(hour, minute, second, 0);
    if (moment(inputDateTimeTempEnd).isSameOrBefore(timeEnd)) {
      return 2;
    }
    return 0;
  }
}

function checkTimeValid(
  iframeDocument,
  id: string,
  inputElement: HTMLInputElement,
  startDateDuty,
  endDateDuty
): boolean {
  const divToRemove = iframeDocument.querySelector(
    'div.error-message#error-' + id
  );
  if (divToRemove) {
    divToRemove.parentNode.removeChild(divToRemove);
  }
  let mess_err = '';
  let checkInDay: number = 1;
  let inputValue = inputElement.value;
  if (inputValue != '')
    checkInDay = checkTimeInday(inputValue, startDateDuty, endDateDuty);
  if (checkInDay == 0) {
    mess_err = 'Thời gian không thuộc ca trực';
  }
  if (mess_err) {
    const divElement = document.createElement('div');
    divElement.className = 'error-message'; // Thêm class 'error-message'
    divElement.style.color = 'red'; // Thêm style 'color: red;'
    divElement.id = `error-${id}`; // Thêm id dựa trên id của phần tử input
    divElement.textContent = mess_err;
    inputElement.parentNode.insertBefore(divElement, inputElement.nextSibling);
    return false;
  }

  if (mess_err !== '') {
    return false; // Validation failed
  }
  return true; // Validation passed
}
