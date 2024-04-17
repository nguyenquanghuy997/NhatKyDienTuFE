import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FunctionCode } from 'src/app/e-diary/utils/Enum';
import { FunctionModel } from 'src/app/e-diary/models/quan-tri/FunctionModel';
import { Utility } from 'src/app/e-diary/utils/Utility';

@Component({
  selector: 'app-function-modal',
  templateUrl: './function-modal.component.html',
  styleUrls: ['./function-modal.component.css'],
})
export class FunctionModalComponent {
  @Input() lstFunctionCode: string[];
  @Input() functionCode: FunctionCode;
  @Input() model: FunctionModel = {};
  @Input() isVisible: boolean = false;

  @Output() onSubmitModal = new EventEmitter();
  @Output() onHideModal = new EventEmitter();
  @Output() onEditModal = new EventEmitter();
  @Output() onDeleteModal = new EventEmitter();

  FunctionCode = FunctionCode;

  popupForm!: FormGroup;
  itemValidate: FunctionModel = {};
  submitted: boolean = false;

  get dislayIsActive() {
    return this.model.IsActive ? 'Hoạt động' : 'Không hoạt động';
  }

  //#region Dùng để validate
  get f(): { [key: string]: AbstractControl } {
    return this.popupForm!.controls;
  }
  //#endregion

  constructor(private formBuilder: FormBuilder) {
    this.popupForm = this.formBuilder.group({
      Name: [
        this.itemValidate.Name,
        [Validators.required, Validators.maxLength(100)],
      ],
      Code: [
        this.itemValidate.Code,
        [Validators.required, Validators.maxLength(100)],
      ],
      IsActive: [this.itemValidate.IsActive, [Validators.required]],
      Note: [this.itemValidate.Note, [Validators.maxLength(1000)]],
    });
  }

  ShowModal() {
    ($('#FunctionModal') as any).modal('show');
  }

  HideModal() {
    ($('#FunctionModal') as any).modal('hide');
  }

  onHide() {
    // chuyển event ra ngoài, thêm xử lý bên ngoài nếu cần
    this.onHideModal.emit();
    this.isVisible = false;
    this.submitted = false;
    this.HideModal();
  }

  onSubmit() {
    this.submitted = true;
    if (this.popupForm?.invalid) {
      return;
    }
    console.log(this.model);
    // chuyển ra ngoài để thực hiện Create/Edit
    this.onSubmitModal.emit(this.model);
    this.isVisible = false;
  }

  onEdit() {
    // chuyển trạng thái của modal chứ không cần làm gì nữa
    this.onEditModal.emit(this.model.Id);
    // this.functionCode = FunctionCode.EDIT;
  }

  onDelete() {
    // chuyển ra ngoài ds để dùng chung function delete tại đó
    this.onDeleteModal.emit(this.model);
    this.isVisible = false;
  }

  onChangeCode() {
    this.model.Code = Utility.removeVietnameseTones(this.model.Code);
  }
}
