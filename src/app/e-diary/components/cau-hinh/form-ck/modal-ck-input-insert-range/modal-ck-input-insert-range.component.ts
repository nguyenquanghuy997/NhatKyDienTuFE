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
  FormGroup,
  Validators,
} from '@angular/forms';
import { Editor } from '@ckeditor/ckeditor5-core';
import TableSelection from '@ckeditor/ckeditor5-table/src/tableselection';
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
  TypeInputDescription,
  TypeOrg,
  cleaveInputClass,
} from 'src/app/e-diary/utils/Enum';
import { Utility } from 'src/app/e-diary/utils/Utility';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-modal-ck-input-insert-range',
  templateUrl: './modal-ck-input-insert-range.component.html',
  styleUrls: ['./modal-ck-input-insert-range.component.css'],
})
export class ModalCkInputInsertRangeComponent implements OnInit {
  @Input() isShow: boolean;
  @Output() onHideModal = new EventEmitter();
  typeInputInsert: string = '';
  reactiveForm_!: FormGroup;
  listEquipment: EquipmentModel[] = [];
  typeInputArr: any[] = ESConst.TypeInputArray;
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
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.isShow?.currentValue) {
      let uuid = uuidv4();
      this.reactiveForm_.patchValue({
        typeInput: TypeInput.TEXT,
        TagName: 'input-' + uuid,
        Placeholder: TypeInputDescription[TypeInput.TEXT],
      });
      this.typeInputInsert = TypeInput.TEXT;
      this.getResource();
    }
  }

  ngOnInit() {
    this.resetForm();
  }

  resetForm() {
    this.reactiveForm_ = this.formBuilder_.group({
      chisoThietBi: 0,
      TagName: [null, [Validators.required, Validators.maxLength(100)]],
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
      EquipmentCode: '',
      OrganizationId: null,
      Values: null,
      TagId: null,
      Id: null,
    });
  }

  getResource() {
    this.hasElementCoppy = sessionStorage.getItem(
      ESConst.LocalStorage.Key.ElementForm
    )
      ? true
      : false;
    this.getLstOrg();
    this.getListEquipment();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.reactiveForm_!.controls;
  }

  HideModal() {
    ($('#modalInputInsert') as any).modal('hide');
    this.onHideModal.emit(false);
  }

  ShowModal() {
    ($('#modalInputInsert') as any).modal('show');
    this.resetForm();
    this.reactiveForm_.reset();
  }

  onHide() {
    this.HideModal();
  }

  onSubmitAdd() {
    const editor = (window as any).editor as Editor;
    let htmlToInsert = '';
    switch (this.f.typeInput.value) {
      case TypeInput.TEXT:
        htmlToInsert = `<input class="form-control ${cleaveInputClass.TEXT}"
       data-tag="${this.f.TagName.value}"`;
        if (this.f.minValue.value > 0) {
          htmlToInsert += ` minlength="${this.f.minValue.value}"`;
        }
        if (this.f.maxValue.value > 0) {
          htmlToInsert += ` maxlength="${this.f.maxValue.value}"`;
        }
        htmlToInsert += `style="min-width: 100px; width:100%"`;
        break;
      case TypeInput.TEXTAREA:
        htmlToInsert = `<textarea class="form-control"
     data-tag="${this.f.TagName.value}"`;
        if (this.f.minValue.value > 0) {
          htmlToInsert += ` minlength="${this.f.minValue.value}"`;
        }
        if (this.f.maxValue.value > 0) {
          htmlToInsert += ` maxlength="${this.f.maxValue.value}"`;
        }
        htmlToInsert += ` style="min-width: 100px; width:100%"`;
        if (this.f.Rows.value > 0) {
          htmlToInsert += ` rows="${this.f.Rows.value}"`;
        }
        break;
      case TypeInput.DATE:
        htmlToInsert = `<input class="form-control ${cleaveInputClass.DATE}"`;
        htmlToInsert += ` data-tag="${this.f.TagName.value}"`;
        htmlToInsert += ` style="min-width: 100px; width:100%"`;
        break;
      case TypeInput.TIME_HH_MM:
        htmlToInsert = `<input class="form-control ${cleaveInputClass.TIME_HH_MM}"`;
        htmlToInsert += ` data-tag="${this.f.TagName.value}" `;
        htmlToInsert += ` style="min-width: 100px; width:100%"`;
        break;
      case TypeInput.TIME_HH_MM_SS:
        htmlToInsert = `<input class="form-control ${cleaveInputClass.TIME_HH_MM_SS}"`;
        htmlToInsert += ` data-tag="${this.f.TagName.value}" `;
        htmlToInsert += ` style="min-width: 100px; width:100%"`;
        break;
      case TypeInput.NUMBER:
        htmlToInsert = `<input class="form-control ${cleaveInputClass.NUMBER}"`;
        htmlToInsert += ` data-tag="${this.f.TagName.value}" `;
        htmlToInsert += ` min="${this.f.minValue.value}" `;
        htmlToInsert += ` max="${this.f.maxValue.value}" `;
        htmlToInsert += ` style="min-width: 100px; width:100%"`;
        htmlToInsert += ` data-minblock="${this.f.MinBlocking.value}"  data-maxblock="${this.f.MaxBlocking.value}"`;
        htmlToInsert += ` data-minwarn="${this.f.MinWarning.value}"  data-maxwarn="${this.f.MaxWarning.value}"`;
        break;
      case TypeInput.SELECT:
        htmlToInsert = `<select class="form-control" data-tag="${this.f.TagName.value}"`;
        break;
      case TypeInput.CHECKBOX:
        htmlToInsert = `<div><input type="checkbox" class="" data-tag="${this.f.TagName.value}"`;
        break;
    }
    if (this.f.EquipmentId.value > 0) {
      htmlToInsert += ` data-equipmentid="${this.f.EquipmentId.value}"  data-equipmenttagid="${this.f.EquipmentTagId.value}"`;
      htmlToInsert += ` data-equipmentname="${this.f.EquipmentName.value}"  data-equipmenttagname="${this.f.EquipmentTagName.value}"`;
      htmlToInsert += ` data-equipmentcode="${this.f.EquipmentCode.value}"`;
    }
    if (this.f.TagId.value > 0) {
      htmlToInsert += ` data-tagid="${this.f.TagId.value}"`;
    }
    if (this.f.OrganizationId.value > 0) {
      htmlToInsert += ` data-organizationid="${this.f.OrganizationId.value}"`;
    }
    htmlToInsert += `placeholder="${this.f.Placeholder.value ?? ''}"`;
    if (this.f.Values.value && this.f.Values.value.length > 0) {
      let values = this.f.Values.value as [];
      htmlToInsert += '>';
      htmlToInsert += `<option value="" hidden></option>`;
      values.forEach((ele: any) => {
        htmlToInsert += `<option value="${ele.label ? ele.label : ele}">${
          ele.label ? ele.label : ele
        }</option>`;
      });
    }

    htmlToInsert +=
      this.f.typeInput.value == TypeInput.TEXTAREA
        ? '></textarea>'
        : this.f.typeInput.value == TypeInput.SELECT
        ? `</select>`
        : this.f.typeInput.value == TypeInput.CHECKBOX
        ? `/></div>`
        : `/>`;

    this.onHide();
    const tableSelection = editor.plugins.get(
      'TableSelection'
    ) as TableSelection;
    const selected = tableSelection.getSelectedTableCells();
    if (selected) {
      selected.forEach((element) => {
        let uid = uuidv4();
        let indexInsert = htmlToInsert.indexOf('class="');

        let content =
          htmlToInsert.slice(0, indexInsert) +
          `id="input-${uid}" name="input-${uid}" data-key="input-${uid}"` +
          htmlToInsert.slice(indexInsert);

        let contentHtml = editor.data.htmlProcessor.toView(content);
        let modelEle = editor.data.toModel(contentHtml);
        editor.model.insertContent(modelEle, element);
      });
    } else {
      let indexInsert = htmlToInsert.indexOf('class="');

      let content =
        htmlToInsert.slice(0, indexInsert) +
        `id="${this.f.TagName.value}" name="${this.f.TagName.value}" data-key="${this.f.TagName.value}"` +
        htmlToInsert.slice(indexInsert);

      let contentHtml = editor.data.htmlProcessor.toView(content);
      let modelEle = editor.data.toModel(contentHtml);
      const insertPosition = editor.model.document.selection;
      editor.model.deleteContent(insertPosition);
      editor.model.insertContent(modelEle, insertPosition);
    }
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
        } else if (result.Type == ResponseTypeES.Warning) {
          this.toastr.warning(`${result.Message}`, 'Cảnh báo');
        } else {
          this.toastr.error(`${result.Message}`, 'Load danh sách thiết bị lỗi');
        }
      }
    );
  }

  // xử lý chọn thiết bị,chỉ số
  onSelectChangeEquipement(event: any) {
    if (event === undefined) return;
    this.clearAttributeEquipmentTag();
    this.lstTag = event.EquipmentTags;
    this.reactiveForm_.patchValue({
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

  onChangeTypeInput(event) {
    this.reactiveForm_.controls.Placeholder.setValue(
      TypeInputDescription[event]
    );
    if (event == TypeInput.TEXTAREA)
      this.reactiveForm_.controls.Rows.setValue(1);
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
      EquipmentTagId: tagItem.Id,
      EquipmentName: tagItem.EquipmentName,
      EquipmentTagName: tagItem.TagName,
      EquipmentCode: tagItem.EquipmentCode,
      TagName: tagItem.EquipmentTagCode,
      TagId: tagItem.TagId,
    });
  }

  clearAttributeEquipmentTag() {
    this.reactiveForm_.patchValue({
      MinBlocking: null,
      MaxBlocking: null,
      MinWarning: null,
      MaxWarning: null,
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
      EquipmentId: this.reactiveForm_.controls.EquipmentId.value
        ? this.reactiveForm_.controls.EquipmentId.value
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
      Values: this.reactiveForm_.controls.Values.value
        ? Utility.renderValueOptionSelect(
            this.reactiveForm_.controls.Values.value
          )
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
        EquipmentId: +elementItem.EquipmentId,
        EquipmentTagId: +elementItem.EquipmentTagId,
        EquipmentName: elementItem.EquipmentName,
        EquipmentCode: elementItem.EquipmentCode,
        EquipmentTagName: elementItem.EquipmentTagName,
        OrganizationId: +elementItem.OrganizationId,
        TagId: +elementItem.TagId,
        Values: elementItem.Values,
      });
      if (elementItem.EquipmentId) {
        let equipmentId = elementItem.EquipmentId.toString();
        this.lstTag = this.listEquipment.find(
          (x) => x.Id == parseInt(equipmentId)
        ).EquipmentTags;
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
  }
}
