import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FunctionCode, NgSelectMessage } from 'src/app/e-diary/utils/Enum';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import { FeatureFunctionModel } from 'src/app/e-diary/models/cau-hinh/FeatureFunctionModel';
import {
  FeatureFilter,
  FeatureModel,
} from 'src/app/e-diary/models/cau-hinh/FeatureModel';
import { RefTypeModel } from 'src/app/e-diary/models/cau-hinh/RefTypeModel';
import { FeatureService } from 'src/app/e-diary/services/cau-hinh/feature.service';
import {
  RuleFilter,
  RuleModel,
} from 'src/app/e-diary/models/quan-tri/RuleModel';
import { RuleService } from 'src/app/e-diary/services/cau-hinh/rule.service';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { options } from 'preact';

@Component({
  selector: 'app-feature-modal',
  templateUrl: './feature-modal.component.html',
  styleUrls: ['./feature-modal.component.css'],
})
export class FeatureModalComponent implements OnInit {
  @Input() lstFunctionCode: string[];
  @Input() functionCode: FunctionCode;
  @Input() model: FeatureModel = {};
  @Input() lstRefType: RefTypeModel[] = [];

  @Output() onSubmitModal = new EventEmitter();
  @Output() onHideModal = new EventEmitter();
  @Output() onEditModal = new EventEmitter();
  @Output() onDeleteModal = new EventEmitter();

  FunctionCode = FunctionCode;

  popupForm!: FormGroup;
  itemValidate: FeatureModel = {};
  submitted: boolean = false;
  lstParent: FeatureModel[] = [];
  lstRule: RuleModel[] = [];
  ngSelectMessage = NgSelectMessage;
  get dislayIsActive() {
    return this.model.IsActive ? 'Hoạt động' : 'Không hoạt động';
  }
  get dislayOnMobile() {
    return this.model.OnMobile ? 'Có' : 'Không';
  }

  //#region Dùng để validate
  get f(): { [key: string]: AbstractControl } {
    return this.popupForm!.controls;
  }
  //#endregion

  constructor(
    private featureService: FeatureService,
    private ruleService: RuleService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    // this.SetupPopup();
    this.popupForm = this.formBuilder.group({
      Name: [
        this.itemValidate.Name,
        [Validators.required, Validators.maxLength(100)],
      ],
      RefTypeId: [this.itemValidate.RefTypeId],
      ParentId: [this.itemValidate.ParentId],
      Url: [this.itemValidate.Url, [Validators.maxLength(300)]],
      IsActive: [this.itemValidate.IsActive, [Validators.required]],
      OnMobile: [this.itemValidate.OnMobile, [Validators.required]],
      Icon: [this.itemValidate.Icon, [Validators.maxLength(100)]],
      Note: [this.itemValidate.Note, [Validators.maxLength(1000)]],
      NO: [
        this.itemValidate.NO,
        [Validators.required, Validators.min(0), Validators.max(2147483647)],
      ],
    });

    // khi document ready thì handle event hide modal
    $(document).ready(function () {
      $('#FeatureModal').on('hidden.bs.modal', function (e) {
        let is_display_none = $('#FeatureModal').css('display') === 'none';
        if (is_display_none) $('#closeModalButton').click();
      });
    });
  }

  SetupPopup() {
    // Load ds menu cha
    let parentFilter: FeatureFilter = {
      IsActive: true,
    };
    this.featureService
      .getListFeature(parentFilter)
      .subscribe((result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.lstParent = result.Data;
          this.lstParent = this.lstParent
            .filter(
              (x) =>
                !(x.Id === this.model.Id) &&
                !`>${x.BreadcrumbId}>`.includes(`>${this.model.Id}>`)
            )
            .sort((a, b) => a.DisplayNO?.localeCompare(b.DisplayNO));
        } else {
          this.toastr.error(`${result.Message}`, 'Load ds Menu cha lỗi');
        }
      });

    // Load ds Rule
    let ruleFilter: RuleFilter = {
      IsActive: true,
    };
    this.ruleService
      .getListItem(ruleFilter)
      .subscribe((result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.lstRule = result.Data;
        } else {
          this.toastr.error(`${result.Message}`, 'Load ds Quyền dữ liệu lỗi');
        }
      });
  }

  ShowModal() {
    ($('#FeatureModal') as any).modal('show');
  }

  HideModal() {
    ($('#FeatureModal') as any).modal('hide');
    this.submitted = false;
    this.popupForm.reset();
  }

  onHide() {
    // clear lựa chọn IsChecked và RuleId
    this.model.FeatureFunctions?.forEach((ff) => {
      ff.IsChecked = null;
      ff.RuleId = null;
    });

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

    // check lại giá trị Quyền dữ liệu, nếu là string "null" => null
    this.model.FeatureFunctions?.forEach((ff) => {
      if (isNaN(Number(ff.RuleId))) ff.RuleId = null;
      else Number(ff.RuleId);
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

  onCheckFunction(item: FeatureFunctionModel) {
    item.IsChecked = !(item.IsChecked ?? false);
  }

  onChangeRuleId(item: FeatureFunctionModel, event: any) {
    let ruleId = event;
    if (ruleId == 'null' || isNaN(Number(ruleId))) ruleId = null;
    item.RuleId = ruleId;
  }

  onChangeRefTypeId(event?: any) {
    console.log('onChangeRefTypeId', event);
    if (this.model.RefTypeId)
      this.model.Url = `processform/reftype/${this.model.RefTypeId}`;
  }
}
