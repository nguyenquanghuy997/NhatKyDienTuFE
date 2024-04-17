import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { error } from 'console';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import {
  ShiftFilter,
  ShiftModel,
} from 'src/app/e-diary/models/danh-muc/ShiftModel';
import { ProcessFormModel } from 'src/app/e-diary/models/nhat-ky-van-hanh/ProcessFormModel';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { ShiftService } from 'src/app/e-diary/services/danh-muc/shift.service';
import { FunctionCode } from 'src/app/e-diary/utils/Enum';
import { Utility } from 'src/app/e-diary/utils/Utility';

@Component({
  selector: 'app-truc-ca-create-modal',
  templateUrl: './truc-ca-create-modal.component.html',
  styleUrls: ['./truc-ca-create-modal.component.css'],
})
export class TrucCaCreateModalComponent {
  @Input() lstFunctionCode: string[];
  @Input() functionCode: FunctionCode;
  @Input() model: ProcessFormModel;

  @Input() isVisible: boolean = false;

  @Output() onSubmitModal = new EventEmitter();
  @Output() onHideModal = new EventEmitter();

  FunctionCode = FunctionCode;

  popupForm!: FormGroup;
  itemValidate: ProcessFormModel = {};
  submitted: boolean = false;

  lstShift: ShiftModel[];

  bsConfig: Partial<BsDatepickerConfig> = {
    dateInputFormat: 'DD/MM/YYYY',
    showWeekNumbers: false,
    isAnimated: true,
    showClearButton: true,
  };

  //#region Dùng để validate
  get f(): { [key: string]: AbstractControl } {
    return this.popupForm!.controls;
  }
  //#endregion
  constructor(
    private formBuilder: FormBuilder,
    private shiftService: ShiftService,
    private router: Router,
    private toastr: ToastrService,
    private commonService: CommonService
  ) {
    this.popupForm = this.formBuilder.group({
      StartDTG: [this.itemValidate.StartDTG, [Validators.required]],
      ShiftId: [this.itemValidate.ShiftId, [Validators.required]],
      Note: [this.itemValidate, [Validators.maxLength(1000)]],
    });

    this.SetupModal();
  }

  public SetupModal() {
    // load thông tin ca trực
    let filter: ShiftFilter = {
      IsActive: true,
    };
    this.shiftService.getListShift(filter).subscribe(
      (result: ResponseModel) => {
        if (!this.commonService.checkTypeResponseData(result)) {
          console.error(result.Exception);
          this.toastr.error(result.Message, 'Lỗi');
          return;
        }
        this.lstShift = result.Data;
      }
    );
  }

  onHide() {
    ($('#TrucCaAddnewModal') as any).modal('hide');
    // chuyển event ra ngoài, thêm xử lý bên ngoài nếu cần
    this.onHideModal.emit();
    this.isVisible = false;
    this.submitted = false;
  }

  onSubmit() {
    this.submitted = true;
    if (this.popupForm?.invalid) {
      return;
    }

    // => do có sự thay đổi giá trị nên clone ra 1 obj khác để thực hiện nghiệp vụ submit, tránh ảnh hưởng giá trị obj cũ
    let item = Object.assign({}, this.model);

    // xác định ca trực -> khoảng thời gian
    let shift = this.lstShift.find((x) => {
      return x.Id == item.ShiftId;
    });
    item.ShiftName = shift.Name;

    // xác định StartDate
    // Tính StartDTG = StartDate + StartDate
    // Tính EnđTG = EndDate < StartDate ? (StartDate + 1day) + EndDate : StartDate + EndDate
    shift.StartDTG = new Date(shift.StartDTG); // làm ntn để chắc chắn StartDate là DateTime
    shift.EndDTG = new Date(shift.EndDTG); // làm ntn để chắc chắn EndDate là DateTime
    item.StartDTG = new Date(
      item.StartDTG.getFullYear(),
      item.StartDTG.getMonth(),
      item.StartDTG.getDate(),
      shift.StartDTG.getHours(),
      shift.StartDTG.getMinutes(),
      shift.StartDTG.getSeconds(),
      shift.StartDTG.getMilliseconds()
    );

    item.EndDTG = new Date(
      item.StartDTG.getFullYear(),
      item.StartDTG.getMonth(),
      item.StartDTG.getDate(),
      shift.EndDTG.getHours(),
      shift.EndDTG.getMinutes(),
      shift.EndDTG.getSeconds(),
      shift.EndDTG.getMilliseconds()
    );
    if (shift.EndDTG.getHours() < shift.StartDTG.getHours())
      item.EndDTG.setDate(item.EndDTG.getDate() + 1);

    // Nhận thấy datetime từ timepicker đang sai do ảnh hưởng bởi timezone
    // => xác định time offset rùi add bù lại cho giá trị datetime
    if (item.StartDTG instanceof Date) {
      let startTimezoneOffset = item.StartDTG.getTimezoneOffset();
      item.StartDTG.setMinutes(
        item.StartDTG.getMinutes() - startTimezoneOffset
      );
    } else {
      console.error(`StartDTG không phải Date: ${item.StartDTG}`);
    }
    // Nhận thấy datetime từ timepicker đang sai do ảnh hưởng bởi timezone
    // => xác định time offset rùi add bù lại cho giá trị datetime
    if (item.EndDTG instanceof Date) {
      let endTimezoneOffset = item.EndDTG.getTimezoneOffset();
      item.EndDTG.setMinutes(item.EndDTG.getMinutes() - endTimezoneOffset);
    } else {
      console.error(`EndDTG không phải Date: ${item.EndDTG}`);
    }

    // chuyển ra ngoài để thực hiện Create/Edit
    ($('#TrucCaAddnewModal') as any).modal('hide');
    this.onSubmitModal.emit(item);
    this.isVisible = false;
  }
}
