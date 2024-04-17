import {
  Component,
  EventEmitter,
  Input,
  OnInit,
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
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import {
  EquipmentModel,
  EquipmentModelFilter,
} from 'src/app/e-diary/models/cau-hinh/EquipmentModel';
import { EquipmentTagModel } from 'src/app/e-diary/models/cau-hinh/EquipmentTagModel';
import {
  OrganizationModel,
  OrganizationModelFilter,
} from 'src/app/e-diary/models/quan-tri/OrganizationModel';
import { ThuocTinhFormModel } from 'src/app/e-diary/models/thuoc-tinh-form';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { EquipmentService } from 'src/app/e-diary/services/danh-muc/equipment.service';
import { OrganizationService } from 'src/app/e-diary/services/quan-tri/organization.service';
import { ESConst } from 'src/app/e-diary/utils/Const';
import {
  NgSelectMessage,
  ResponseTypeES,
  TypeInput,
  TypeOrg,
  cleaveInputClass,
} from 'src/app/e-diary/utils/Enum';
import { Utility } from 'src/app/e-diary/utils/Utility';
declare var $: any;

@Component({
  selector: 'app-modal-input-edit',
  templateUrl: './modal-input-edit.component.html',
  styleUrls: ['./modal-input-edit.component.css'],
})
export class ModalInputEditComponent implements OnInit {
  @Input() isVisible: boolean = true;
  @Input() isEdit: boolean = true;
  @Input() identity: string = '';
  @Output() submitModel = new EventEmitter();
  @Output() onHideModal = new EventEmitter();
  typeInputInsert: string = '';
  reactiveForm_!: FormGroup;
  listEquipment: EquipmentModel[] = [];
  typeInputArr: any[] = ESConst.TypeInputArray;
  thuocTinhInput!: ThuocTinhFormModel;
  selectedTagId: number;
  EquipmentSelected: EquipmentModel;
  lstTag: EquipmentTagModel[] = [];
  hasElementCoppy: boolean = false;
  ngSelectMessage = NgSelectMessage;
  typeOrg = TypeOrg;
  lstOrg: OrganizationModel[] = [];
  constructor(
    private formBuilder_: FormBuilder,
    private thietBiService: EquipmentService,
    private toastr: ToastrService,
    private organizationService: OrganizationService,
    private commonService: CommonService
  ) {
    this.thuocTinhInput = {} as ThuocTinhFormModel;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.identity?.currentValue) {
      this.initPopup();
    }
  }

  ngOnInit() {
    this.reactiveForm_ = this.formBuilder_.group({
      chisoThietBi: 0,
      TagName: [
        this.thuocTinhInput.TagName,
        [Validators.required, Validators.maxLength(100)],
      ],
      Placeholder: '',
      Rows: 0,
      minValue: 0,
      maxValue: 0,
      typeInput: '',
      MinBlocking: null,
      MaxBlocking: null,
      MinWarning: null,
      MaxWarning: null,
      EquipmentId: null,
      EquipmentTagId: null,
      EquipmentName: '',
      EquipmentTagName: '',
      Equipment: null,
      EquipmentCode: '',
      OrganizationId: null,
      TagId: null,
    });
  }

  initPopup() {
    this.hasElementCoppy = sessionStorage.getItem(
      ESConst.LocalStorage.Key.ElementForm
    )
      ? true
      : false;
    this.getListEquipment();
    this.getLstOrg();
    let ele = $('#htmlForm #' + this.identity);
    $('#identityModal').val(this.identity);
    this.typeInputInsert = Utility.getTypeInput(this.identity, 'htmlForm');
    this.reactiveForm_.patchValue({
      chisoThietBi: ele.attr('data-equipmenttagid'),
      EquipmentId: ele.attr('data-equipmentid'),
      TagName: ele.attr('data-tag'),
      Placeholder: ele.attr('placeholder'),
      Rows: parseInt(ele.attr('rows')),
      typeInput: this.typeInputInsert,
      MinBlocking: ele.attr('data-minblock'),
      MaxBlocking: ele.attr('data-maxblock'),
      MinWarning: ele.attr('data-minwarn'),
      MaxWarning: ele.attr('data-maxwarn'),
      EquipmentTagId: ele.attr('data-equipmenttagid'),
      EquipmentName: ele.attr('data-equipmentname'),
      EquipmentTagName: ele.attr('data-equipmenttagname'),
      EquipmentCode: ele.attr('data-equipmentcode'),
      OrganizationId: ele.attr('data-organizationid'),
      TagId: ele.attr('data-tagid'),
    });
    let equipmentId = ele.attr('data-equipmentid');
    if (equipmentId > 0) {
      setTimeout(() => {
        this.reactiveForm_.controls['Equipment'].setValue(
          parseInt(equipmentId)
        );
        this.lstTag = this.EquipmentSelected.EquipmentTags;
        if (ele.attr('data-equipmenttagid')) {
          let equipmenttagid = ele.attr('data-equipmenttagid');
          this.selectedTagId = parseInt(equipmenttagid);
        }
      }, 200);
      let organizationId = ele.attr('data-organizationid');
      if (organizationId > 0) {
        this.reactiveForm_.controls['OrganizationId'].setValue(
          parseInt(organizationId)
        );
      }
    }
    this.reactiveForm_.controls.TagName.markAsDirty();
    if (this.typeInputInsert === 'number') {
      this.reactiveForm_.controls.maxValue.setValue(
        ele.attr('max') !== undefined
          ? Math.floor(ele.attr('max')) == ele.attr('max') &&
            $.isNumeric(ele.attr('max'))
            ? parseInt(ele.attr('max'))
            : 0
          : 0
      );
      this.reactiveForm_.controls.minValue.setValue(
        ele.attr('min') !== undefined
          ? Math.floor(ele.attr('min')) == ele.attr('min') &&
            $.isNumeric(ele.attr('min'))
            ? parseInt(ele.attr('min'))
            : 0
          : 0
      );
    } else {
      this.reactiveForm_.controls.maxValue.setValue(
        parseInt(ele.attr('maxlength') ?? 0)
      );
      this.reactiveForm_.controls.minValue.setValue(
        parseInt(ele.attr('minlength') ?? 0)
      );
    }
    $('body')
      .off()
      .on('shown.bs.modal', '#modalInputEdit', function () {
        setTimeout(() => {
          $('#txtTagNameEdit').focus();
        }, 300);
      });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.reactiveForm_!.controls;
  }

  hideModal() {
    this.isVisible = false;
    this.onHideModal.emit(false);
    this.reactiveForm_?.reset();
  }

  onSubmit(): void {
    $(`#${this.identity}`).attr(
      'data-organizationid',
      this.reactiveForm_.controls.OrganizationId.value
    );
    $(`#${this.identity}`).attr(
      'data-equipmentid',
      this.reactiveForm_.controls.EquipmentId.value
    );
    $(`#${this.identity}`).attr(
      'data-equipmenttagid',
      this.reactiveForm_.controls.EquipmentTagId.value
    );
    $(`#${this.identity}`).attr(
      'data-equipmentname',
      this.reactiveForm_.controls.EquipmentName.value
    );
    $(`#${this.identity}`).attr(
      'data-equipmentcode',
      this.reactiveForm_.controls.EquipmentCode.value
    );
    $(`#${this.identity}`).attr(
      'data-equipmenttagname',
      this.reactiveForm_.controls.EquipmentTagName.value
    );
    $(`#${this.identity}`).attr(
      'data-tag',
      this.reactiveForm_.controls.TagName.value
    );
    $(`#${this.identity}`).attr(
      'data-tagid',
      this.reactiveForm_.controls.TagId.value
    );
    $(`#${this.identity}`).attr(
      'placeholder',
      this.reactiveForm_.controls.Placeholder.value
    );

    switch (this.reactiveForm_.controls.typeInput.value) {
      case TypeInput.NUMBER:
        $(`#${this.identity}`).removeClass();
        $(`#${this.identity}`).addClass(
          'form-control ' + cleaveInputClass.NUMBER
        );
        $(`#${this.identity}`).attr(
          'max',
          Math.floor(this.reactiveForm_.controls.maxValue.value) ==
            this.reactiveForm_.controls.maxValue.value &&
            $.isNumeric(this.reactiveForm_.controls.maxValue.value)
            ? this.reactiveForm_.controls.maxValue.value
            : null
        );
        $(`#${this.identity}`).attr(
          'min',
          Math.floor(this.reactiveForm_.controls.minValue.value) ==
            this.reactiveForm_.controls.minValue.value &&
            $.isNumeric(this.reactiveForm_.controls.minValue.value)
            ? this.reactiveForm_.controls.minValue.value
            : null
        );
        $(`#${this.identity}`).attr(
          'data-minblock',
          this.reactiveForm_.controls.MinBlocking.value
        );
        $(`#${this.identity}`).attr(
          'data-maxblock',
          this.reactiveForm_.controls.MaxBlocking.value
        );
        $(`#${this.identity}`).attr(
          'data-minwarn',
          this.reactiveForm_.controls.MinWarning.value
        );
        $(`#${this.identity}`).attr(
          'data-maxwarn',
          this.reactiveForm_.controls.MaxWarning.value
        );
        break;
      case TypeInput.TEXT:
        $(`#${this.identity}`).removeClass();
        $(`#${this.identity}`).addClass(
          'form-control ' + cleaveInputClass.TEXT
        );
        if (this.reactiveForm_.controls.maxValue.value) {
          $(`#${this.identity}`).attr(
            'maxlength',
            this.reactiveForm_.controls.maxValue.value
          );
        }
        if (this.reactiveForm_.controls.minValue.value) {
          $(`#${this.identity}`).attr(
            'minlength',
            this.reactiveForm_.controls.minValue.value
          );
        }
        break;
      case TypeInput.TEXTAREA:
        if (this.reactiveForm_.controls.maxValue.value) {
          $(`#${this.identity}`).attr(
            'maxlength',
            this.reactiveForm_.controls.maxValue.value
          );
        }
        if (this.reactiveForm_.controls.minValue.value) {
          $(`#${this.identity}`).attr(
            'minlength',
            this.reactiveForm_.controls.minValue.value
          );
        }
        $(`#${this.identity}`).attr(
          'rows',
          this.reactiveForm_.controls.Rows.value
        );
        break;
      case TypeInput.DATE:
        $(`#${this.identity}`).removeClass();
        $(`#${this.identity}`).addClass(
          'form-control ' + cleaveInputClass.DATE
        );
        $(`#${this.identity}`).attr('name', `dateTime-${this.identity}`);
        $(`#${this.identity}`).attr('placeholder', 'dd/mm/yyyy');
        break;
      case TypeInput.DATEPICKER:
        $(`#${this.identity}`).removeClass();
        $(`#${this.identity}`).addClass(
          'form-control ' + cleaveInputClass.DATEPICKER
        );
        $(`#${this.identity}`).attr('placeholder', 'dd/mm/yyyy HH:mm');
        break;
      case TypeInput.TIME_HH_MM:
        $(`#${this.identity}`).removeClass();
        $(`#${this.identity}`).addClass(
          'form-control ' + cleaveInputClass.TIME_HH_MM
        );
        $(`#${this.identity}`).attr('name', `dateTime-${this.identity}`);
        $(`#${this.identity}`).attr('placeholder', 'HH:mm');
        break;
      case TypeInput.TIME_HH_MM_SS:
        $(`#${this.identity}`).removeClass();
        $(`#${this.identity}`).addClass(
          'form-control ' + cleaveInputClass.TIME_HH_MM_SS
        );
        $(`#${this.identity}`).attr('name', `dateTime-${this.identity}`);
        $(`#${this.identity}`).attr('placeholder', 'HH:mm:ss');
        break;
    }
    this.changeTagNameElement(this.reactiveForm_.controls.typeInput.value);
    this.submitModel.emit();
    $('#closeModalButtonEdit').click();
    $('#btnFormatContent').click();
    this.hideModal();
  }

  getListEquipment(OrganizationId?: number): void {
    let equipmentFilter: EquipmentModelFilter = {
      IsActive: true,
      OrganizationId: OrganizationId,
    };
    this.thietBiService.getListEquipmentWithTag(equipmentFilter).subscribe(
      (result: ResponseModel) => {
        if (result.Type == ResponseTypeES.Success) {
          this.listEquipment = result.Data;
          let ele = $('#htmlForm #' + this.identity);
          this.EquipmentSelected = this.listEquipment.find(
            (x) => x.Id == ele.attr('data-equipmentid')
          );
        } else if (result.Type == ResponseTypeES.Warning) {
          this.toastr.warning(`${result.Message}`, 'Cảnh báo');
        } else {
          this.toastr.error(`${result.Message}`, 'Load danh sách thiết bị lỗi');
        }
      }
    );
  }

  changeTagNameElement(type: string) {
    if (this.typeInputInsert === type) {
      return;
    }
    if (type === TypeInput.TEXTAREA) {
      document.getElementById(this.identity).outerHTML = document
        .getElementById(this.identity)
        .outerHTML.replace(/input/g, 'textarea');
      return;
    } else if (this.typeInputInsert === TypeInput.TEXTAREA) {
      document.getElementById(this.identity).outerHTML = document
        .getElementById(this.identity)
        .outerHTML.replace(/textarea/g, 'input');
    }
  }

  HasNameExist(input: FormControl) {
    if (!$('#identityModal').val()) {
      return null;
    }
    let ele = $('#htmlForm :input[data-tag="' + input.value + '"]').not(
      '#' + $('#identityModal').val()
    );
    return ele.length > 0 ? { duplicateName: true } : null;
  }
  // xử lý chọn thiết bị,chỉ số
  onSelectChangeEquipement(event: any) {
    if (event === undefined) return;
    this.lstTag = null;
    this.clearAttributeEquipmentTag();
    this.reactiveForm_.patchValue({
      EquipmentId: null,
      EquipmentCode: '',
    });
    this.lstTag = event.EquipmentTags;
    this.reactiveForm_.patchValue({
      EquipmentId: event.Id,
      EquipmentCode: event.Code,
    });
  }

  onClearEquipment() {
    this.clearAttributeEquipmentTag();
    this.lstTag = null;
  }

  onSelectChangeTag(tagId: any) {
    if (tagId === undefined) return;
    if (parseInt(tagId) > 0) this.setAttributeEquipmentTag(tagId);
    else this.clearAttributeEquipmentTag();
  }

  onClearTag() {
    this.clearAttributeEquipmentTag();
  }
  setAttributeEquipmentTag(Id: number) {
    let tagItem: EquipmentTagModel = this.lstTag.find((x) => x.Id == Id);
    this.reactiveForm_.patchValue({
      MinBlocking: tagItem.MinBlocking,
      MaxBlocking: tagItem.MaxBlocking,
      MinWarning: tagItem.MinWarning,
      MaxWarning: tagItem.MaxWarning,
      EquipmentId: tagItem.EquipmentId,
      EquipmentTagId: tagItem.Id,
      EquipmentName: tagItem.EquipmentName,
      TagName: tagItem.EquipmentTagCode,
      EquipmentTagName: tagItem.TagName,
      EquipmentCode: tagItem.EquipmentCode,
      TagId: tagItem.TagId,
    });
  }
  clearAttributeEquipmentTag() {
    this.reactiveForm_.patchValue({
      MinBlocking: null,
      MaxBlocking: null,
      MinWarning: null,
      MaxWarning: null,
      EquipmentId: null,
      EquipmentTagId: null,
      EquipmentName: '',
      EquipmentTagName: '',
      EquipmentCode: '',
      TagId: null,
    });
  }
  CoppyDataModal() {
    let elementForm: ThuocTinhFormModel = {
      Placeholder: this.reactiveForm_.controls.Placeholder.value,
      Rows: this.reactiveForm_.controls.Rows.value,
      TagName: this.reactiveForm_.controls.TagName.value,
      minValue: this.reactiveForm_.controls.minValue.value
        ? this.reactiveForm_.controls.minValue.value
        : null,
      maxValue: this.reactiveForm_.controls.maxValue.value
        ? this.reactiveForm_.controls.maxValue.value
        : null,
      typeInput: this.reactiveForm_.controls.typeInput.value,
      EquipmentId: this.reactiveForm_.controls.Equipment.value
        ? this.reactiveForm_.controls.Equipment.value
        : null,
      EquipmentTagId: this.reactiveForm_.controls.EquipmentTagId.value
        ? this.reactiveForm_.controls.EquipmentTagId.value
        : null,
      EquipmentName: this.reactiveForm_.controls.EquipmentName.value
        ? this.reactiveForm_.controls.EquipmentName.value
        : '',
      EquipmentCode: this.reactiveForm_.controls.EquipmentCode.value
        ? this.reactiveForm_.controls.EquipmentCode.value
        : '',
      EquipmentTagName: this.reactiveForm_.controls.EquipmentTagName.value
        ? this.reactiveForm_.controls.EquipmentTagName.value
        : '',
      OrganizationId: this.reactiveForm_.controls.OrganizationId.value
        ? this.reactiveForm_.controls.OrganizationId.value
        : null,
      TagId: this.reactiveForm_.controls.TagId.value
        ? this.reactiveForm_.controls.TagId.value
        : null,
    };
    sessionStorage.setItem(
      ESConst.LocalStorage.Key.ElementForm,
      JSON.stringify(elementForm)
    );
    this.toastr.info('Đã sao chép nội dung', '', {
      timeOut: 1500,
      positionClass: 'toast-bottom-right',
    });
  }

  PasteDataModal() {
    var receiveElementItem = sessionStorage.getItem(
      ESConst.LocalStorage.Key.ElementForm
    );
    if (receiveElementItem) {
      let elementItem: ThuocTinhFormModel = JSON.parse(receiveElementItem);
      this.reactiveForm_.patchValue({
        Placeholder: elementItem.Placeholder,
        Rows: elementItem.Rows,
        TagName: elementItem.TagName,
        minValue: elementItem.minValue,
        maxValue: elementItem.maxValue,
        typeInput: elementItem.typeInput,
        EquipmentId: elementItem.EquipmentId,
        EquipmentTagId: elementItem.EquipmentTagId,
        EquipmentName: elementItem.EquipmentName,
        EquipmentCode: elementItem.EquipmentCode,
        EquipmentTagName: elementItem.EquipmentTagName,
        OrganizationId: elementItem.OrganizationId,
        TagId: elementItem.TagId,
      });
      if (elementItem.EquipmentId) {
        let equipmentId = elementItem.EquipmentId.toString();
        this.EquipmentSelected = this.listEquipment.find(
          (x) => x.Id == parseInt(equipmentId)
        );
        if (parseInt(equipmentId) > 0 && equipmentId) {
          setTimeout(() => {
            this.reactiveForm_.controls['Equipment'].setValue(
              parseInt(equipmentId)
            );
            this.lstTag = this.EquipmentSelected.EquipmentTags;
            if (elementItem.EquipmentTagId) {
              let equipmenttagid = elementItem.EquipmentTagId.toString();
              this.selectedTagId = parseInt(equipmenttagid);
            }
          }, 200);
          if (elementItem.OrganizationId) {
            let organizationId = elementItem.OrganizationId.toString();
            this.reactiveForm_.controls['OrganizationId'].setValue(
              parseInt(organizationId)
            );
          }

          if (elementItem.TagId) {
            let TagId = elementItem.TagId.toString();
            this.reactiveForm_.controls['TagId'].setValue(parseInt(TagId));
          }
        }
      }
      this.reactiveForm_.controls.TagName.markAsDirty();
      this.toastr.info('Đã gán nội dung', '', {
        timeOut: 1500,
        positionClass: 'toast-bottom-right',
      });
    } else
      this.toastr.error('Không tìm thấy nội dung', '', {
        timeOut: 1500,
        positionClass: 'toast-bottom-right',
      });
  }

  getLstOrg() {
    // danh sách đơn vị
    let organizationModelFilter: OrganizationModelFilter = {
      IsActive: true,
      Type: this.typeOrg.NhaMay,
    };
    this.organizationService
      .getListItem(organizationModelFilter)
      .subscribe((res: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(res)) {
          this.lstOrg = res.Data;
        } else {
          this.toastr.error(`${res.Message}`, 'Lỗi');
        }
      });
  }

  onChangeSelectOrg(org) {
    this.reactiveForm_.patchValue({
      MinBlocking: null,
      MaxBlocking: null,
      MinWarning: null,
      MaxWarning: null,
      EquipmentId: null,
      EquipmentTagId: null,
      EquipmentName: '',
      EquipmentTagName: '',
      EquipmentCode: '',
    });
    this.lstTag = null;
    this.listEquipment = null;
    let orgId: number = null;
    if (org) orgId = org.Id;
    this.getListEquipment(orgId);
    if (!org) return;
    this.reactiveForm_.patchValue({
      Equipment: null,
    });
  }

  onSelectChangeInputType(event: any) {
    if (event === undefined) return;
    let placeholder: string = '';
    switch (this.reactiveForm_.controls.typeInput.value) {
      case TypeInput.NUMBER:
        placeholder = 'Nhập số';
        break;
      case TypeInput.DATE:
        placeholder = 'dd/mm/yyyy';
        break;
      case TypeInput.TIME_HH_MM:
        placeholder = 'HH:mm';
        break;
      case TypeInput.TIME_HH_MM_SS:
        placeholder = 'HH:mm:ss';
        break;
    }
    this.reactiveForm_.patchValue({
      Placeholder: placeholder,
    });
  }
}
