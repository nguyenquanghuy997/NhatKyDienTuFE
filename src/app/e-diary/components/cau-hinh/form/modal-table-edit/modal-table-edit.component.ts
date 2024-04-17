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
import { ToastrService } from 'ngx-toastr';
import { ESConst } from 'src/app/e-diary/utils/Const';
import { ClassAlignCSSTable, ClassCSSTable } from 'src/app/e-diary/utils/Enum';

@Component({
  selector: 'app-modal-table-edit',
  templateUrl: './modal-table-edit.component.html',
  styleUrls: ['./modal-table-edit.component.css'],
})
export class ModalTableEditComponent {
  @Input() isVisible: boolean = true;
  @Input() identity: string = '';
  @Output() submitModel = new EventEmitter();
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
    this.reactiveForm_ = this.formBuilder_.group({
      Type: [''],
      Align: [''],
    });
  }

  initPopup() {
    this.hasElementCoppy = sessionStorage.getItem(ESConst.LocalStorage.Key.TableForm) ? true : false;
    let ele = $('#htmlForm #' + this.identity);
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

  hideModal() {
    this.isVisible = false;
    this.onHideModal.emit(true);
    this.reactiveForm_?.reset();
  }

  onSubmit(): void {
    $(`#${this.identity}`).attr(
      'class',
      'table table-bordered data-table ' +
        this.reactiveForm_.controls.Type.value +
        ' ' +
        this.reactiveForm_.controls.Align.value
    );
    this.submitModel.emit();
    $('#closeModalButtonTable').click();
    $('#btnFormatContent').click();
    this.hideModal();
  }

  CoppyDataModal() {
    let elementForm = {
      Type: this.reactiveForm_.controls.Type.value,
      Align: this.reactiveForm_.controls.Align.value,
    };
    sessionStorage.setItem(ESConst.LocalStorage.Key.TableForm, JSON.stringify(elementForm));
    this.toastr.info('Đã sao chép nội dung', '', {
      timeOut: 1500,
      positionClass: 'toast-bottom-right',
    });
  }

  PasteDataModal() {
    var receiveElementItem = sessionStorage.getItem(ESConst.LocalStorage.Key.TableForm);
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
