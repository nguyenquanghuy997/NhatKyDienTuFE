import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import { ConfigModel } from 'src/app/e-diary/models/cau-hinh/ConfigModel';
import { ConfigService } from 'src/app/e-diary/services/cau-hinh/config.service';
import { FunctionCode, NgSelectMessage } from 'src/app/e-diary/utils/Enum';

@Component({
  selector: 'app-config-modal',
  templateUrl: './config-modal.component.html',
  styleUrls: ['./config-modal.component.css'],
})
export class ConfigModalComponent {
  @Input() lstFunctionCode: string[];
  @Input() functionCode: FunctionCode;
  @Input() model: ConfigModel = {};

  @Output() onSubmitModal = new EventEmitter();
  @Output() onSwitchEdit = new EventEmitter();
  @Output() onConfirmDel = new EventEmitter();

  FunctionCode = FunctionCode;
  popupForm!: FormGroup;
  listConfigCode: string[] = [];
  ngSelectMessage = NgSelectMessage;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private configService: ConfigService
  ) {
    this.popupForm = this.formBuilder.group({
      Name: ['', [Validators.required, Validators.maxLength(100)]],
      Code: ['', [Validators.required]],
      Value: ['', [Validators.required, Validators.maxLength(1000)]],
      Note: ['', [Validators.maxLength(1000)]],
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
    this.GetListConfigCode();
    this.popupForm.patchValue({
      Name: this.model.Name,
      Code: this.model.Code,
      Value: this.model.Value,
      Note: this.model.Note,
    });
  }

  GetListConfigCode() {
    this.configService.getListConfigCode().subscribe(
      (result: ResponseModel) => {
        this.listConfigCode = result.Data;
      }
    );
  }

  HideModal() {
    ($('#ConfigModal') as any).modal('hide');
  }

  ShowModal() {
    ($('#ConfigModal') as any).modal('show');
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
    this.model.Code = this.popupForm.controls.Code.value;
    this.model.Name = this.popupForm.controls.Name.value;
    this.model.Value = this.popupForm.controls.Value.value;
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
