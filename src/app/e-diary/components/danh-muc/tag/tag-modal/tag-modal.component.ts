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
import { FunctionCode, NgSelectMessage } from 'src/app/e-diary/utils/Enum';
import { UnitModel } from 'src/app/e-diary/models/danh-muc/UnitModel';
import { TagModel } from 'src/app/e-diary/models/danh-muc/TagModel';
import { Utility } from 'src/app/e-diary/utils/Utility';

declare var $: any;
@Component({
  selector: 'app-tag-modal',
  templateUrl: './tag-modal.component.html',
})
export class TagModalComponent {
  @Input() model: TagModel = {};
  @Input() lstFunctionCode: string[];
  @Input() functionCode: FunctionCode;
  @Input() listUnit: UnitModel[] = [];

  @Output() onSubmitModal = new EventEmitter();
  @Output() onSwitchEdit = new EventEmitter();
  @Output() onConfirmDel = new EventEmitter();

  FunctionCode = FunctionCode;
  popupForm!: FormGroup;
  ngSelectMessage = NgSelectMessage;

  constructor(private formBuilder: FormBuilder) {
    this.popupForm = this.formBuilder.group({
      Name: ['', [Validators.required, Validators.maxLength(100)]],
      Code: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern('^[a-zA-Z0-9 ]*$'),
        ],
      ],
      Note: ['', [Validators.maxLength(1000)]],
      IsActive: [true, [Validators.required]],
      IsActiveName: [''],
      UnitID: [null],
      UnitName: [''],
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
      Code: this.model.Code,
      Note: this.model.Note,
      UnitID: this.model.UnitID,
      UnitName: this.model.UnitName,
      IsActive: this.model.IsActive,
      IsActiveName: this.model.IsActive ? 'Hoạt động' : 'Không hoạt động',
    });
  }

  HideModal() {
    ($('#TagModal') as any).modal('hide');
  }

  ShowModal() {
    ($('#TagModal') as any).modal('show');
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
    this.model.UnitID = this.popupForm.controls.UnitID.value;
    this.model.IsActive = this.popupForm.controls.IsActive.value;
    this.model.Note = this.popupForm.controls.Note.value;
    this.model.Code = this.popupForm.controls.Code.value;
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
