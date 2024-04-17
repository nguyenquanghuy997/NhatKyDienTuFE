import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormGroup,
  AbstractControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { FunctionCode } from 'src/app/e-diary/utils/Enum';
import { RoleModel } from 'src/app/e-diary/models/quan-tri/RoleModel';
import { Utility } from 'src/app/e-diary/utils/Utility';
import { ESConst } from 'src/app/e-diary/utils/Const';

@Component({
  selector: 'app-role-modal',
  templateUrl: './role-modal.component.html',
  styleUrls: ['./role-modal.component.css'],
})
export class RoleModalComponent {
  @Input() lstFunctionCode: string[];
  @Input() functionCode: FunctionCode;
  @Input() model: RoleModel = {};
  @Input() isVisible: boolean = false;

  @Output() onSubmitModal = new EventEmitter();
  @Output() onHideModal = new EventEmitter();
  @Output() onEditModal = new EventEmitter();
  @Output() onDeleteModal = new EventEmitter();

  FunctionCode = FunctionCode;
  DicGenderDesc = ESConst.DicGenderDesc;

  popupForm!: FormGroup;
  itemValidate: RoleModel = {};
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
      IsActive: [this.itemValidate.IsActive, [Validators.required]],
      Note: [this.itemValidate.Note, [Validators.maxLength(1000)]],
    });
  }

  ShowModal() {
    ($('#RoleModal') as any).modal('show');
  }

  HideModal() {
    this.submitted = false;
    ($('#RoleModal') as any).modal('hide');
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
}
