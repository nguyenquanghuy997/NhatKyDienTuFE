import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DomSanitizer, SafeHtml, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { Editor as EditorClass } from '@ckeditor/ckeditor5-core';
import { Element } from '@ckeditor/ckeditor5-engine';
import * as mammoth from 'mammoth';
import { ToastrService } from 'ngx-toastr';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import { formMauModel } from 'src/app/e-diary/models/form-mau';
import { ThuocTinhFormModel } from 'src/app/e-diary/models/thuoc-tinh-form';
import { FormMauService } from 'src/app/e-diary/services/cau-hinh/form-mau.service';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { ESConst } from 'src/app/e-diary/utils/Const';
import {
  ClassAlignCSSTable,
  ClassCSSTable,
  FunctionCode,
  NgSelectMessage,
  TypeInput,
  cleaveInputClass,
} from 'src/app/e-diary/utils/Enum';
import { Utility } from 'src/app/e-diary/utils/Utility';
import { v4 as uuidv4 } from 'uuid';
import { sliderConfig } from '../../form/form-add-edit/form_config';
import { ModalInputEditCKComponent } from '../modal-ck-input-edit/modal-ck-input-edit.component';
import { ModalCkInputInsertRangeComponent } from '../modal-ck-input-insert-range/modal-ck-input-insert-range.component';
import { ModalTableEditCKComponent } from '../modal-ck-table-edit/modal-ck-table-edit.component';
declare var $: any;

@Component({
  selector: 'app-form-ck-add-edit-form',
  templateUrl: './form-ck-add-edit-form.component.html',
  styleUrls: ['./form-ck-add-edit-form.component.css'],
})
export class FormCkAddEditFormComponent {
  // CK editor
  dataEditor: EditorClass;
  public editor = Editor;

  public onReady(editor): void {
    this.dataEditor = editor;
    const element = editor.ui.getEditableElement()!;
    const parent = element.parentElement!;
    parent.insertBefore(editor.ui.view.toolbar.element!, element);
    editor.editing.view.change((writer) => {
      writer.setStyle(
        'min-height',
        '240px',
        editor.editing.view.document.getRoot()
      );
    });
  }
  //

  breadcrumbTitle: string = '';
  loading = true;
  showTemplateForm = false;
  html: string = '';
  htmlContent: SafeHtml = ``;
  reactiveForm: FormGroup;
  typeInput_: string = '';

  elementInputForm: any;
  elementInputRender: any;

  elementTableForm: any;
  elementTableRender: any;

  //Modal Edit
  identity: string = '';
  isEdit: boolean = true;
  isShow: boolean = false;
  get sanitizedHtml() {
    return this.sanitizer.bypassSecurityTrustHtml(
      this.reactiveForm.get('Context')?.value
    );
  }

  functionCode: FunctionCode;
  selection: any;

  FunctionCode = FunctionCode;
  lstFunctionCode: string[];

  // Slider
  sliderStep = 0;
  sliderConfig = sliderConfig;
  //

  option = {
    editor: '#editor',
    scrollElementTable: '#scrollElementTable',
    scrollElementInput: '#scrollElementInput',
  };

  private formIdToUpdate!: number;
  public isUpdateActive: boolean = false;
  ngSelectMessage = NgSelectMessage;
  selectedFile: File | undefined;

  @ViewChild('fileImport') fileImport!: ElementRef;
  @ViewChild('popupInsert') popupInsert: ModalCkInputInsertRangeComponent;
  @ViewChild('popupEdit') popupEdit: ModalInputEditCKComponent;
  @ViewChild('popupTableEdit') popupTableEdit: ModalTableEditCKComponent;

  constructor(
    private sanitizer: DomSanitizer,
    private api: FormMauService,
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    public toastr: ToastrService,
    private titleService: Title,
    private activatedRoute: ActivatedRoute,
    public router: Router, // private modalService: NzModalService,
    private ref: ChangeDetectorRef
  ) {}

  get f(): { [key: string]: AbstractControl } {
    return this.reactiveForm!.controls;
  }

  ngOnInit() {
    this.breadcrumbTitle = this.activatedRoute.snapshot.data.breadcrumbTitle;
    this.reactiveForm = this.formBuilder.group({
      Context: [null, [Validators.required]],
      Name: [null, [Validators.required, Validators.maxLength(100)]],
      Id: [null],
      IsActive: [true],
      Note: [null, [Validators.maxLength(1000)]],
      Version: 0,
      TypeInputAuto: 1,
    });
    this.activatedRoute.params.subscribe((val) => {
      this.formIdToUpdate = val[ESConst.PatchParams.id];
      let title = 'Thêm mới form cấu hình';
      if (this.formIdToUpdate) {
        title = 'Cập nhật form cấu hình';
        this.sliderStep = 5;
      }
      this.titleService.setTitle(title);
      if (this.formIdToUpdate) {
        this.isUpdateActive = true;
        this.functionCode = FunctionCode.EDIT;
        this.api.getSysFormEditById(this.formIdToUpdate).subscribe({
          next: (result: ResponseModel) => {
            if (this.commonService.checkTypeResponseData(result)) {
              this.fillFormToUpdate(result.Data);
            } else {
              this.toastr.error(`${result.Message}`, 'Lỗi');
            }
            this.lstFunctionCode = result.FunctionCodes;
            this.loading = false;
          },
          error: (error) => {
            this.loading = false;
            if (error.status === HttpStatusCode.MethodNotAllowed)
              this.lstFunctionCode = error.error.FunctionCodes;
          },
        });
      } else {
        this.functionCode = FunctionCode.CREATE;
        this.loading = false;
      }
    });
    localStorage.removeItem('formInput');
  }

  ngAfterViewInit() {
    setTimeout(() => {
      $('#myTab').on('shown.bs.tab', function (event) {
        if (event.target.id === 'preview-tab') {
          $('#myFrame').height($('#myFrame').contents().height());
        }
      });
    }, 200);
  }

  fillFormToUpdate(itemObj: formMauModel) {
    this.reactiveForm.setValue({
      Name: itemObj.Name ?? '',
      Context: itemObj.Context ?? '',
      Id: itemObj.Id,
      Note: itemObj.Note,
      IsActive: itemObj.IsActive,
      Version: itemObj.Version,
      TypeInputAuto: 1,
    });
    this.getElementsFromContext();
  }

  saveSettingForm(value) {
    if (this.reactiveForm?.invalid) {
      this.reactiveForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    if (this.formIdToUpdate > 0 || this.isUpdateActive) {
      this.api.updateSysForm(value).subscribe(
        (result: ResponseModel) => {
          if (this.commonService.checkTypeResponseData(result)) {
            this.loading = false;
            this.toastr.success('Cập nhật thành công!', 'Thành công');
            this.detailForm(this.formIdToUpdate);
          } else {
            this.toastr.error(`${result.Message}`, 'Lỗi');
          }
          this.loading = false;
        },
        (error) => {
          this.loading = false;
        }
      );
    } else {
      this.api.createSysForm(value).subscribe(
        (result: ResponseModel) => {
          this.loading = false;
          if (this.commonService.checkTypeResponseData(result)) {
            this.toastr.success('Thêm mới thành công!', 'Thành công');
            this.detailForm(result.Data.Id);
          } else {
            this.toastr.error(`${result.Message}`, 'Lỗi');
          }
        },
        (error) => {
          this.loading = false;
        }
      );
    }
  }

  detailForm(id: number) {
    this.router.navigate(['configs/form/chi-tiet-form', id]);
  }

  showErrorOnPaste() {
    this.toastr.error('Không có thông số input', 'Lỗi');
  }

  applyBootstrapClasses(html: string): string {
    /*
     1. regular expression /<td([^>]*)>(\s*|\n*)<\/td>/g matches and captures attributes, including rowspan or colspan, for empty <td> elements.
     2. generateUniqueID function generates a random ID for each <input> element to ensure uniqueness.
     3. replace function is used with a callback to handle the replacement. For each matched empty <td>
    , it generates a unique ID and constructs the replacement HTML string, including the <input> element.
    */
    let typeInputAutoGen: number = 0;
    typeInputAutoGen =
      this.reactiveForm.controls.TypeInputAuto.value != null
        ? this.reactiveForm.controls.TypeInputAuto.value
        : 1;
    var modifiedHtmlString = '';
    modifiedHtmlString = html
      .replace(/<table>/g, function () {
        var tableId = generateUniqueIdTable();
        return (
          '<div class="table-responsive"><table id="' +
          tableId +
          '" class="table table-bordered data-table">'
        );
      })
      .replace(/<\/table>/g, '</table></div>')
      .replace(/<tr>/g, '<tr>')
      .replace(/<td([^>]*)>(\s*|\n*)<\/td>/g, function (match, attributes) {
        var inputID = 'input-' + uuidv4();
        var classInputCleave = cleaveInputClass.TEXT;
        if (typeInputAutoGen == 2)
          return (
            '<td' +
            attributes +
            ' ><textarea class="form-control" id="' +
            inputID +
            '" name="textarea-' +
            inputID +
            '"  data-key="' +
            inputID +
            '" data-tag="' +
            inputID +
            '" rows="2"></textarea></td>'
          );
        else if (typeInputAutoGen == 1)
          return (
            '<td' +
            attributes +
            ' ><input type="text" class="form-control ' +
            classInputCleave +
            '" id="' +
            inputID +
            '" name="fieldText-' +
            inputID +
            '"  data-key="' +
            inputID +
            '" data-tag="' +
            inputID +
            '" data-minblock="null" data-maxblock="null" data-minwarn="null" data-maxwarn="null" /></td>'
          );
      });
    return modifiedHtmlString;
  }

  escapeHtml(value) {
    return value
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  convertDocxToHtml(file: File, options: object): Promise<string> {
    const randomNumber = getRandomNumberInRange(64, 2024);
    var arrayBuffer = new ArrayBuffer(randomNumber);
    return new Promise((resolve, reject) => {
      var reader = new FileReader();

      reader.onload = (event) => {
        arrayBuffer = event.target?.result as ArrayBuffer;
        var options_ = {
          styleMap: [
            "p[style-name='Heading 1'] => h1",
            "p[style-name='Heading 2'] => h2",
            // "p[style-name='Table'] => div.custom-table",
            // 'table => table.custom-table',
            // Define more style mappings if needed
          ],
          convertImage: mammoth.images.imgElement((image) => {
            return image.read('base64').then((imageBuffer) => {
              return {
                src: 'data:image/png;base64,' + imageBuffer,
              };
            });
          }),
          includeDefaultStyleMap: false, // This prevents default style mapping
          style: `
            table => table[class='table table-bordered']
            td => td[class='border']
            // Map more elements and Bootstrap classes here
          `,
        };
        mammoth
          .convertToHtml({ arrayBuffer: arrayBuffer }, options_)
          .then((result) => {
            var htmlWithBootstrap = this.applyBootstrapClasses(result.value);
            resolve(htmlWithBootstrap);
            this.fileImport.nativeElement.value = '';
          })
          .catch((error) => {
            reject(error);
          });
      };
      reader.readAsArrayBuffer(file);
    });
  }

  onFileChange(event: any) {
    this.sliderStep = 0;
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.selectedFile = fileList[0];
      const docxFile = fileList[0];
      $('#file-chosen').text(fileList[0].name);

      var options = {
        styleMap: [
          "p[style-name='Section Title'] => h1:fresh",
          "p[style-name='Subsection Title'] => h2:fresh",
          "p[style-name='Heading 1'] => h1",
          "p[style-name='Heading 2'] => h2",
          "p[style-name='Normal'] => p",
          "p[style-name='Quote'] => blockquote",
        ],
      };
      this.convertDocxToHtml(docxFile, options)
        .then((html) => {
          this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(html);
          this.reactiveForm.controls.Context.setValue(html);
          this.sliderStep = 4;
        })
        .catch((error) => {
          console.error('Error converting DOCX to HTML:', error);
        });
    }
  }

  clearAndReSelectFile() {
    if (this.selectedFile) {
      this.fileImport.nativeElement.value = ''; // Clear the input value
      setTimeout(() => {
        this.fileImport.nativeElement.click(); // Trigger the file input click event
      }, 0);
    }
  }
  //Start Xu ly Edit Element
  onChangeSlider() {
    $('.noUi-value').removeClass('active-pip');
    $(`.noUi-value[data-value="${this.sliderStep}"]`).addClass('active-pip');
  }

  getElementsFromContext() {
    setTimeout(() => {
      this.elementInputForm = $(this.option.editor + ' .ck-content :input');
      this.elementInputRender = this.elementInputForm;
      this.elementTableForm = $(this.option.editor + ' .ck-content table');
      this.elementTableRender = this.elementTableForm;

      $(this.option.editor + ' .ck-content .html-object-embed')
        .unbind()
        .on('click', function () {
          let id = $(this).find(':input').attr('id');
          $('#editor .ck-content figure.table.ck-widget').removeClass(
            'ck-widget_selected'
          );
          $('#listElements .element').removeClass('focus');
          $(`#listElements #scrollElementInput [data-element=${id}]`).addClass(
            'focus'
          );
          $('#scrollElementInput').animate(
            {
              scrollTop:
                $('#scrollElementInput').scrollTop() -
                $('#scrollElementInput').offset().top +
                $(`[data-element=${id}]`).offset().top,
            },
            300
          );
        });

      $(this.option.editor + ' .ck-content .table.ck-widget')
        .unbind()
        .on('click', function () {
          let id = $(this).find('table')[0].id;
          $(`#scrollElementTable [data-element=${id}]`).click();
        });
    }, 400);
  }

  focusElement(dataId: string) {
    let typeInputInsert = Utility.getTypeInput(dataId, 'editor');

    if (typeInputInsert !== 'select' && typeInputInsert !== 'checkbox') {
      $(this.option.editor + ' .ck-content')
        .find(`#${dataId}`)
        .focus()
        .click();
    } else {
      $(this.option.editor + ' .ck-content')
        .addClass('ck-focused')
        .removeClass('ck-blurred');
      $(this.option.editor + ' .ck-content .html-object-embed').removeClass(
        'ck-widget_selected'
      );
      $(this.option.editor + ' .ck-content figure.table.ck-widget').removeClass(
        'ck-widget_selected'
      );

      $(this.option.editor + ' .ck-content')
        .find(`#${dataId}`)
        .parent()
        .addClass('ck-widget_selected');

      $(this.option.editor + ' .ck-content')
        .find(`#${dataId}`)
        .focus()
        .click();

      // Add ScrollToElement
      let element = document.querySelector(
        `body ${this.option.editor} #${dataId}`
      );
      let y = element.getBoundingClientRect().top + window.pageYOffset - 200;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  focusTableElement(dataId: string) {
    $(this.option.editor + ' .ck-content')
      .addClass('ck-focused')
      .removeClass('ck-blurred');
    $(this.option.editor + ' .ck-content .html-object-embed').removeClass(
      'ck-widget_selected'
    );
    $(this.option.editor + ' .ck-content figure.table.ck-widget').removeClass(
      'ck-widget_selected'
    );

    $(this.option.editor + ' .ck-content')
      .find(`#${dataId}`)
      .parent()
      .addClass('ck-widget_selected');

    $(this.option.editor + ' .ck-content')
      .find(`#${dataId}`)
      .focus()
      .click();
    $(`${this.option.scrollElementTable} .element`).removeClass('focus');
    $(`${this.option.scrollElementTable} [data-element=${dataId}]`).addClass(
      'focus'
    );
    // Add ScrollToElement
    let element = document.querySelector(
      `body ${this.option.editor} #${dataId}`
    );
    let y = element.getBoundingClientRect().top + window.pageYOffset - 200;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  // process modal
  openModalCreateRange() {
    this.isShow = true;
    this.popupInsert.ShowModal();
  }

  openModalCreate() {
    this.typeInput_ = $('#idInputType').val().toString();
    this.popupEdit.ShowModal();
  }

  openModalEdit(id: string, isEdit: boolean) {
    this.identity = id;
    this.isEdit = isEdit;
    this.popupEdit.ShowModal();
    $('body')
      .off()
      .on('shown.bs.modal', '#modalInputEdit', function () {
        $('input:visible:enabled:first', this).focus();
      });
  }

  openModalTableEdit(id: string) {
    this.identity = id;
    this.popupTableEdit.ShowModal();
  }

  closeModalEdit(isTable: boolean) {
    setTimeout(() => {
      if (this.identity) {
        if (isTable) this.focusTableElement(this.identity);
        else this.focusElement(this.identity);
        this.identity = null;
      } else {
        this.typeInput_ = null;
        this.isShow = false;
      }
    }, 700);
  }

  deleteElement(id: string) {
    this.focusElement(id);
    setTimeout(() => {
      const insertPosition = this.dataEditor.model.document.selection;
      this.dataEditor.model.deleteContent(insertPosition);
      this.submitModel();
    }, 200);
  }

  filterElement() {
    let keyWord = $('#txtSearchInput').val();
    this.elementInputRender = this.elementInputForm.filter(function () {
      return $(this).attr('data-tag').toLowerCase().indexOf(keyWord) > -1;
    });
  }

  filterTableElement() {
    let keyWord = $('#txtSearchTable').val();
    this.elementTableRender = this.elementTableForm.filter(function () {
      return $(this).attr('data-tag').toLowerCase().indexOf(keyWord) > -1;
    });
  }

  submitModel() {
    this.sliderStep = 5;
  }

  coppyDataElement(id: string) {
    let ele = $(this.option.editor + ' #' + id);
    let typeInputInsert = Utility.getTypeInput(id, 'editor');
    let elementForm: ThuocTinhFormModel = {
      Width: ele[0].style.width ? parseInt(ele[0].style.width) : null,
      Placeholder: ele.attr('placeholder'),
      Rows: parseInt(ele.attr('rows')),
      TagName: ele.attr('data-tag') ? ele.attr('data-tag') : '',
      DonViTinh: ele[0].style.width.replace(/\d+/g, ''),
      typeInput: typeInputInsert,
      EquipmentId: ele.attr('data-equipmentid')
        ? ele.attr('data-equipmentid')
        : null,
      EquipmentTagId: ele.attr('data-equipmenttagid')
        ? ele.attr('data-equipmenttagid')
        : null,
      EquipmentName: ele.attr('data-equipmentname')
        ? ele.attr('data-equipmentname')
        : '',
      EquipmentTagName: ele.attr('data-equipmenttagname')
        ? ele.attr('data-equipmenttagname')
        : '',
      OrganizationId: ele.attr('data-organizationid')
        ? ele.attr('data-organizationid')
        : null,
      TagId: ele.attr('data-tagid') ? ele.attr('data-tagid') : null,
    };

    if (typeInputInsert === 'number') {
      elementForm.maxValue = ele.attr('max') ? parseInt(ele.attr('max')) : null;
      elementForm.minValue = ele.attr('min') ? parseInt(ele.attr('min')) : null;
    } else if (typeInputInsert === 'select') {
      elementForm.Values = Utility.getValueOptionSelect(id, 'editor') as [];
    } else {
      elementForm.maxValue = ele.attr('maxlength')
        ? parseInt(ele.attr('maxlength'))
        : null;
      elementForm.minValue = ele.attr('minlength')
        ? parseInt(ele.attr('minlength'))
        : null;
    }
    sessionStorage.setItem(
      ESConst.LocalStorage.Key.ElementForm,
      JSON.stringify(elementForm)
    );
    this.toastr.info('Đã sao chép nội dung', '', {
      timeOut: 1500,
      positionClass: 'toast-bottom-right',
    });
  }

  coppyDataTable(id: string) {
    let ele = $(this.option.editor + ' .ck-content #' + id);
    let arrayClass = ele.attr('class').split(' ');
    let elementForm = {
      Type: '',
      Align: '',
    };
    arrayClass.forEach((item) => {
      if (Object.values(ClassCSSTable).includes(item as ClassCSSTable))
        elementForm.Type = item;

      if (
        Object.values(ClassAlignCSSTable).includes(item as ClassAlignCSSTable)
      )
        elementForm.Align = item;
    });
    sessionStorage.setItem(
      ESConst.LocalStorage.Key.TableForm,
      JSON.stringify(elementForm)
    );
    this.toastr.info('Đã sao chép nội dung', '', {
      timeOut: 1500,
      positionClass: 'toast-bottom-right',
    });
  }

  pasteDataElement(id: string) {
    this.focusElement(id);
    setTimeout(() => {
      var receiveElementItem = sessionStorage.getItem(
        ESConst.LocalStorage.Key.ElementForm
      );
      if (receiveElementItem) {
        let elementItem: ThuocTinhFormModel = JSON.parse(receiveElementItem);
        let htmlToInsert = '';
        switch (elementItem.typeInput) {
          case TypeInput.TEXT:
            htmlToInsert = `<input class="form-control ${cleaveInputClass.TEXT}"
        id="${id}" name="${id}" data-key="${id}" data-tag="${elementItem.TagName}"`;
            if (elementItem.minValue > 0) {
              htmlToInsert += ` minlength="${elementItem.minValue}"`;
            }
            if (elementItem.maxValue > 0) {
              htmlToInsert += ` maxlength="${elementItem.maxValue}"`;
            }
            htmlToInsert += `style="min-width: 100px; width:100%"`;
            break;
          case TypeInput.TEXTAREA:
            htmlToInsert = `<textarea class="form-control"
      id="${id}" name="${id}" data-key="${id}" data-tag="${elementItem.TagName}"`;
            if (elementItem.minValue > 0) {
              htmlToInsert += ` minlength="${elementItem.minValue}"`;
            }
            if (elementItem.maxValue > 0) {
              htmlToInsert += ` maxlength="${elementItem.maxValue}"`;
            }
            htmlToInsert += ` style="min-width: 100px; width:100%"`;
            if (elementItem.Rows > 0) {
              htmlToInsert += ` rows="${elementItem.Rows}"`;
            }
            break;
          case TypeInput.DATE:
            htmlToInsert = `<input class="form-control ${cleaveInputClass.DATE}" id="${id}" name="${id}"`;
            htmlToInsert += ` data-key="${id}" data-tag="${elementItem.TagName}"`;
            htmlToInsert += ` style="min-width: 100px; width:100%"`;
            break;
          case TypeInput.TIME_HH_MM:
            htmlToInsert = `<input class="form-control ${cleaveInputClass.TIME_HH_MM}" id="${id}" name="${id}"`;
            htmlToInsert += ` data-key="${id}" data-tag="${elementItem.TagName}" `;
            htmlToInsert += ` style="min-width: 100px; width:100%"`;
            break;
          case TypeInput.TIME_HH_MM_SS:
            htmlToInsert = `<input class="form-control ${cleaveInputClass.TIME_HH_MM_SS}" id="${id}" name="${id}"`;
            htmlToInsert += ` data-key="${id}" data-tag="${elementItem.TagName}" `;
            htmlToInsert += ` style="min-width: 100px; width:100%"`;
            break;
          case TypeInput.DATEPICKER:
            htmlToInsert = `<input class="form-control ${cleaveInputClass.DATEPICKER}" id="${id}" name="${id}"`;
            htmlToInsert += ` data-key="${id}" data-tag="${elementItem.TagName}" `;
            htmlToInsert += ` style="min-width: 100px; width:100%"`;
            break;
          case TypeInput.NUMBER:
            htmlToInsert = `<input class="form-control ${cleaveInputClass.NUMBER}"  name="${id}" id="${id}"`;
            htmlToInsert += ` data-key="${id}" data-tag="${elementItem.TagName}" `;
            htmlToInsert += ` min="${elementItem.minValue}" `;
            htmlToInsert += ` max="${elementItem.maxValue}" `;
            htmlToInsert += ` style="min-width: 100px; width:100%"`;
            htmlToInsert += ` data-minblock="${elementItem.MinBlocking}"  data-maxblock="${elementItem.MaxBlocking}"`;
            htmlToInsert += ` data-minwarn="${elementItem.MinWarning}"  data-maxwarn="${elementItem.MaxWarning}"`;
            break;
          case TypeInput.SELECT:
            htmlToInsert = `<select class="form-control"  name="${id}" id="${id}" data-key="${id}" data-tag="${elementItem.TagName}" style="min-width: 100px; width:100%"`;
            break;
          case TypeInput.CHECKBOX:
            htmlToInsert = `<div><input type="checkbox" name="${id}" id="${id}" data-key="${id}" data-tag="${elementItem.TagName}" style="min-width: 100px; width:100%"`;
            break;
        }
        if (elementItem.EquipmentId > 0) {
          htmlToInsert += ` data-equipmentid="${elementItem.EquipmentId}"  data-equipmenttagid="${elementItem.EquipmentTagId}"`;
          htmlToInsert += ` data-equipmentname="${elementItem.EquipmentName}"  data-equipmenttagname="${elementItem.EquipmentTagName}"`;
          htmlToInsert += ` data-equipmentcode="${elementItem.EquipmentCode}"`;
        }
        if (elementItem.TagId > 0) {
          htmlToInsert += ` data-tagid="${elementItem.TagId}"`;
        }
        if (elementItem.OrganizationId > 0) {
          htmlToInsert += ` data-organizationid="${elementItem.OrganizationId}"`;
        }

        if (elementItem.Values && elementItem.Values.length > 0) {
          let values = elementItem.Values as [];
          htmlToInsert += '>';
          htmlToInsert += `<option value="" hidden></option>`;
          values.forEach((ele: any) => {
            htmlToInsert += `<option value="${ele.label ? ele.label : ele}">${
              ele.label ? ele.label : ele
            }</option>`;
          });
        }

        htmlToInsert += `placeholder="${elementItem.Placeholder ?? ''}"`;
        htmlToInsert +=
          elementItem.typeInput == TypeInput.TEXTAREA
            ? '></textarea>'
            : elementItem.typeInput == TypeInput.SELECT
            ? `</select>`
            : elementItem.typeInput == TypeInput.CHECKBOX
            ? `/></div>`
            : `/>`;

        let element = this.dataEditor.data.htmlProcessor.toView(htmlToInsert);
        let modelEle = this.dataEditor.data.toModel(element);

        const insertPosition = this.dataEditor.model.document.selection;
        this.dataEditor.model.deleteContent(insertPosition);
        this.dataEditor.model.insertContent(modelEle, insertPosition);
        this.toastr.info('Đã gán nội dung', '', {
          timeOut: 1500,
          positionClass: 'toast-bottom-right',
        });
        $('#btnFormatContent').click();
      } else
        this.toastr.error('Không tìm thấy nội dung', '', {
          timeOut: 1500,
          positionClass: 'toast-bottom-right',
        });
    }, 200);
  }
  //End Xu ly Edit Element
}

// Function to generate unique IDs
function generateUniqueIdTable() {
  return 'table-' + Math.random().toString(36).substr(2, 5);
}
function getRandomNumberInRange(min: number, max: number): number {
  // Sinh số ngẫu nhiên từ 0 đến 1
  const random = Math.random();

  // Chuyển đổi số ngẫu nhiên thành phạm vi mong muốn từ min đến max
  const range = max - min + 1;
  const scaled = random * range;
  const result = Math.floor(scaled) + min;

  return result;
}
