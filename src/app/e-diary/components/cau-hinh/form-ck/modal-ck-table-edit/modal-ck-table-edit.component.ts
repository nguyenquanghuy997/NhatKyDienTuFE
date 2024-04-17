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
  Validators,
} from '@angular/forms';
import Editor from 'ckeditor5/build/ckeditor';
import { ToastrService } from 'ngx-toastr';
import { ESConst } from 'src/app/e-diary/utils/Const';
import { ClassAlignCSSTable, ClassCSSTable } from 'src/app/e-diary/utils/Enum';
import {
  Element,
  AttributeElement,
  DocumentSelection,
} from '@ckeditor/ckeditor5-engine';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-modal-table-ck-edit',
  templateUrl: './modal-ck-table-edit.component.html',
  styleUrls: ['./modal-ck-table-edit.component.css'],
})
export class ModalTableEditCKComponent {
  @Input() identity: string = '';
  @Output() onHideModal = new EventEmitter();
  classCSSTableMapping = ESConst.ClassCSSTableMapping;
  classCSSAlignTableMapping = ESConst.ClassAlignCSSTableMapping;
  reactiveForm_!: FormGroup;
  hasElementCoppy: boolean = false;
  LtsClassCSS = Object.values(ClassCSSTable);
  LtsClassAlignCSS = Object.values(ClassAlignCSSTable);
  constructor(
    private formBuilder_: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.identity?.currentValue) {
      this.initPopup();
    }
  }

  ngOnInit() {
    this.resetForm();
  }

  resetForm() {
    this.reactiveForm_ = this.formBuilder_.group({
      Type: [''],
      Align: [''],
    });
  }

  initPopup() {
    this.hasElementCoppy = sessionStorage.getItem(
      ESConst.LocalStorage.Key.TableForm
    )
      ? true
      : false;
    let ele = $('#editor table#' + this.identity);
    if (ele.length == 0) {
      return;
    }
    $('#identityTableModal').val(this.identity);

    let arrayClass = ele.attr('class').split(' ');
    arrayClass.forEach((item) => {
      if (Object.values(ClassCSSTable).includes(item as ClassCSSTable))
        this.reactiveForm_.controls.Type.setValue(item);

      if (
        Object.values(ClassAlignCSSTable).includes(item as ClassAlignCSSTable)
      )
        this.reactiveForm_.controls.Align.setValue(item);
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.reactiveForm_!.controls;
  }

  HideModal() {
    ($('#modalTableEdit') as any).modal('hide');
    this.onHideModal.emit(false);
  }

  ShowModal() {
    ($('#modalTableEdit') as any).modal('show');
    this.resetForm();
    this.reactiveForm_.reset();
  }

  onHide() {
    this.HideModal();
  }

  onSubmit(): void {
    const editor = (window as any).editor as Editor;
    editor.model.document.selection.refresh();

    const selection =
      editor.model.document.selection.getSelectedElement() as Element;

    let attrValue = selection.getAttribute('htmlTableAttributes');
    (attrValue as any).classes = [
      'table',
      'table-bordered',
      'data-table',
      this.reactiveForm_.controls.Type.value,
      this.reactiveForm_.controls.Align.value,
    ];

    editor.model.change((writer) => {
      writer.setAttribute('alt', attrValue, selection);
    });

    this.onHide();
  }

  CoppyDataModal() {
    let elementForm = {
      Type: this.reactiveForm_.controls.Type.value,
      Align: this.reactiveForm_.controls.Align.value,
    };
    sessionStorage.setItem(
      ESConst.LocalStorage.Key.TableForm,
      JSON.stringify(elementForm)
    );
    this.toastr.info('Đã sao chép nội dung', '', {
      timeOut: 1500,
      positionClass: 'toast-bottom-right',
    });
  }

  PasteDataModal() {
    var receiveElementItem = sessionStorage.getItem(
      ESConst.LocalStorage.Key.TableForm
    );
    if (receiveElementItem) {
      let elementItem: any = JSON.parse(receiveElementItem);
      this.reactiveForm_.patchValue({
        Type: elementItem.Type,
        Align: elementItem.Align,
      });
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
}
