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
import { ToastrService } from 'ngx-toastr';
import { FunctionCode, NgSelectMessage } from 'src/app/e-diary/utils/Enum';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import { FlowActiveModel } from 'src/app/e-diary/models/cau-hinh/FlowActiveModel';
import { FlowModel } from 'src/app/e-diary/models/cau-hinh/FlowModel';
import {
  RuleFilter,
  RuleModel,
} from 'src/app/e-diary/models/quan-tri/RuleModel';
import { RuleService } from 'src/app/e-diary/services/cau-hinh/rule.service';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/e-diary/services/common.service';

@Component({
  selector: 'app-flow-modal',
  templateUrl: './flow-modal.component.html',
  styleUrls: ['./flow-modal.component.css'],
})
export class FlowModalComponent {
  @Input() lstFunctionCode: string[];
  @Input() functionCode: FunctionCode;
  @Input() model: FlowModel = {};

  @Output() onSubmitModal = new EventEmitter();
  @Output() onHideModal = new EventEmitter();
  @Output() onEditModal = new EventEmitter();
  @Output() onDeleteModal = new EventEmitter();

  FunctionCode = FunctionCode;

  popupForm!: FormGroup;
  itemValidate: FlowModel = {};
  submitted: boolean = false;

  lstRule: RuleModel[] = [];
  IsEditFlowActive: boolean = false;
  IsAddFlowActive: boolean = true;
  ngSelectMessage = NgSelectMessage;
  get dislayIsActive() {
    return this.model.IsActive ? 'Hoạt động' : 'Không hoạt động';
  }

  //#region Dùng để validate
  get f(): { [key: string]: AbstractControl } {
    return this.popupForm!.controls;
  }
  get flowActiveForms(): FormArray {
    return this.f.FlowActives as FormArray;
  }
  //#endregion

  constructor(
    private ruleService: RuleService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private commonService: CommonService
  ) {
    this.popupForm = this.formBuilder.group({
      Name: [
        this.itemValidate.Name,
        [Validators.required, Validators.maxLength(100)],
      ],
      IsActive: [this.itemValidate.IsActive, [Validators.required]],
      Note: [this.itemValidate.Note, [Validators.maxLength(1000)]],
      FlowActives: new FormArray([], [this.checkFlowActiveDuplicateName]),
    });

    // khi document ready thì handle event hide modal
    $(document).ready(function () {
      $('#FlowModal').on('hidden.bs.modal', function (e) {
        let is_display_none = $('#FlowModal').css('display') === 'none';
        if (is_display_none) $('#closeModalButton').click();
      });
    });
  }

  checkFlowActiveDuplicateName(array: FormArray) {
    if (array.controls.length < 2) return null;
    let names = [];
    array.controls.forEach((element: FormGroup) => {
      names.push(element.controls.Name.value);
    });
    names = names.filter((e) => e !== 0 && e);
    return new Set(names).size !== names.length ? { duplicate: true } : null;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.model?.currentValue) {
      this.flowActiveForms.clear();
      if (!this.model.FlowActives || this.model.FlowActives.length == 0) {
        this.model.FlowActives = [];
        this.onAddFlowActive();
      } else {
        for (let i = 0; i < this.model.FlowActives.length; i++) {
          let flowActiveForm = this.createFlowActiveForm();
          this.flowActiveForms.push(flowActiveForm);
        }
      }
    }
  }

  createFlowActiveForm() {
    return this.formBuilder.group({
      Name: ['', [Validators.required, Validators.maxLength(100)]],
      Note: ['', [Validators.maxLength(200)]],
      RuleId: [null, [Validators.required]],
    });
  }

  SetupModal() {
    let ruleFilter: RuleFilter = {
      IsActive: true,
    };
    this.ruleService
      .getListItem(ruleFilter)
      .subscribe((result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.lstRule = result.Data;
        } else {
          this.toastr.error(`${result.Message}`, 'Xóa lỗi');
        }
      });
  }

  ShowModal() {
    ($('#FlowModal') as any).modal('show');
  }

  HideModal() {
    ($('#FlowModal') as any).modal('hide');
  }

  onHide() {
    // chuyển event ra ngoài, thêm xử lý bên ngoài nếu cần
    this.onHideModal.emit();
    this.submitted = false;
    this.HideModal();
  }

  onSubmit() {
    this.submitted = true;
    if (this.popupForm?.invalid) {
      return;
    }
    this.model.FlowActives?.forEach((fa, index) => {
      fa.NO = index + 1;
    });
    // chuyển ra ngoài để thực hiện Create/Edit
    this.onSubmitModal.emit(this.model);
  }

  onEdit() {
    // chuyển trạng thái của modal chứ không cần làm gì nữa
    this.onEditModal.emit(this.model.Id);
    // this.functionCode = FunctionCode.EDIT;
  }

  onDelete() {
    // chuyển ra ngoài ds để dùng chung function delete tại đó
    this.onDeleteModal.emit(this.model);
  }

  onDeleteFlowActive(index: number) {
    if (this.model.FlowActives) {
      this.model.FlowActives.splice(index, 1);
      this.flowActiveForms.removeAt(index);
    }
  }

  onAddFlowActive() {
    let flowActiveNew: FlowActiveModel = {
      Name: '',
      Note: '',
      RuleId: null,
    };

    // add lstFlowActive
    let maxId =
      this.model.FlowActives && this.model.FlowActives.length > 0
        ? Math.max(...this.model.FlowActives.map((x) => x.Id))
        : 0;
    flowActiveNew.Id = (maxId ?? 0) + 1;
    // update tên Rule vì lựa chọn mới lưu đc RuleId
    flowActiveNew.RuleName = this.lstRule.find(
      (x) => x.Id == flowActiveNew.RuleId
    )?.Name;
    this.model.FlowActives.push(flowActiveNew);

    // add form to array
    let flowActiveForm = this.createFlowActiveForm();
    this.flowActiveForms.push(flowActiveForm);
  }
}
