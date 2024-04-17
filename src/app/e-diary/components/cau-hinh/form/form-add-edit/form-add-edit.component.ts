import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  TemplateRef,
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
import { ModalInputComponent } from '../modal-input/modal-input.component';
import * as mammoth from 'mammoth';
import { Configs, sliderConfig } from './form_config';
import { v4 as uuidv4 } from 'uuid';
declare var $: any;
@Component({
  selector: 'app-form-add-edit',
  templateUrl: './form-add-edit.component.html',
  styleUrls: ['./form-add-edit.component.css'],
})
export class FormAddEditComponent {
  breadcrumbTitle: string = '';
  loading = true;
  showTemplateForm = false;
  html: string = '';
  htmlContent: SafeHtml = ``;
  reactiveForm: FormGroup;
  config = Configs;
  typeInput_: string = '';
  editorDisabled = false;

  elementInputForm: any;
  elementInputRender: any;

  elementTableForm: any;
  elementTableRender: any;

  //Modal Edit
  showModalEdit: boolean = false;
  identity: string = '';
  isEdit: boolean = true;
  showModalTableEdit: boolean = false;
  iframeHeight: number = 500;
  get sanitizedHtml() {
    return this.sanitizer.bypassSecurityTrustHtml(
      this.reactiveForm.get('Context')?.value
    );
  }

  @Input() model: formMauModel = {
    Id: 0,
    Name: '',
    Note: '',
    Context: '',
    IsActive: true,
    IsDeleted: false,
    CreatedUserId: 0,
    CreatedDTG: new Date(),
    UpdatedUserId: 0,
    UpdatedDTG: new Date(),
    Version: 0,
  };
  @Input() functionCode: FunctionCode;
  form_mau!: formMauModel;
  selection: any;

  FunctionCode = FunctionCode;
  lstFunctionCode: string[];

  // Slider
  sliderStep = 0;
  sliderConfig = sliderConfig;
  //
  option = {
    htmlForm: '#htmlForm',
    scrollElementTable: '#scrollElementTable',
    scrollElementInput: '#scrollElementInput',
  };

  private formIdToUpdate!: number;
  public isUpdateActive: boolean = false;
  ngSelectMessage = NgSelectMessage;
  @ViewChild('popup') popup: ModalInputComponent;
  @ViewChild('fileImport') fileImport!: ElementRef;
  selectedFile: File | undefined;

  get f(): { [key: string]: AbstractControl } {
    return this.reactiveForm!.controls;
  }
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
  ) {
    this.form_mau = {} as formMauModel;
  }

  ngOnInit() {
    this.breadcrumbTitle = this.activatedRoute.snapshot.data.breadcrumbTitle;
    this.reactiveForm = this.formBuilder.group({
      Context: [this.form_mau.Context, [Validators.required]],
      Name: [
        this.form_mau.Name,
        [Validators.required, Validators.maxLength(100)],
      ],
      Id: [this.form_mau.Id],
      IsActive: [this.form_mau.IsActive],
      Note: [this.form_mau.Note, [Validators.maxLength(1000)]],
      Version: 0,
      TypeInputAuto: null,
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
        this.api.getSysFormEditById(this.formIdToUpdate).subscribe({
          next: (result: ResponseModel) => {
            if (this.commonService.checkTypeResponseData(result)) {
              this.functionCode = FunctionCode.EDIT;
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
    let variable = this;
    setTimeout(() => {
      $('#myTab').on('shown.bs.tab', function (event) {
        if (event.target.id === 'setting-tab') {
          if (variable.sliderStep < 4) variable.sliderStep = 4;
          variable.ref.detectChanges();
        } else if (event.target.id === 'preview-tab') {
          $('#myFrame').height($('#myFrame').contents().height());
        }
      });
    }, 200);
  }

  deleteText() {
    var selection = document.getSelection();
    var cursorPos = selection.anchorOffset;
    var oldContent = selection.anchorNode.nodeValue;
    var toInsert = 'InsertMe!';
    var newContent =
      oldContent.substring(0, cursorPos) +
      toInsert +
      oldContent.substring(cursorPos);
    selection.anchorNode.nodeValue = newContent;
  }
  addText(value: any) {
    // const editableDiv = document.querySelector('.note-editable');
    const sel = window.getSelection();
    Utility.setLocalStorageWithExpiry('myKey', sel.toString());
    const range = sel.getRangeAt(0);
    const startPos = range.startOffset;
    var htmlToInsert =
      '<input type="text" class="form-control" style="min-width: 100px;" id="fieldText' +
      value.value.userData.username +
      '" name="fieldText" />';

    range.deleteContents();
    const newElem = document.createElement('');
    newElem.innerHTML = htmlToInsert;
    range.insertNode(newElem);
    range.setStartAfter(newElem);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  fillFormToUpdate(itemObj: formMauModel) {
    this.model.Name = itemObj.Name;
    this.model.Note = itemObj.Note;
    this.model.Context = itemObj.Context;
    this.model.Id = itemObj.Id;
    this.model.IsActive = itemObj.IsActive;
    this.model.Version = itemObj.Version;
    this.reactiveForm.setValue({
      Name: itemObj.Name ?? '',
      Context: itemObj.Context ?? '',
      Id: itemObj.Id,
      Note: itemObj.Note,
      IsActive: itemObj.IsActive,
      Version: itemObj.Version,
      TypeInputAuto: null,
    });
    this.getElementsFromContext();
  }

  enableEditor() {
    this.editorDisabled = false;
  }

  disableEditor() {
    this.editorDisabled = true;
  }

  onBlur() {
    console.log('Blur');
  }

  onDelete(file: any) {
    console.log('Delete file', file.url);
  }

  summernoteInit(event: any) {
    console.log(event);
  }

  saveSettingForm(value) {
    if (this.reactiveForm?.invalid) {
      this.reactiveForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    var content = $('#summernote').summernote('code');
    content = content.trim();
    if (!content || content == null || content == '') {
      this.loading = false;
      this.toastr.error(`Giao diện form không để trống`, 'Lỗi');
    }
    if (
      this.formIdToUpdate > 0 ||
      this.isUpdateActive ||
      this.form_mau.Id > 0
    ) {
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
    this.router.navigate(['configs/formOld/chi-tiet-form', id]);
  }

  backToList() {
    this.router.navigate(['configs/formOld']);
  }

  respone: ThuocTinhFormModel = {
    Width: 0,
    Value: 0,
    Placeholder: '',
    Format: '',
    Rows: 0,
    TagName: '',
    Tooltip: '',
    minValue: 0,
    maxValue: 0,
  };
  crud: string = 'Create';
  showpopup: boolean = false;

  openModalCreate() {
    this.popup.initPopup();
    this.crud = 'Create';
    this.showpopup = true;
    this.typeInput_ = $('#idInputType').val().toString();
    this.respone = {
      Width: 0,
      Value: 0,
      Placeholder: '',
      Format: '',
      Rows: 0,
      TagName: '',
      Tooltip: '',
      minValue: 0,
      maxValue: 0,
    };
    $('body').on('shown.bs.modal', '#modalInput', function () {
      $('input:visible:enabled:first', this).focus();
    });
  }

  submitModal(model: ThuocTinhFormModel) {
    console.log('model=', model);
  }

  showErrorOnPaste() {
    this.toastr.error('Không có thông số input', 'Lỗi');
  }

  formatContent() {
    var content = $('#summernote').summernote('code');
    // var cleanedContent = content.replace(/<\/?p>|<br>/gi, '');
    var markupStr = content.replace('&nbsp;&nbsp;', '');
    markupStr = markupStr.replace('<br>', '');
    markupStr = markupStr.replace('<p class="MsoNormal"></p>', '');
    $('#summernote').summernote('code', markupStr);
  }

  onConfirmDel(item: formMauModel) {
    console.log('item=', item);
    this.commonService
      .confirm(
        'Xác nhận',
        'Bạn chắc chắn muốn xóa form mẫu : ' + item.Name + ' này?',
        ['Có', 'Không']
      )
      .subscribe((answer) => {
        if (answer) {
          this.DeleteItem(item);
        }
      });
  }

  DeleteItem(item: formMauModel) {
    this.loading = true;
    this.api.deleteSysForm(item).subscribe(
      (result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.toastr.success('Đã xóa thành công!', 'Thành công');
          this.backToList();
        } else {
          this.toastr.error(`${result.Message}`, 'Xóa lỗi');
        }
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
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
        console.log('arrayBuffer: ', arrayBuffer);
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
            $('#setting-tab').click();
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
          this.model.Context = html;
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
      this.elementInputForm = $(this.option.htmlForm + ' :input');
      this.elementInputRender = this.elementInputForm;

      this.elementTableForm = $(this.option.htmlForm + ' table');
      this.elementTableRender = this.elementTableForm;

      $(this.option.htmlForm + ' :input')
        .on('focus', function () {
          let id = $(this).attr('id');
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
        })
        .on('focusout', function () {
          $('#listElements .element').removeClass('focus');
        });
    }, 400);
  }

  focusElement(dataId: string) {
    var value = $(this.option.htmlForm).find(`#${dataId}`).val();
    $(this.option.htmlForm).find('table').removeClass('focus');
    $(this.option.htmlForm).find(`#${dataId}`).focus().val('').val(value);
  }

  focusTableElement(dataId: string) {
    $(this.option.htmlForm).find('table').removeClass('focus');
    $(this.option.htmlForm).find(`#${dataId}`).addClass('focus');
    $(`${this.option.scrollElementTable} .element`).removeClass('focus');
    $(`${this.option.scrollElementTable} [data-element=${dataId}]`).addClass(
      'focus'
    );
    // Add ScrollToElement
    let element = document.querySelector(
      `body ${this.option.htmlForm} #${dataId}`
    );
    let y = element.getBoundingClientRect().top + window.pageYOffset - 200;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  openModalEdit(id: string, isEdit: boolean) {
    this.identity = id;
    this.isEdit = isEdit;
    this.showModalEdit = true;
    $('body')
      .off()
      .on('shown.bs.modal', '#modalInputEdit', function () {
        $('input:visible:enabled:first', this).focus();
      });
  }

  openModalTableEdit(id: string) {
    this.identity = id;
    this.showModalTableEdit = true;
  }

  closeModalEdit(isTable: boolean) {
    setTimeout(() => {
      if (isTable) this.focusTableElement(this.identity);
      else this.focusElement(this.identity);
      this.identity = '';
    }, 450);
  }

  deleteElement(id: string) {
    $(`#${id}`).remove();
    this.formatContent();
    this.submitModel();
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
    let ele = $(this.option.htmlForm + ' #' + id);
    let typeInputInsert = Utility.getTypeInput(id, 'htmlForm');
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

  pasteDataElement(id: string) {
    var receiveElementItem = sessionStorage.getItem(
      ESConst.LocalStorage.Key.ElementForm
    );
    if (receiveElementItem) {
      let elementItem: ThuocTinhFormModel = JSON.parse(receiveElementItem);
      $(`#${id}`).attr('data-organizationid', elementItem.OrganizationId);
      $(`#${id}`).attr('data-equipmentid', elementItem.EquipmentId);
      $(`#${id}`).attr('data-equipmenttagid', elementItem.EquipmentTagId);
      $(`#${id}`).attr('data-equipmentname', elementItem.EquipmentName);
      $(`#${id}`).attr('data-equipmentcode', elementItem.EquipmentCode);
      $(`#${id}`).attr('data-equipmenttagname', elementItem.EquipmentTagName);
      $(`#${id}`).attr('data-tag', elementItem.TagName);
      $(`#${id}`).attr('placeholder', elementItem.Placeholder);
      $(`#${id}`).attr('data-tagid', elementItem.TagId);

      switch (elementItem.typeInput) {
        case TypeInput.NUMBER:
          $(`#${id}`).removeClass();
          $(`#${id}`).addClass('form-control ' + cleaveInputClass.NUMBER);
          $(`#${id}`).attr('max', elementItem.maxValue);
          $(`#${id}`).attr('min', elementItem.minValue);
          $(`#${id}`).attr('data-minblock', elementItem.MinBlocking);
          $(`#${id}`).attr('data-maxblock', elementItem.MaxBlocking);
          $(`#${id}`).attr('data-minwarn', elementItem.MinWarning);
          $(`#${id}`).attr('data-maxwarn', elementItem.MaxWarning);
          break;
        case TypeInput.TEXT:
          $(`#${id}`).removeClass();
          $(`#${id}`).addClass('form-control ' + cleaveInputClass.TEXT);
          if (elementItem.maxValue) {
            $(`#${id}`).attr('maxlength', elementItem.maxValue);
          }
          if (elementItem.minValue) {
            $(`#${id}`).attr('minlength', elementItem.minValue);
          }
          break;
        case TypeInput.TEXTAREA:
          if (elementItem.maxValue) {
            $(`#${id}`).attr('maxlength', elementItem.maxValue);
          }
          if (elementItem.minValue) {
            $(`#${id}`).attr('minlength', elementItem.minValue);
          }
          $(`#${id}`).attr('rows', elementItem.Rows);
          break;
        case TypeInput.DATE:
          $(`#${id}`).removeClass();
          $(`#${id}`).addClass('form-control ' + cleaveInputClass.DATE);
          $(`#${id}`).attr('name', `dateTime-${id}`);
          $(`#${id}`).attr('placeholder', 'dd/mm/yyyy');
          break;
        case TypeInput.DATEPICKER:
          $(`#${id}`).removeClass();
          $(`#${id}`).addClass('form-control ' + cleaveInputClass.DATEPICKER);
          $(`#${id}`).attr('placeholder', 'dd/mm/yyyy HH:mm');
          break;
        case TypeInput.TIME_HH_MM:
          $(`#${id}`).removeClass();
          $(`#${id}`).addClass('form-control ' + cleaveInputClass.TIME_HH_MM);
          $(`#${id}`).attr('name', `dateTime-${id}`);
          $(`#${id}`).attr('placeholder', 'HH:mm');
          break;
        case TypeInput.TIME_HH_MM_SS:
          $(`#${id}`).removeClass();
          $(`#${id}`).addClass(
            'form-control ' + cleaveInputClass.TIME_HH_MM_SS
          );
          $(`#${id}`).attr('name', `dateTime-${id}`);
          $(`#${id}`).attr('placeholder', 'HH:mm:ss');
          break;
      }
      this.changeTagNameElement(
        id,
        elementItem.typeInput,
        Utility.getTypeInput(id, 'htmlForm')
      );
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
  }

  coppyDataTable(id: string) {
    let ele = $(this.option.htmlForm + ' #' + id);
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

  changeTagNameElement(id, type: string, typeCurrent) {
    if (typeCurrent === type) {
      return;
    }
    if (type === TypeInput.TEXTAREA) {
      document.getElementById(id).outerHTML = document
        .getElementById(id)
        .outerHTML.replace(/input/g, 'textarea');
      return;
    } else if (typeCurrent === TypeInput.TEXTAREA) {
      document.getElementById(id).outerHTML = document
        .getElementById(id)
        .outerHTML.replace(/textarea/g, 'input');
    }
  }
  //End Xu ly Edit Element
}

function getCaretCharacterOffsetWithin(element) {
  var caretOffset = 0;
  var doc = element.ownerDocument || element.document;
  var win = doc.defaultView || doc.parentWindow;
  var sel;
  if (typeof win.getSelection != 'undefined') {
    sel = win.getSelection();
    if (sel.rangeCount > 0) {
      var range = win.getSelection().getRangeAt(0);
      var preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      caretOffset = preCaretRange.toString().length;
    }
  } else if ((sel = doc.selection) && sel.type != 'Control') {
    var textRange = sel.createRange();
    var preCaretTextRange = doc.body.createTextRange();
    preCaretTextRange.moveToElementText(element);
    preCaretTextRange.setEndPoint('EndToEnd', textRange);
    caretOffset = preCaretTextRange.text.length;
  }
  return caretOffset;
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
