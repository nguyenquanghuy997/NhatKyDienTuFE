import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import {
  EquipmentModel,
  EquipmentModelFilter,
} from 'src/app/e-diary/models/cau-hinh/EquipmentModel';
import { EquipmentTagModel } from 'src/app/e-diary/models/cau-hinh/EquipmentTagModel';
import { TagModel } from 'src/app/e-diary/models/danh-muc/TagModel';
import {
  OrganizationModel,
  OrganizationModelFilter,
} from 'src/app/e-diary/models/quan-tri/OrganizationModel';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { EquipmentService } from 'src/app/e-diary/services/danh-muc/equipment.service';
import { TagService } from 'src/app/e-diary/services/danh-muc/tag.service';
import { OrganizationService } from 'src/app/e-diary/services/quan-tri/organization.service';
import {
  FunctionCode,
  NgSelectMessage,
  TypeOrg,
} from 'src/app/e-diary/utils/Enum';
import { Utility } from 'src/app/e-diary/utils/Utility';
@Component({
  selector: 'app-equipment-modal',
  templateUrl: './equipment-modal.component.html',
  styleUrls: ['./equipment-modal.component.css'],
})
export class EquipmentModalComponent {
  @Input() lstFunctionCode: string[];
  @Input() functionCode: FunctionCode;
  @Input() model: EquipmentModel = {};
  @Output() onSubmitModal = new EventEmitter();
  @Output() onHideModal = new EventEmitter();
  @Output() onEditModal = new EventEmitter();
  @Output() onDeleteModal = new EventEmitter();
  @Input() isVisible = true;
  @ViewChild('slider', { static: true }) sliderElement!: ElementRef;

  FunctionCode = FunctionCode;
  reactiveForm!: FormGroup;
  FeedBack!: FormGroup;
  submitted = false;
  itemEquipement: EquipmentModel = {};
  lstTag: TagModel[] = [];
  lstParent: EquipmentModel[] = [];

  editIndex: number = -1;
  oldValue: any;
  equipmentId: number = 0;

  IsEditItem: boolean = false;
  IsAddItem: boolean = true;

  sliderValue = 50; // Initial value for the slider
  sliderConfig: any;
  someMin: number = -999;
  someMax: number = 9999;
  ngSelectMessage = NgSelectMessage;
  lstOrg: OrganizationModel[] = [];
  typeOrg = TypeOrg;
  // validate form
  get f(): { [key: string]: AbstractControl } {
    return this.reactiveForm!.controls;
  }
  get equipmentTagForms() {
    return this.f.EquipmentTags as FormArray;
  }
  get dislayIsActive() {
    return this.model.IsActive ? 'Hoạt động' : 'Không hoạt động';
  }

  constructor(
    public formBuilder: FormBuilder,
    private thongTinService: TagService,
    private toastr: ToastrService,
    private commonService: CommonService,
    private thietBiService: EquipmentService,
    private organizationService: OrganizationService
  ) {
    this.itemEquipement = {} as EquipmentModel;
    // this.addDefaultRow();
    this.initSlider();
    // this.initPopup();

    this.reactiveForm = this.formBuilder.group({
      Name: [
        this.itemEquipement.Name,
        [Validators.required, Validators.maxLength(100)],
      ],
      Code: [
        this.itemEquipement.Code,
        [Validators.required, Validators.maxLength(100)],
      ],
      Note: [this.itemEquipement.Note, [Validators.maxLength(1000)]],
      IsActive: [this.itemEquipement.IsActive, [Validators.required]],
      Id: [this.itemEquipement.Id],
      ParentId: [this.itemEquipement.ParentId],
      OrganizationId: [this.itemEquipement.OrganizationId],
      EquipmentTags: new FormArray([], [this.checkEquipmentTagDuplicateTag]),
    });

    // khi document ready thì handle event hide modal
    $(document).ready(function () {
      $('#EquipmentModal').on('hidden.bs.modal', function (e) {
        let is_display_none = $('#EquipmentModal').css('display') === 'none';
        if (is_display_none) $('#closeModalButton').click();
      });
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.model?.currentValue) {
      this.equipmentTagForms.clear();
      if (!this.model.EquipmentTags || this.model.EquipmentTags.length == 0) {
        this.model.EquipmentTags = [];
        // this.onAddTag();
      } else {
        for (let i = 0; i < this.model.EquipmentTags.length; i++) {
          let equipTag = this.model.EquipmentTags[i];
          equipTag.SliderBlock = [
            equipTag.MinBlocking ?? 0,
            equipTag.MaxBlocking ?? 0,
          ];
          equipTag.SliderWarn = [
            equipTag.MinWarning ?? 0,
            equipTag.MaxWarning ?? 0,
          ];

          let form = this.createEquipmentTagForm();
          this.equipmentTagForms.push(form);
        }
      }
    }
  }

  checkEquipmentTagDuplicateTag(array: FormArray) {
    if (array.controls.length < 2) return null;
    let tagIds = [];
    array.controls.forEach((element: FormGroup) => {
      if (element.controls.TagId.value)
        tagIds.push(element.controls.TagId.value);
    });
    let isDuplicate = new Set(tagIds).size !== tagIds.length;
    return isDuplicate ? { duplicate: true } : null;
  }

  createEquipmentTagForm(): FormGroup {
    return this.formBuilder.group({
      TagId: [null, [Validators.required]],
      SliderBlock: [null, [Validators.required]],
      MinBlocking: [null],
      MaxBlocking: [null],
      SliderWarn: [null, [Validators.required]],
      MinWarning: [null],
      MaxWarning: [null],
    });
  }

  initSlider() {
    // block
    this.sliderConfig = {
      connect: true,
      step: 0.1,
      range: {
        min: this.someMin,
        max: this.someMax,
      },
    };
  }
  initPopup() {
    let parentFilter: EquipmentModelFilter = {
      IsActive: true,
    };
    this.thietBiService.getListEquipment(parentFilter).subscribe(
      (result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.lstParent = result.Data;
          this.lstParent = this.lstParent.filter(
            (x) =>
              !(x.Id === this.model.Id) &&
              !`>${x.BreadcrumbId}>`.includes(`>${this.model.Id}>`)
          );
        } else {
          this.toastr.error(
            `${result.Message}`,
            'Load danh sách thiết bị cha lỗi'
          );
        }
        // .sort((a, b) => a.DisplayNO.localeCompare(b.DisplayNO));
      }
    );

    // danh sách thông số
    this.thongTinService.GetListTag().subscribe(
      (result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.lstTag = result.Data;
        } else {
          this.toastr.error(
            `${result.Message}`,
            'Load danh sách thông số lỗi!'
          );
        }
      }
    );

    // danh sách đơn vị
    let organizationModelFilter: OrganizationModelFilter = {
      IsActive: true,
      Type: this.typeOrg.NhaMay,
    };

    this.organizationService.getListItem(organizationModelFilter).subscribe(
      (res: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(res)) {
          this.lstOrg = res.Data;
        } else {
          this.toastr.error(`${res.Message}`, 'Lỗi');
        }
      }
    );
  }

  ShowModal() {
    // $('#closeModalButton').click();
    ($('#EquipmentModal') as any).modal('show');
    this.submitted = false;
    this.initPopup();
    $('body').on('shown.bs.modal', '#EquipmentModal', function () {
      $('input:visible:enabled:first', this).focus();
    });
  }

  HideModal() {
    // $('#closeModalButton').click();
    ($('#EquipmentModal') as any).modal('hide');
    this.submitted = false;
  }

  onHide() {
    this.reactiveForm.reset();
    // this.onClearItem();
    // chuyển event ra ngoài, thêm xử lý bên ngoài nếu cần
    this.onHideModal.emit();
    this.submitted = false;
    ($('#EquipmentModal') as any).modal('hide');
  }

  onSubmit() {
    this.submitted = true;
    if (this.reactiveForm?.invalid) {
      return;
    }
    // chuyển ra ngoài để thực hiện Create/Edit
    this.onSubmitModal.emit(this.model);
  }

  onEdit() {
    // chuyển trạng thái của modal chứ không cần làm gì nữa
    this.onEditModal.emit(this.model.Id);
  }

  onDelete() {
    // chuyển ra ngoài ds để dùng chung function delete tại đó
    this.onDeleteModal.emit(this.model);
  }

  onDeleteTag(index: number) {
    if (this.model.EquipmentTags) {
      this.model.EquipmentTags.splice(index, 1);

      this.equipmentTagForms.removeAt(index);
    }
  }

  onAddTag() {
    let equipTag: EquipmentTagModel = {
      TagId: null,
      UnitName: '',
      TagName: '',
      Id: null,
      MinBlocking: null,
      MaxBlocking: null,
      MinWarning: null,
      MaxWarning: null,
      SliderBlock: [0, 0],
      SliderWarn: [0, 0],
    };

    let maxId =
      this.model.EquipmentTags && this.model.EquipmentTags.length > 0
        ? Math.max(...this.model.EquipmentTags.map((x) => x.Id))
        : 0;
    equipTag.Id = (maxId ?? 0) + 1;
    this.model.EquipmentTags.push(equipTag);

    // Add equipmentTagForm
    let form = this.createEquipmentTagForm();
    this.equipmentTagForms.push(form);
  }

  SelectTagChangeHandler(rowIndex: number) {
    let equipTag = this.model.EquipmentTags[rowIndex];
    if (equipTag) {
      let tag = this.lstTag.find((x) => x.Id == equipTag.TagId);
      let unitName = '';
      if (tag) unitName = tag.UnitName;
      equipTag.UnitName = unitName;
      equipTag.TagName = tag.Name;
    }
    // if (property) formGroup.controls['UnitName'].patchValue(`${unitName}`);
  }

  onChangeSliderBlock(values, index: number) {
    const [min, max] = values;
    let equipTag = this.model.EquipmentTags[index];
    equipTag.MinBlocking = min;
    equipTag.MaxBlocking = max;
  }

  onChangeSliderWarning(values, index: number) {
    const [min, max] = values;
    let equipTag = this.model.EquipmentTags[index];
    equipTag.MinWarning = min;
    equipTag.MaxWarning = max;
  }

  onChangeInputMinBlock(index: number) {
    let equipTag = this.model.EquipmentTags[index];
    equipTag.SliderBlock = [
      equipTag.MinBlocking ?? 0,
      equipTag.MaxBlocking ?? 0,
    ];
  }

  onChangeInputMaxBlock(index: number) {
    let equipTag = this.model.EquipmentTags[index];
    equipTag.SliderBlock = [
      equipTag.MinBlocking ?? 0,
      equipTag.MaxBlocking ?? 0,
    ];
  }

  onChangeInputMinWarning(index: number) {
    let equipTag = this.model.EquipmentTags[index];
    equipTag.SliderWarn = [equipTag.MinWarning ?? 0, equipTag.MaxWarning ?? 0];
  }

  onChangeInputMaxWarning(index: number) {
    let equipTag = this.model.EquipmentTags[index];
    equipTag.SliderWarn = [equipTag.MinWarning ?? 0, equipTag.MaxWarning ?? 0];
  }

  onChangeCode() {
    this.model.Code = Utility.removeVietnameseTones(this.model.Code);
  }

  onChangeParentId() {
    // nếu có nghiệp vụ cha thì ko cần set Flow, CA, OTP nữa, tất cả theo nghiệp vụ cha hết
    let parent: EquipmentModel = this.lstParent.find(
      (x) => x.Id == this.model.ParentId
    );
    this.model.OrganizationId = parent?.OrganizationId;
  }
}
