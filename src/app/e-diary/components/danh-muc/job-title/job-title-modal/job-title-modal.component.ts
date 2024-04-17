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
  Validators
} from '@angular/forms';
import { JobTitleModel } from 'src/app/e-diary/models/danh-muc/JobTitleModel';
import { FunctionCode, NgSelectMessage } from 'src/app/e-diary/utils/Enum';

@Component({
  selector: 'app-job-title-modal',
  templateUrl: './job-title-modal.component.html',
  styleUrls: ['./job-title-modal.component.css'],
})
export class JobTitleModalComponent {
  @Input() lstFunctionCode: string[];
  @Input() functionCode: FunctionCode;
  @Input() model: JobTitleModel = {};

  @Output() onSubmitModal = new EventEmitter();
  @Output() onConfirmDel = new EventEmitter();
  @Output() onSwitchEdit = new EventEmitter();

  FunctionCode = FunctionCode;
  popupForm!: FormGroup;
  listConfigCode: string[] = [];
  ngSelectMessage = NgSelectMessage;
  //#region Dùng để validate
  get f(): { [key: string]: AbstractControl } {
    return this.popupForm!.controls;
  }
  //#endregion

  constructor(private formBuilder: FormBuilder) {
    this.popupForm = this.formBuilder.group({
      Name: ['', [Validators.required, Validators.maxLength(100)]],
      Note: ['', [Validators.maxLength(1000)]],
      IsActive: [true, [Validators.required]],
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
    });
  }

  HideModal() {
    ($('#ShiftCategoryModal') as any).modal('hide');
  }

  ShowModal() {
    ($('#ShiftCategoryModal') as any).modal('show');
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
