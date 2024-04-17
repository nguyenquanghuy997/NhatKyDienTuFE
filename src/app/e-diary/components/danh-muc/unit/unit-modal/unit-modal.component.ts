import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { FunctionCode, NgSelectMessage } from 'src/app/e-diary/utils/Enum';
import { UnitModel } from '../../../../models/danh-muc/UnitModel';

@Component({
  selector: 'app-unit-modal',
  templateUrl: './unit-modal.component.html',
  styleUrls: ['./unit-modal.component.scss'],
})
export class UnitModalComponent {
  @Input() model: UnitModel = {};
  @Input() lstFunctionCode: string[];
  @Input() functionCode: FunctionCode;

  @Output() onSubmitModal = new EventEmitter();
  @Output() onSwitchEdit = new EventEmitter();
  @Output() onConfirmDel = new EventEmitter();

  FunctionCode = FunctionCode;
  popupForm!: FormGroup;
  ngSelectMessage = NgSelectMessage;

  constructor(private formBuilder: FormBuilder, ) {
    this.popupForm = this.formBuilder.group({
      Name: ['', [Validators.required, Validators.maxLength(100)]],
      Note: ['', [Validators.maxLength(1000)]],
      IsActive: [true, [Validators.required]],
      IsActiveName: [''],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.popupForm!.controls;
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
      IsActiveName: this.model.IsActive ? "Hoạt động" : "Không hoạt động",
    });
  }

  HideModal() {
    ($('#UnitModal') as any).modal('hide');
  }

  ShowModal() {
    ($('#UnitModal') as any).modal('show');
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
    this.model.Name = this.popupForm.controls.Name.value;
    this.model.IsActive = this.popupForm.controls.IsActive.value;
    this.model.Note = this.popupForm.controls.Note.value;
    // chuyển ra ngoài để thực hiện Create/Edit
    this.onSubmitModal.emit(this.model);
  }

  onEdit() {
    this.onSwitchEdit.emit();
  }

  onDelete() {
    this.onConfirmDel.emit(this.model);
    this.HideModal();
  }
}
