import { DatePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { sysUserChangePassModel } from '../../../../models/quan-tri/sysUserModel';

@Component({
  selector: 'app-user-modal-change-pass',
  templateUrl: './user-modal-change-pass.component.html',
})
export class UserModalChangePassComponent implements OnInit {
  @Input() model: sysUserChangePassModel = {
    Id: 0,
    Username: '',
    OldPassword: '',
    NewPassword: '',
    ReNewPassword: '',
  };
  @Output() onSubmitModal = new EventEmitter();
  @Output() onHideModal = new EventEmitter();

  reactiveForm: FormGroup;
  submitted = false;
  @ViewChild('modalChangePasss') modalChangePasss: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    public datepipe: DatePipe,
    public commonService: CommonService
  ) {}

  ngOnInit() {
    this.reactiveForm = this.formBuilder.group(
      {
        Username: [this.model.Username],
        OldPassword: [this.model.OldPassword, [Validators.required]],
        NewPassword: [
          this.model.NewPassword,
          [
            Validators.required,
            Validators.maxLength(100),
            Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/),
          ],
        ],
        ReNewPassword: [
          this.model.ReNewPassword,
          [
            Validators.required,
            Validators.maxLength(100),
            Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/),
          ],
        ],
      },
      {
        validator: this.confirmedValidator('NewPassword', 'ReNewPassword'),
      }
    );
  }

  ngAfterViewInit() {
    //show event
    $(this.modalChangePasss.nativeElement).on('hidden.bs.modal', () => {
      this.submitted = false;
    });
  }

  confirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl.errors &&
        !matchingControl.errors.confirmedValidator
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  ShowModal() {
    ($('#modalChangePasss') as any).modal('show');
  }

  Hide() {
    ($('#modalChangePasss') as any).modal('hide');
  }

  hideModal() {
    this.onHideModal.emit();
    this.submitted = false;
    this.Hide();
  }

  submitModal() {
    this.submitted = true;
    if (this.reactiveForm?.invalid) {
      return;
    }
    this.onSubmitModal.emit(this.model);
  }

  isShowOldPass = false;
  onMouseDownShowOldPass() {
    this.isShowOldPass = true;
  }
  onMouseUpHideOldPass() {
    this.isShowOldPass = false;
  }
  onMouseOutHideOldPass() {
    this.isShowOldPass = false;
  }

  isShowNewPass = false;
  onMouseDownShowNewPass() {
    this.isShowNewPass = true;
  }
  onMouseUpHideNewPass() {
    this.isShowNewPass = false;
  }
  onMouseOutHideNewPass() {
    this.isShowNewPass = false;
  }

  isShowReNewPass = false;
  onMouseDownShowReNewPass() {
    this.isShowReNewPass = true;
  }
  onMouseUpHideReNewPass() {
    this.isShowReNewPass = false;
  }
  onMouseOutHideReNewPass() {
    this.isShowReNewPass = false;
  }

  get control(): { [key: string]: AbstractControl } {
    return this.reactiveForm!.controls;
  }
}
