import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import {
  VerifyPasswordModel,
  VerifyTOTPModel,
} from 'src/app/e-diary/models/Commons/VerifyTOTPModel';
import { ShiftScheduleMemberModel } from 'src/app/e-diary/models/cau-hinh/ShiftScheduleMemberModel';
import { ShiftScheduleModel } from 'src/app/e-diary/models/cau-hinh/ShiftScheduleModel';
import { ProcessFormModel } from 'src/app/e-diary/models/nhat-ky-van-hanh/ProcessFormModel';
import { sysUserModel } from 'src/app/e-diary/models/quan-tri/sysUserModel';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { ProcessFormService } from 'src/app/e-diary/services/dynamic-process/process-form.service';

@Component({
  selector: 'app-giao-nhan-modal',
  templateUrl: './giao-nhan-modal.component.html',
  styleUrls: ['./giao-nhan-modal.component.css'],
})
export class GiaoNhanModalComponent {
  @Input() HasOTP: boolean;
  @Input() model: ProcessFormModel;
  @Output() onSubmitModal = new EventEmitter();
  @Output() onHideModal = new EventEmitter();

  submitted: boolean = false;

  lstUserNhanCa: sysUserModel[] = [];
  memberNhanCaDefault: ShiftScheduleMemberModel = {};

  popupForm!: FormGroup;

  VerifyTOTPNhanCa: VerifyTOTPModel = {};
  VerifyTOTPGiaoCa: VerifyTOTPModel = {};

  //#region Dùng để validate
  get f(): { [key: string]: AbstractControl } {
    return this.popupForm!.controls;
  }
  //#endregion

  constructor(
    private processFormService: ProcessFormService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private commonService: CommonService
  ) {
    this.popupForm = this.formBuilder.group({
      TOTPGiaoCa: ['', [Validators.maxLength(100)]],

      TOTPNhanCa: ['', [Validators.maxLength(100)]],
      UserIdNhanCa: [null, [Validators.required]],
    });

    // khi document ready thì handle event hide modal
    $(document).ready(function () {
      $('#modalVerifyTOTP').on('hidden.bs.modal', function (e) {
        let is_display_none = $('#modalVerifyTOTP').css('display') === 'none';
        if (is_display_none) $('#closeModalVerifyTOTPButton').click();
      });
    });
  }

  ngOnInit() {
    this.VerifyTOTPGiaoCa.UserId = this.model.InchargeUserId;
    // xác định control TOTPGiaoCa, TOTPNhanCa
    let controlTOTPGiaoCa = this.f.TOTPGiaoCa;
    let controlTOTPNhanCa = this.f.TOTPNhanCa;

    controlTOTPGiaoCa.setValidators([
      Validators.maxLength(100),
      Validators.required,
    ]);
    controlTOTPGiaoCa.updateValueAndValidity();

    controlTOTPNhanCa.setValidators([
      Validators.maxLength(100),
      Validators.required,
    ]);
    controlTOTPNhanCa.updateValueAndValidity();
  }

  setupForm() {
    // load ds user theo loại trực
    // load thông tin ca tiếp theo
    this.processFormService
      .GetDataSetupFormGiaoNhanCa(this.model.Id, this.model.RefTypeId)
      .subscribe(
        (result: ResponseModel) => {
          if (!this.commonService.checkTypeResponseData(result)) {
            console.error(result.Exception);
            this.toastr.error(`${result.Message}`, 'Lỗi');
            return;
          }

          this.lstUserNhanCa = result.Data.UserNhanCas;
          this.memberNhanCaDefault = result.Data.MemberNhanCa;
          if (!this.memberNhanCaDefault) {
            this.toastr.error(
              'Chưa có lịch trực ca tiếp theo. Vui lòng lập lịch trước khi giao nhận ca!'
            );
            this.HideModal();
          }
          this.VerifyTOTPNhanCa.UserId = this.memberNhanCaDefault?.UserId;
        }
      );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.model?.currentValue) {
      // Xử lý khi model thay đổi
      this.VerifyTOTPGiaoCa.UserId = this.model.InchargeUserId;
    }
  }

  HideModal() {
    this.clearData();
    $('#closeModalVerifyTOTPButton').click();
  }
  ShowModal() {
    this.setupForm();
    this.clearData();
    $('#openModalVerifyTOTPButton').click();
  }
  clearData() {
    this.VerifyTOTPNhanCa.UserId = this.memberNhanCaDefault?.UserId;
    this.VerifyTOTPNhanCa.TOTP = '';
    this.VerifyTOTPGiaoCa.TOTP = '';
  }

  onHide() {
    // chuyển event ra ngoài, thêm xử lý bên ngoài nếu cần
    this.onHideModal.emit();
    this.submitted = false;
  }

  onSubmit() {
    this.submitted = true;
    if (this.popupForm?.invalid) {
      return;
    }
    let verifyTOTPs: VerifyTOTPModel[] = [];
    let verifyPasswords: VerifyPasswordModel[] = [];
    if (this.HasOTP) {
      verifyTOTPs.push(this.VerifyTOTPGiaoCa);
      verifyTOTPs.push(this.VerifyTOTPNhanCa);
    } else {
      let verifyPasswordGiaoCa: VerifyPasswordModel = {
        UserId: this.VerifyTOTPGiaoCa.UserId,
        Password: this.VerifyTOTPGiaoCa.TOTP,
      };
      let verifyPasswordNhanCa: VerifyPasswordModel = {
        UserId: this.VerifyTOTPNhanCa.UserId,
        Password: this.VerifyTOTPNhanCa.TOTP,
      };
      verifyPasswords.push(verifyPasswordGiaoCa);
      verifyPasswords.push(verifyPasswordNhanCa);
    }
    this.onSubmitModal.emit({
      VerifyTOTPs: verifyTOTPs,
      VerifyPasswords: verifyPasswords,
      ShiftIdNext: this.memberNhanCaDefault?.ShiftId,
      InchargeUserIdNext: this.VerifyTOTPNhanCa.UserId,
    });
  }
}
