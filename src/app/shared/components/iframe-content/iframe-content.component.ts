import {
  Component,
  ElementRef,
  Input,
  SimpleChanges,
  ViewChild,
  LOCALE_ID,
  Inject,
  Output,
  EventEmitter,
  Renderer2,
} from '@angular/core';
import { Router } from '@angular/router';
import Cleave from 'cleave.js';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { EquipmentTagModalComponent } from 'src/app/e-diary/components/dashboard/statistic/equipment-tag-modal/equipment-tag-modal.component';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import {
  EquipmentModel,
  EquipmentModelFilter,
} from 'src/app/e-diary/models/cau-hinh/EquipmentModel';
import { EquipmentService } from 'src/app/e-diary/services/danh-muc/equipment.service';
import { ResponseTypeES, cleaveInputClass } from 'src/app/e-diary/utils/Enum';
@Component({
  selector: 'app-iframe-content',
  templateUrl: './iframe-content.component.html',
  styleUrls: ['./iframe-content.component.css'],
})
export class IframeContentComponent {
  @Input() context: string;
  @Input() isReadOnly: boolean = false;
  @Input() showButtonRedirect: boolean = false;
  @Input() childId: string | undefined;
  iframeHeight: number = 500;
  @ViewChild('myFrame') myFrame: ElementRef;
  @ViewChild(EquipmentTagModalComponent)
  suggest_equipement_list: EquipmentTagModalComponent;
  listEquipment: EquipmentModel[] = [];
  equipementIdArr: number[] = [];
  @Output() onSetLstEquipment = new EventEmitter();

  constructor(
    public router: Router,
    private toars: ToastrService,
    private thietBiService: EquipmentService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.context?.currentValue) {
      this.loadViewForm();
    }
    if (this.childId === undefined) this.childId = '';
  }

  loadViewForm() {
    if (this.myFrame) {
      this.setSource();
      setTimeout(() => {
        this.setExtends();
      }, 300);
      return;
    }
    setTimeout(() => {
      this.setSource();
      setTimeout(() => {
        this.setExtends();
      }, 300);
    }, 200);
  }

  public onIframeLoad() {
    if (this.myFrame) {
      this.iframeHeight = $('#myFrame' + this.childId)
        .contents()
        .height();

      if (document.querySelector('#myFrame' + this.childId)) {
        const iframeElement: HTMLIFrameElement = document.querySelector(
          '#myFrame' + this.childId
        );
        const iframeDocument =
          iframeElement.contentDocument || iframeElement.contentWindow.document;
        // init input cleave
        let optionDate = {
          date: true,
          delimiter: '/',
          datePattern: ['d', 'm', 'Y'],
        };
        let optionTimeHm = {
          time: true,
          timePattern: ['h', 'm'],
        };
        let optionTimeHms = {
          time: true,
          timePattern: ['h', 'm', 's'],
        };

        let optionDateTimeHms = {
          delimiters: ['/', '/', ' ', ':'],
          blocks: [2, 2, 4, 2, 2],
        };

        let optionNumber: any = {
          numeral: true,
          numeralThousandsGroupStyle: 'thousand',
          numeralDecimalScale: 3, // Số lẻ được hiển thị với 2 chữ số sau dấu thập phân
          numeralDecimalMark: '.',
          // numeralDecimalMark: ',', // Sử dụng dấu phẩy (,) làm dấu thập phân kieur VN
        };

        let optionText = {
          uppercase: true,
        };
        let dateInputs = iframeDocument.querySelectorAll(
          '.' + cleaveInputClass.DATE
        );
        let timeHmInputs = iframeDocument.querySelectorAll(
          '.' + cleaveInputClass.TIME_HH_MM
        );
        let timeHmsInputs = iframeDocument.querySelectorAll(
          '.' + cleaveInputClass.TIME_HH_MM_SS
        );
        let dateTimeHmsInputs = iframeDocument.querySelectorAll(
          '.' + cleaveInputClass.DATEPICKER
        );
        let numberInputs = iframeDocument.querySelectorAll(
          '.' + cleaveInputClass.NUMBER
        );
        let textInputs = iframeDocument.querySelectorAll(
          '.' + cleaveInputClass.TEXT
        );
        if (dateInputs) {
          dateInputs.forEach(function (input: any) {
            const cleave = new Cleave(input, optionDate);
          });
        }
        if (timeHmInputs) {
          timeHmInputs.forEach(function (input: any) {
            new Cleave(input, optionTimeHm);
          });
        }
        if (timeHmsInputs) {
          timeHmsInputs.forEach(function (input: any) {
            new Cleave(input, optionTimeHms);
          });
        }
        if (dateTimeHmsInputs) {
          dateTimeHmsInputs.forEach(function (input: any) {
            new Cleave(input, optionDateTimeHms);
          });
        }
        if (numberInputs) {
          numberInputs.forEach(function (input: any) {
            new Cleave(input, optionNumber);
          });
        }
        if (textInputs) {
          textInputs.forEach(function (input: any) {
            new Cleave(input, optionText);
          });
        }

        // add blur
        let inputs = iframeDocument.querySelectorAll('input.input-number');
        inputs.forEach((inputElement: HTMLInputElement) => {
          // const attributes = inputElement.attributes;
          // let inputId = inputElement.id;
          // lấy các EquipmentId
          let EquipmentId = parseInt(
            inputElement.getAttribute('data-equipmentid') ?? null
          );
          if (!this.equipementIdArr.includes(EquipmentId)) {
            this.equipementIdArr.push(EquipmentId);
          }
          inputElement.addEventListener('blur', () => {
            this.onInputBlurCheckTag(iframeDocument, inputElement);
          });
        });

        //add ngx-mask
        let inputDateTimeHms = iframeDocument.querySelectorAll(
          'input.' + cleaveInputClass.DATEPICKER
        );
        inputDateTimeHms.forEach((inputElement: HTMLInputElement) => {
          // Use Renderer2 to set ngxMask directive
          // this.renderer.setAttribute(inputElement, 'ngxMask', this.dynamicMask);
          // this.renderer.setAttribute(
          //   inputElement,
          //   'mask',
          //   'd0/M0/0000 Hh:m0:s0'
          // );
          // Attach an event listener to perform validation on input change
          inputElement.addEventListener('blur', () => {
            const inputValue = inputElement.value;
            const isValid = moment(
              inputValue,
              'DD/MM/YYYY HH:mm',
              true
            ).isValid();
            if (!isValid) {
              inputElement.value = ''; // Reset the input value
            }
            //   // return isValid ? null : { invalidDateTime: true };
          });
        });
      }
    }
  }

  // validate giá trị min/max của thông số thiết bị
  onInputBlurCheckTag(iframeDocument, inputElement: any): void {
    // Xử lý logic khi người dùng rời chuột khỏi trường nhập liệu
    let mess_err = '';
    let checkBlockWarn: number = 0;
    let inputId = inputElement.id;
    const divToRemove = iframeDocument.querySelector(
      'div.error-message#error-' + inputId
    );
    if (divToRemove) {
      divToRemove.parentNode.removeChild(divToRemove);
    }
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
        const numericValue = convertstringToDecimal(inputElement.value);
        if (numericValue < minBlock && !isNaN(minBlock) && minBlock != null) {
          mess_err = `Giá trị nhập vào phải >=  ${minBlock}`;
          checkBlockWarn = 1;
        } else if (
          !isNaN(maxBlock) &&
          maxBlock != null &&
          numericValue > maxBlock
        ) {
          mess_err = `Giá trị nhập vào phải <=  ${maxBlock}`;
          checkBlockWarn = 1;
        }

        //cảnh báo
        if (checkBlockWarn == 0) {
          if (numericValue < minWarn && !isNaN(minWarn) && minWarn != null) {
            mess_err = `Giá trị nhập vào khuyến cáo >=  ${minWarn}`;
            checkBlockWarn = 2;
          } else if (
            !isNaN(maxWarn) &&
            maxWarn != null &&
            numericValue > maxBlock
          ) {
            mess_err = `Giá trị nhập vào khuyến cáo <=  ${maxWarn}`;
            checkBlockWarn = 2;
          }
        }
      }
      if (mess_err != '') {
        const divElement = document.createElement('div');
        divElement.className = 'error-message'; // Thêm class 'error-message'
        if (checkBlockWarn == 1)
          divElement.style.color = 'red'; // Thêm style 'color: red;'
        else if (checkBlockWarn == 2) divElement.style.color = '#ffc107';
        divElement.id = `error-${inputId}`; // Thêm id dựa trên id của phần tử input
        divElement.textContent = mess_err;
        inputElement.parentNode.insertBefore(
          divElement,
          inputElement.nextSibling
        );
      }
    }
  }

  setSource() {
    this.myFrame.nativeElement.srcdoc = this.context;
  }

  setExtends() {
    let link = document.createElement('link');
    link.href = 'assets/css/formDong.css';
    link.rel = 'stylesheet';
    link.type = 'text/css';
    frames['myFrame' + this.childId].contentWindow.document.head.appendChild(
      link
    );

    let script = document.createElement('script');
    script.src = 'assets/js/formDong.js';
    script.type = 'text/javascript';
    frames['myFrame' + this.childId].contentWindow.document.body.appendChild(
      script
    );

    if (this.isReadOnly) {
      $('#myFrame' + this.childId)
        .contents()
        .find(':input')
        .prop('readonly', true);
    }
  }

  searchWithKeyword() {
    if (!this.getSelectedText())
      return this.showEmptySelectedText('Chưa chọn nội dung tìm kiếm');
    this.router.navigate([`Search/nhat-ky`], {
      queryParams: { keyword: this.getSelectedText() },
    });
  }

  statisticalWithKeyWord() {
    if (!this.getSelectedText())
      return this.showEmptySelectedText('Chưa chọn nội dung thống kê');
    this.suggest_equipement_list.ShowModal();
    this.suggest_equipement_list.initPopup(this.getSelectedText());
  }

  getSelectedText() {
    const iframeDocument = this.myFrame.nativeElement.contentDocument;
    if (iframeDocument) {
      const selectedText = iframeDocument.getSelection()?.toString();
      return selectedText || '';
    }
    return '';
  }

  showEmptySelectedText(message: string) {
    this.toars.warning(message, null, {
      positionClass: 'toast-bottom-right',
    });
  }
  getListEquipment(): void {
    let equipmentFilter: EquipmentModelFilter = {
      IsActive: true,
      EquipementIds: this.equipementIdArr,
    };
    this.thietBiService
      .getListEquipmentWithTag(equipmentFilter)
      .subscribe((result: ResponseModel) => {
        if (result.Type == ResponseTypeES.Success) {
          this.listEquipment = result.Data;
          this.onSetLstEquipment.emit(result.Data);
        } else if (result.Type == ResponseTypeES.Warning) {
          this.toars.warning(`${result.Message}`, 'Cảnh báo');
        } else {
          this.toars.error(`${result.Message}`, 'Load danh sách thiết bị lỗi');
        }
      });
  }
}

function convertstringToDecimal(value: string): number {
  if (value == '' || value == null) return null;
  return parseFloat(value.replace(',', '')); // Loại bỏ dấu phẩy nếu có
}
