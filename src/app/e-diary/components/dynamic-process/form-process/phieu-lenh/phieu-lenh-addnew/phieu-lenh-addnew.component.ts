import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  ActivatedRoute,
  NavigationEnd,
  NavigationStart,
  Router,
} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProcessFormService } from 'src/app/e-diary/services/dynamic-process/process-form.service';
import { ESConst } from 'src/app/e-diary/utils/Const';
import { FunctionCode } from 'src/app/e-diary/utils/Enum';
import { Utility } from 'src/app/e-diary/utils/Utility';
import { ProcessFormModel } from 'src/app/e-diary/models/nhat-ky-van-hanh/ProcessFormModel';
import { RefTypeModel } from 'src/app/e-diary/models/cau-hinh/RefTypeModel';
import { Title } from '@angular/platform-browser';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import { utimes } from 'fs';
import { CommonService } from 'src/app/e-diary/services/common.service';
import moment from 'moment';
import { IframeContentComponent } from 'src/app/shared/components/iframe-content/iframe-content.component';
import { EquipmentModel } from 'src/app/e-diary/models/cau-hinh/EquipmentModel';

@Component({
  selector: 'app-phieu-lenh-addnew',
  templateUrl: './phieu-lenh-addnew.component.html',
})
export class PhieuLenhAddnewComponent {
  @Input() RefTypeModel: RefTypeModel;
  @Input() listEquipment: EquipmentModel[] = [];
  loading = true;
  submitted = false;

  item: ProcessFormModel = {
    Name: '',
    Note: '',
  };
  itemValidate: ProcessFormModel = {};

  FunctionCode = FunctionCode;
  lstFunctionCode: string[];

  formGroup!: FormGroup;

  @ViewChild('appiframe') IframeContent: IframeContentComponent;

  //#region Dùng để validate
  get f(): { [key: string]: AbstractControl } {
    return this.formGroup!.controls;
  }
  //#endregion

  constructor(
    private nhatKyVanHanhService: ProcessFormService,
    private formBuilder: FormBuilder,
    public toastr: ToastrService,
    private title: Title,
    private route: ActivatedRoute,
    public router: Router,
    private commonService: CommonService
  ) {
    this.title.setTitle(this.route.snapshot.data.title);

    this.formGroup = this.formBuilder.group({
      Name: ['', [Validators.required, Validators.maxLength(100)]],
      Note: ['', [Validators.maxLength(1000)]],
    });
  }

  loadIframe() {
    setTimeout(() => {
      this.IframeContent.onIframeLoad();
    }, 200);
  }

  ngOnInit() {
    this.setupForm();
  }

  setupForm() {
    this.loading = true;
    this.route.params.subscribe((val) => {
      // Khi không có Id record thì là Thêm mới
      this.nhatKyVanHanhService
        .getDefaultAddnewItem(this.RefTypeModel.Id)
        .subscribe(
          //Thêm mới thì chỉ load cấu trúc form
          (result: ResponseModel) => {
            this.lstFunctionCode = result.FunctionCodes;
            if (!this.commonService.checkTypeResponseData(result)) {
              console.error(result.Exception);
              this.toastr.error(`${result.Message}`, 'Lỗi');
              this.loading = false;
              return;
            }
            this.item = result.Data;
            this.bindData();
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

  bindData() {
    let jsonArray = JSON.parse(this.item.Content);
    $(document).ready(function () {
      if (jsonArray !== null && jsonArray.length > 0) {
        setTimeout(() => {
          jsonArray.forEach((item) => {
            $('.previewFormDong')
              .contents()
              .find("[id='" + item.id + "']")
              .val(item.value);
          });
        }, 300);
      }
    });
  }

  // set dữ liệu cho các input cùng dòng có time, phục vụ thống kê
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
              'input[name^="dateTime-"]'
            );
            if (dateInput && dateInput != null) {
              let inputValue = dateInput.value;
              let momentDate: any;
              let daySave: any;
              // check time HH:mm
              if (inputValue != '') {
                let checkHhmm = fnccheckTime(inputValue, 1);
                let checkHhmmss = fnccheckTime(inputValue, 2);
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
                      nextRow.querySelectorAll('input')
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
    this.submitted = true;
    if (this.formGroup?.invalid) {
      return;
    }
    let isAllInputsValid = this.validateAllInputs();
    if (isAllInputsValid) {
    } else {
      this.toastr.error('Vui lòng kiểm tra lại các trường thông tin!', 'Lỗi');
      return;
    }
    this.setTimeFollowOnRow();
    this.loading = true;
    // clone dữ liệu mặc định tại Item
    // update các dữ liệu mới nhập trên formgroup
    let submitItem = Object.assign({}, this.item);
    submitItem.Name = this.f.Name.value;
    submitItem.Note = this.f.Note.value;

    var modifiedDataSearch = this.getJsonSearch();
    submitItem.Content = JSON.stringify(modifiedDataSearch);

    this.nhatKyVanHanhService.createNewDiary_PhieuLenh(submitItem).subscribe(
      (result: ResponseModel) => {
        if (!this.commonService.checkTypeResponseData(result)) {
          console.error(result.Exception);
          this.toastr.error(`${result.Message}`, 'Lỗi');
          this.loading = false;
          return;
        }

        this.toastr.success('Thêm mới thành công!', 'Thành công');
        this.loading = false;
        this.gotoFormChiTiet(result.Data.Id);
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  getJsonModifiedData(): string {
    // lưu theo format mới 21/06/2023
    var formData = $('#myForm').serializeArray();
    var modifiedData = formData.map(function (item) {
      return {
        name: item.name,
        value: item.value,
        id: $('[name="' + item.name + '"]').data('key'),
        tagName: $('[name="' + item.name + '"]').data('tag'),
        minBlock: $('[name="' + item.name + '"]').data('minblock'),
        maxBlock: $('[name="' + item.name + '"]').data('maxblock'),
        minWarn: $('[name="' + item.name + '"]').data('minwarn'),
        maxWarn: $('[name="' + item.name + '"]').data('maxwarn'),
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
          equipmentCode: attributeInfo['data-equipmentcode'] ?? '',
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

  gotoFormChiTiet(id: number) {
    let url = `/processform/reftype/${this.RefTypeModel.Id}/chi-tiet/${id}`;
    this.commonService.gotoPage(url);
  }
}

function fnccheckTime(timeInput, flag) {
  const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
  const timeRegexHms = /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
  if (flag == 1) return timeRegex.test(timeInput);
  else if (flag == 2) return timeRegexHms.test(timeInput);
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
