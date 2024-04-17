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
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TenantModel } from 'src/app/e-diary/models/quan-tri/TenantModel';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { FunctionCode, NgSelectMessage } from 'src/app/e-diary/utils/Enum';

@Component({
  selector: 'app-tenant-modal',
  templateUrl: './tenant-modal.component.html',
  styleUrls: ['./tenant-modal.component.css'],
})
export class TenantModalComponent {
  @Input() lstFunctionCode: string[];
  @Input() functionCode: FunctionCode;
  @Input() model: TenantModel = {};
  @Output() onSubmitModal = new EventEmitter();
  @Output() onConfirmDel = new EventEmitter();
  @Output() onSwitchEdit = new EventEmitter();

  FunctionCode = FunctionCode;
  popupForm!: FormGroup;
  listConfigCode: string[] = [];
  ngSelectMessage = NgSelectMessage;

  constructor(private formBuilder: FormBuilder) {
    this.initForm();
  }
  get f(): { [key: string]: AbstractControl } {
    return this.popupForm!.controls;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.model?.currentValue) {
      this.initData();
    }
  }
  initForm() {
    this.popupForm = this.formBuilder.group({
      Name: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
          this.noWhitespaceValidator,
        ],
      ],
      Note: ['', [Validators.maxLength(1000)]],
      Code: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern('^[a-zA-Z0-9 ]*$'),
          this.noWhitespaceValidator,
        ],
      ],
      IsActive: [true, [Validators.required]],
      IsActiveName: [''],
    });
  }

  initData() {
    this.popupForm.patchValue({
      Name: this.model.Name,
      Code: this.model.Code,
      Note: this.model.Note,
      IsActive: this.model.IsActive,
      IsActiveName: this.model.IsActive ? 'Hoạt động' : 'Không hoạt động',
    });
  }

  HideModal() {
    ($('#TenantModal') as any).modal('hide');
  }

  ShowModal() {
    ($('#TenantModal') as any).modal('show');
    this.initForm();
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
    this.model.Code = this.popupForm.controls.Code.value.trim();
    this.model.Note = this.popupForm.controls.Note.value;
    this.model.IsActive = this.popupForm.controls.IsActive.value;
    this.onSubmitModal.emit(this.model);
  }

  onEdit() {
    this.onSwitchEdit.emit();
  }

  onDelete() {
    this.onConfirmDel.emit(this.model);
    this.HideModal();
  }

  noWhitespaceValidator(control: FormControl) {
    return (control.value || '').trim().length ? null : { whitespace: true };
  }
}
