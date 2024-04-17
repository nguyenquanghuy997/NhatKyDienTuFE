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
  UntypedFormBuilder,
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
import {
  NgSelectMessage,
  ResponseTypeES,
  TypeInput,
  TypeOrg,
  cleaveInputClass,
} from 'src/app/e-diary/utils/Enum';
import { Utility } from 'src/app/e-diary/utils/Utility';
import { v4 as uuidv4 } from 'uuid';

declare var $: any;
@Component({
  selector: 'app-modal-input',
  templateUrl: './modal-input.component.html',
})
export class ModalInputComponent {
  @Input() model: ThuocTinhFormModel = {
    Value: 0,
    Placeholder: '',
    Format: '',
    Rows: null,
    TagName: '',
    Tooltip: '',
    minValue: null,
    maxValue: null,
    typeInput: '',
    MinBlocking: null,
    MaxBlocking: null,
    MinWarning: null,
    MaxWarning: null,
    EquipmentName: '',
    EquipmentTagName: '',
    EquipmentCode: '',
    OrganizationId: null,
  };
  @Output() onSubmitModal = new EventEmitter();
  @Output() onHideModal = new EventEmitter();
  @Input() isVisible = true;
  @Input() typeInputInsert = '';

  reactiveForm_!: FormGroup;
  submitted = false;
  thuocTinhInput!: ThuocTinhFormModel;

  listEquipment: EquipmentModel[] = [];
  selectedValue: any;
  lstTag: any[] = [];
  ngSelectMessage = NgSelectMessage;
  typeOrg = TypeOrg;
  lstOrg: OrganizationModel[] = [];
  constructor(
    private fb: UntypedFormBuilder,
    private formBuilder_: FormBuilder,
    private thietBiService: EquipmentService,
    private toastr: ToastrService,
    private organizationService: OrganizationService,
    private commonService: CommonService
  ) {
    this.thuocTinhInput = {} as ThuocTinhFormModel;
    this.initForm();
  }
  initForm() {
    this.reactiveForm_ = this.formBuilder_.group({
      TagName: [
        this.thuocTinhInput.TagName,
        [Validators.required, Validators.maxLength(100)],
      ],
      Value: 0,
      Placeholder: '',
      Format: '',
      Rows: null,
      Tooltip: '',
      minValue: [this.thuocTinhInput.minValue],
      maxValue: [this.thuocTinhInput.maxValue],
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

  ngOnInit() {
    this.initPopup();
  }
  initPopup() {
    this.onReset();
    this.lstTag = [];
    this.getListEquipment(null);

    this.getLstOrg();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.reactiveForm_!.controls;
  }

  addTextToElement(model: ThuocTinhFormModel) {
    let a = Utility.getLocalStorageWithExpiry('selectedText');
    findRangeInsert(JSON.parse(a), model);
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.reactiveForm_?.invalid) {
      return;
    }
    this.submitModal();
    this.addTextToElement(this.reactiveForm_?.value);
    this.hideModal();
  }

  onReset(): void {
    this.submitted = false;
    this.reactiveForm_?.reset();
  }
  ngOnDestroy() {
    console.log('Destroy AccountModal');
  }

  hideModal() {
    this.reactiveForm_.reset();
    ($('#modalInput') as any).modal('hide');
    this.onHideModal.emit();
    this.onReset();
  }

  submitModal() {
    this.isVisible = false;
    this.onSubmitModal.emit(this.model);
  }
  // copy form data save to localStorage
  copyFormDataToLocalStorage() {
    this.submitted = true;
    if (this.reactiveForm_?.invalid) {
      return;
    }
    this.submitModal();

    var jsonStr = JSON.stringify(this.reactiveForm_?.value);
    Utility.setLocalStorageWithExpiry('formInput', jsonStr);
  }

  getListEquipment(OrganizationId?: number): void {
    let equipmentFilter: EquipmentModelFilter = {
      IsActive: true,
      OrganizationId: OrganizationId,
    };
    this.thietBiService
      .getListEquipmentWithTag(equipmentFilter)
      .subscribe((result: ResponseModel) => {
        if (result.Type == ResponseTypeES.Success) {
          this.listEquipment = result.Data;
        } else if (result.Type == ResponseTypeES.Warning) {
          this.toastr.warning(`${result.Message}`, 'Cảnh báo');
        } else {
          this.toastr.error(`${result.Message}`, 'Load danh sách thiết bị lỗi');
        }
      });
  }

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
      TagName: '',
      EquipmentTagName: '',
      EquipmentCode: '',
      TagId: null,
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
      TagId: null,
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
}
function findEle(tagCode, innerHTML) {
  let list = document.getElementsByTagName(tagCode);
  for (let i = 0; i < list.length; i++) {
    if (list[i].innerHTML == innerHTML) {
      return list[i];
    }
  }
}

function insertHtmlToCurrentCursor(
  startNode,
  startIsText,
  startOffset,
  endNode,
  endIsText,
  endOffset,
  sP,
  eP,
  model
) {
  var s, e;
  if (startIsText) {
    let childs = sP.childNodes;
    for (let i = 0; i < childs.length; i++) {
      if (childs[i].nodeType == 3 && childs[i].nodeValue == startNode)
        s = childs[i];
    }
  } else {
    s = startNode;
  }
  if (endIsText) {
    let childs = eP.childNodes;
    for (let i = 0; i < childs.length; i++) {
      if (childs[i].nodeType == 3 && childs[i].nodeValue == endNode)
        e = childs[i];
    }
  } else {
    e = endNode;
  }
  let range = document.createRange();
  range.setStart(s, startOffset);
  range.setEnd(e, endOffset);

  let sel = window.getSelection();
  let typeInput = Utility.getLocalStorageWithExpiry('typeInput');
  let uuid = uuidv4();
  let htmlToInsert = '';
  let placeholder: string = '';
  placeholder = model.Placeholder =
    '' && model.Placeholder != null ? model.Placeholder : '';
  switch (typeInput.toString().trim()) {
    case TypeInput.TEXT:
      htmlToInsert = `<input class="form-control ${cleaveInputClass.TEXT}"
      id="input-${uuid}" name="fieldText-${uuid}" data-key="input-${uuid}" data-tag="${model.TagName}"`;
      if (model.minValue > 0) {
        htmlToInsert += ` minlength="${model.minValue}"`;
      }
      if (model.maxValue > 0) {
        htmlToInsert += ` maxlength="${model.maxValue}"`;
      }
      htmlToInsert += `style="min-width: 100px; width:100%"`;
      break;
    case TypeInput.TEXTAREA:
      htmlToInsert = `<textarea class="form-control"
    id="input-${uuid}" name="textarea-${uuid}" data-key="input-${uuid}" data-tag="${model.TagName}"`;
      if (model.minValue > 0) {
        htmlToInsert += ` minlength="${model.minValue}"`;
      }
      if (model.maxValue > 0) {
        htmlToInsert += ` maxlength="${model.maxValue}"`;
      }

      htmlToInsert += ` style="min-width: 100px; width:100%"`;
      if (model.Rows > 0) {
        htmlToInsert += ` rows="${model.Rows}"`;
      }
      break;
    case TypeInput.DATE:
      placeholder = model.Placeholder = '' ? model.Placeholder : 'dd/mm/yyyy';
      htmlToInsert = `<input class="form-control ${cleaveInputClass.DATE}" id="input-${uuid}" name="dateTime-${uuid}"`;
      htmlToInsert += ` data-key="input-${uuid}" data-tag="${model.TagName}"  id="input-${uuid}"`;
      htmlToInsert += ` style="min-width: 100px; width:100%"`;
      break;
    case TypeInput.TIME_HH_MM:
      placeholder = model.Placeholder = '' ? model.Placeholder : 'HH:mm';
      htmlToInsert = `<input class="form-control ${cleaveInputClass.TIME_HH_MM}" id="input-${uuid}" name="dateTime-${uuid}"`;
      htmlToInsert += ` data-key="input-${uuid}" data-tag="${model.TagName}" `;
      htmlToInsert += ` style="min-width: 100px; width:100%"`;
      break;
    case TypeInput.TIME_HH_MM_SS:
      placeholder = model.Placeholder = '' ? model.Placeholder : 'HH:mm:ss';
      htmlToInsert = `<input class="form-control ${cleaveInputClass.TIME_HH_MM_SS}" id="input-${uuid}" name="dateTime-${uuid}"`;
      htmlToInsert += ` data-key="input-${uuid}" data-tag="${model.TagName}" `;
      htmlToInsert += ` style="min-width: 100px; width:100%"`;
      break;
    case TypeInput.NUMBER:
      placeholder = model.Placeholder = '' ? model.Placeholder : 'Nhập số';
      htmlToInsert = `<input class="form-control ${cleaveInputClass.NUMBER}"  name="numberInput-${uuid}" id="input-${uuid}"`;
      htmlToInsert += ` data-key="input-${uuid}" data-tag="${model.TagName}" `;

      htmlToInsert += ` min="${model.minValue}" `;

      htmlToInsert += ` max="${model.maxValue}" `;
      htmlToInsert += ` style="min-width: 100px; width:100%"`;
      htmlToInsert += ` data-minblock="${model.MinBlocking}"  data-maxblock="${model.MaxBlocking}"`;
      htmlToInsert += ` data-minwarn="${model.MinWarning}"  data-maxwarn="${model.MaxWarning}"`;
  }
  if (model.EquipmentId > 0) {
    htmlToInsert += ` data-equipmentid="${model.EquipmentId}"  data-equipmenttagid="${model.EquipmentTagId}"`;
    htmlToInsert += ` data-equipmentname="${model.EquipmentName}"  data-equipmenttagname="${model.EquipmentTagName}"`;
    htmlToInsert += ` data-equipmentcode="${model.EquipmentCode}"`;
  }
  if (model.TagId > 0) {
    htmlToInsert += ` data-tagid="${model.TagId}"`;
  }
  if (model.OrganizationId > 0) {
    htmlToInsert += ` data-organizationid="${model.OrganizationId}"`;
  }
  htmlToInsert += `placeholder="${placeholder}"`;
  htmlToInsert += `/>`;
  range.deleteContents();
  const newElem = document.createElement('p');
  newElem.innerHTML = htmlToInsert;
  range.insertNode(newElem);
  range.setStartBefore(newElem);
  range.collapse(true);
  //reset and close modal form
  $('#btnFormatContent').click();
  $('#closeModalButton').click();
}

function findRangeInsert(obj, model) {
  let sP = findEle(obj.startTagName, obj.startHTML);
  let eP = findEle(obj.endTagName, obj.endHTML);
  insertHtmlToCurrentCursor(
    obj.startNode,
    obj.startIsText,
    obj.startOffset,
    obj.endNode,
    obj.endIsText,
    obj.endOffset,
    sP,
    eP,
    model
  );
}
