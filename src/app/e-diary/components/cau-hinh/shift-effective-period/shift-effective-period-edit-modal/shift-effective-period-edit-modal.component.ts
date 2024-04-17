import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { viLocale } from 'ngx-bootstrap/locale';
import { ShiftEffectivePeriodModel } from 'src/app/e-diary/models/danh-muc/ShiftEffectivePeriodModel';
import { FunctionCode } from 'src/app/e-diary/utils/Enum';
defineLocale('vi', viLocale);
@Component({
  selector: 'app-shift-effective-period-edit-modal',
  templateUrl: './shift-effective-period-edit-modal.component.html',
  styleUrls: ['./shift-effective-period-edit-modal.component.css'],
})
export class ShiftEffectivePeriodEditModalComponent {
  @Input() lstFunctionCode: string[];
  @Input() model: ShiftEffectivePeriodModel = {};

  @Output() onSubmitModal = new EventEmitter();

  FunctionCode = FunctionCode;
  popupForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.resetForm();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.popupForm!.controls;
  }

  get shifts() {
    return this.popupForm.get('Shifts') as FormArray;
  }

  get shiftComponents() {
    return this.popupForm.get('ShiftComponents') as FormArray;
  }

  resetForm() {
    this.popupForm = this.formBuilder.group({
      Name: ['', [Validators.required, Validators.maxLength(100)]],
      Note: ['', [Validators.maxLength(1000)]],
      Color: ['#1565c0', [Validators.required]],
      IsActive: [true, [Validators.required]],
      ShiftCategoryName: [null],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.model?.currentValue) {
      this.initData();
    }
  }

  initData() {
    this.popupForm.patchValue({
      Name: this.model.Name,
      Note: this.model.Note,
      IsActive: this.model.IsActive,
      Color: this.model.Color ?? '#1565c0',
      ShiftCategoryName: this.model.ShiftCategoryName,
    });
  }

  HideModal() {
    ($('#ShiftCategoryEditModal') as any).modal('hide');
  }

  ShowModal() {
    ($('#ShiftCategoryEditModal') as any).modal('show');
    this.resetForm();
    this.popupForm.reset();
  }

  onHide() {
    // chuyển event ra ngoài, thêm xử lý bên ngoài nếu cần
    this.HideModal();
  }

  onSubmit() {
    if (this.popupForm?.invalid) {
      this.popupForm.markAllAsTouched();
      return;
    }
    this.model.Name = this.popupForm.controls.Name.value.trim();
    this.model.Note = this.popupForm.controls.Note.value;
    this.model.Color = this.popupForm.controls.Color.value;
    this.model.IsActive = this.popupForm.controls.IsActive.value;

    this.onSubmitModal.emit(this.model);
  }
}
