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
import { ToastrService } from 'ngx-toastr';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import { ShiftCategoryModel } from 'src/app/e-diary/models/danh-muc/ShiftCategoryModel';
import { OrganizationModel } from 'src/app/e-diary/models/quan-tri/OrganizationModel';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { OrganizationService } from 'src/app/e-diary/services/quan-tri/organization.service';
import { FunctionCode, NgSelectMessage, TypeOrg } from 'src/app/e-diary/utils/Enum';

@Component({
  selector: 'app-shift-category-modal',
  templateUrl: './shift-category-modal.component.html',
  styleUrls: ['./shift-category-modal.component.css'],
})
export class ShiftCategoryModalComponent {
  @Input() lstFunctionCode: string[];
  @Input() functionCode: FunctionCode;
  @Input() model: ShiftCategoryModel = {};

  @Output() onSubmitModal = new EventEmitter();
  @Output() onConfirmDel = new EventEmitter();
  @Output() onSwitchEdit = new EventEmitter();

  FunctionCode = FunctionCode;
  popupForm!: FormGroup;
  listConfigCode: string[] = [];
  ngSelectMessage = NgSelectMessage;
  lstOrganization: OrganizationModel[] = [];
  //#region Dùng để validate
  get f(): { [key: string]: AbstractControl } {
    return this.popupForm!.controls;
  }
  //#endregion

  constructor(
    private formBuilder: FormBuilder,
    private organizationService: OrganizationService,
    private commonService: CommonService,
    private toastr: ToastrService,
  ) {
    this.popupForm = this.formBuilder.group({
      Name: ['', [Validators.required, Validators.maxLength(100)]],
      OrganizationId: [null],
      OrganizationName: [null],
      Note: ['', [Validators.maxLength(1000)]],
      IsActive: [true, [Validators.required]],
      IsActiveName: ["Hoạt động"],
    });

    this.organizationService
      .getListItem({ IsActive: true, Type: TypeOrg.NhaMay })
      .subscribe((result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.lstOrganization = result.Data;
        } else {
          this.toastr.error(`${result.Message}`, 'Lỗi');
        }
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
      OrganizationId: this.model.OrganizationId,
      OrganizationName: this.model.OrganizationName,
      IsActive: this.model.IsActive,
      IsActiveName: this.model.IsActive ? "Hoạt động" : "Không hoạt động",
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
    this.model.OrganizationId = this.popupForm.controls.OrganizationId.value;
    this.model.IsActive = this.popupForm.controls.IsActive.value;
    this.model.Note = this.popupForm.controls.Note.value;
    this.model.OrganizationId = this.popupForm.controls.OrganizationId.value;
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
