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
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import moment from 'moment';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { viLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import { RefTypeModel } from 'src/app/e-diary/models/cau-hinh/RefTypeModel';
import { JobTitleModel } from 'src/app/e-diary/models/danh-muc/JobTitleModel';
import { ShiftCategoryModel } from 'src/app/e-diary/models/danh-muc/ShiftCategoryModel';
import { ShiftEffectivePeriodModel } from 'src/app/e-diary/models/danh-muc/ShiftEffectivePeriodModel';
import { RefTypeService } from 'src/app/e-diary/services/cau-hinh/ref-type.service';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { JobTitleService } from 'src/app/e-diary/services/danh-muc/job-title.service';
import { FunctionCode, NgSelectMessage } from 'src/app/e-diary/utils/Enum';
defineLocale('vi', viLocale);
@Component({
  selector: 'app-shift-effective-period-config-modal',
  templateUrl: './shift-effective-period-config-modal.component.html',
  styleUrls: ['./shift-effective-period-config-modal.component.css'],
})
export class ShiftEffectivePeriodConfigModalComponent {
  @Input() lstFunctionCode: string[];
  @Input() functionCode: FunctionCode;
  @Input() model: ShiftEffectivePeriodModel = {};
  @Input() lstShiftCategory: ShiftCategoryModel[] = [];

  @Output() onSubmitModal = new EventEmitter();
  @Output() onConfirmDel = new EventEmitter();
  @Output() onSwitchConfig = new EventEmitter();

  lstJobTitle: JobTitleModel[] = [];
  lstRefType: RefTypeModel[] = [];

  datePickerConfig: Partial<BsDatepickerConfig>;
  FunctionCode = FunctionCode;
  popupForm!: FormGroup;
  listConfigCode: string[] = [];
  ngSelectMessage = NgSelectMessage;

  constructor(
    private formBuilder: FormBuilder,
    private jobTitleService: JobTitleService,
    private refTypeService: RefTypeService,
    private toastr: ToastrService,
    private commonService: CommonService
  ) {
    this.resetForm();

    this.datePickerConfig = {
      dateInputFormat: 'DD/MM/YYYY',
      showWeekNumbers: false,
      isAnimated: true,
      showClearButton: true,
    };
  }

  get f(): { [key: string]: AbstractControl } {
    return this.popupForm!.controls;
  }

  get shifts() {
    return this.popupForm.get('Shifts') as FormArray;
  }

  get shiftComponents() {
    return this.popupForm.get('ShiftComponents') as FormArray;
  }

  resetForm() {
    this.popupForm = this.formBuilder.group({
      Name: ['', [Validators.required, Validators.maxLength(100)]],
      Note: ['', [Validators.maxLength(1000)]],
      Color: ['#1565c0', [Validators.required]],
      IsActive: [true, [Validators.required]],
      IsActiveName: ['Hoạt động'],
      ShiftCategoryId: [null, [Validators.required]],
      ShiftCategoryName: [null],
      Shifts: new FormArray(
        [this.createShift()],
        [this.CheckSumTime, this.CheckValidValueTime]
      ),
      ShiftComponents: new FormArray(
        [this.createShiftComponents()],
        [this.checkDuplicateJobTitle]
      ),
    });
  }

  createShift() {
    return this.formBuilder.group({
      Name: ['', [Validators.required, Validators.maxLength(100)]],
      StartTime: ['', [Validators.required, this.CheckValidTime]],
      EndTime: ['', [Validators.required, this.CheckValidTime]],
      Note: ['', [Validators.maxLength(1000)]],
    });
  }

  createShiftComponents() {
    return this.formBuilder.group({
      JobTitleId: [null, [Validators.required]],
      JobTitleName: [null],
      RefTypeIds: [null, [Validators.required]],
      RefTypeNames: [null],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.model?.currentValue) {
      this.initData();
    }
  }

  initData() {
    if (this.model.ShiftModels && this.model.ShiftModels.length > 0) {
      let control = <FormArray>this.popupForm.controls.Shifts;
      for (let i = 0; i < this.model.ShiftModels.length; i++) {
        if (i < this.model.ShiftModels.length - 1)
          control.push(this.createShift());

        this.model.ShiftModels[i].EndTime = moment(
          this.model.ShiftModels[i].EndTime,
          'HH:mm:ss'
        ).format('HH:mm');
        this.model.ShiftModels[i].StartTime = moment(
          this.model.ShiftModels[i].StartTime,
          'HH:mm:ss'
        ).format('HH:mm');
      }
    }

    if (
      this.model.ShiftComponentModels &&
      this.model.ShiftComponentModels.length > 0
    ) {
      let control = <FormArray>this.popupForm.controls.ShiftComponents;
      for (let i = 0; i < this.model.ShiftComponentModels.length; i++) {
        if (i < this.model.ShiftComponentModels.length - 1)
          control.push(this.createShiftComponents());
      }
    }

    if (this.functionCode != FunctionCode.DISPLAY) this.getResource();

    this.popupForm.patchValue({
      Name: this.model.Name,
      Note: this.model.Note,
      IsActive: this.model.IsActive,
      IsActiveName: this.model.IsActive ? 'Hoạt động' : 'Không hoạt động',
      Color: this.model.Color ?? '#1565c0',
      ShiftCategoryId: this.model.ShiftCategoryId,
      ShiftCategoryName: this.model.ShiftCategoryName,
      Shifts: this.model.ShiftModels,
      ShiftComponents: this.model.ShiftComponentModels,
    });
  }

  onChangeSelect(id) {
    if (!id) return;
    this.getListRefType(id);
  }

  getListRefType(id) {
    this.refTypeService.getListRefType({ ShiftCategoryId: id }).subscribe(
      (result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.lstRefType = result.Data;
        } else {
          this.toastr.error(`${result.Message}`, 'Lỗi');
        }
      }
    );
  }

  HideModal() {
    ($('#ShiftCategoryModal') as any).modal('hide');
  }

  ShowModal() {
    ($('#ShiftCategoryModal') as any).modal('show');
    this.resetForm();
    this.popupForm.reset();
  }

  onHide() {
    // chuyển event ra ngoài, thêm xử lý bên ngoài nếu cần
    this.HideModal();
  }

  onSubmit() {
    if (this.popupForm?.invalid) {
      this.popupForm.markAllAsTouched();
      return;
    }
    this.model.Name = this.popupForm.controls.Name.value.trim();
    this.model.ShiftCategoryId = this.popupForm.controls.ShiftCategoryId.value;
    this.model.Note = this.popupForm.controls.Note.value;
    this.model.ShiftModels = this.popupForm.controls.Shifts.value;
    this.model.Color = this.popupForm.controls.Color.value;
    this.model.IsActive = this.popupForm.controls.IsActive.value;
    this.model.ShiftComponentModels =
      this.popupForm.controls.ShiftComponents.value;
    // chuyển ra ngoài để thực hiện Create/Edit
    this.model.ShiftModels.map((item, index) => {
      item.NO = index + 1;
      item.EndTime = moment(item.EndTime, 'HH:mm').format('HH:mm:ss');
      item.StartTime = moment(item.StartTime, 'HH:mm').format('HH:mm:ss');
      return item;
    });
    //
    this.model.ShiftComponentModels.map((item, index) => {
      item.NO = index + 1;
      return item;
    });
    this.onSubmitModal.emit(this.model);
  }

  onConfig() {
    this.onSwitchConfig.emit();
    this.getResource();
  }

  onDelete() {
    this.onConfirmDel.emit(this.model);
    this.HideModal();
  }

  onAddShiftComponent() {
    this.shiftComponents.markAllAsTouched();
    // if (this.shiftComponents.controls.some((p) => p.invalid)) {
    //   return;
    // }
    let item = this.createShiftComponents();
    let arrayControl = <FormArray>this.popupForm.controls.ShiftComponents;
    arrayControl.push(item);
  }

  onDeleteShiftComponent(index: number) {
    let control = <FormArray>this.popupForm.controls.ShiftComponents;
    control.removeAt(index);
  }

  onAddShift() {
    this.shifts.markAllAsTouched();
    // if (this.shifts.controls.some((p) => p.invalid)) {
    //   return;
    // }
    let item = this.createShift();
    let arrayControl = <FormArray>this.popupForm.controls.Shifts;
    arrayControl.push(item);
  }

  onDeleteShift(index: number) {
    let control = <FormArray>this.popupForm.controls.Shifts;
    control.removeAt(index);
  }

  CheckSumTime(array: FormArray) {
    let totalTime = 0;
    array.controls.forEach((item: FormGroup) => {
      if (item.controls.StartTime.value && item.controls.EndTime.value) {
        let startTime = moment(item.controls.StartTime.value, 'HH:mm');
        let startDateTime = moment().set({
          hour: startTime.get('hour'),
          minute: startTime.get('minute'),
          second: 0,
        });

        let endTime = moment(item.controls.EndTime.value, 'HH:mm');
        let endDateTime = moment().set({
          hour: endTime.get('hour'),
          minute: endTime.get('minute'),
          second: 0,
        });

        if (endDateTime <= startDateTime) {
          endDateTime.add(1, 'days');
        }

        totalTime =
          totalTime + Math.abs(endDateTime.diff(startDateTime, 'minutes'));
      }
    });
    return totalTime != 0
      ? totalTime / 60 == 24
        ? null
        : { exceedTime: true }
      : null;
  }

  CheckValidTime(fomrControl: FormControl) {
    return fomrControl.value
      ? fomrControl.value.length >= 5
        ? null
        : { errorFormat: true }
      : null;
  }

  CheckValidValueTime(array: FormArray) {
    if (array.controls.length < 2) return null;
    for (let i = 1; i < array.controls.length; i++) {
      let firstItem = array.controls[i - 1] as FormGroup;
      let secondItem = array.controls[i] as FormGroup;

      if (
        firstItem.controls.EndTime.value &&
        secondItem.controls.StartTime.value
      ) {
        if (
          firstItem.controls.EndTime.value !=
          secondItem.controls.StartTime.value
        )
          secondItem.controls.StartTime.setErrors({ notEqual: true });
        else secondItem.controls.StartTime.setErrors(null);
      }
    }
  }

  checkDuplicateJobTitle(array: FormArray) {
    if (array.controls.length < 2) return null;
    let jobTitleIds = [];
    array.controls.forEach((element: FormGroup) => {
      jobTitleIds.push(element.controls.JobTitleId.value);
    });
    jobTitleIds = jobTitleIds.filter((e) => e !== 0 && e);
    return new Set(jobTitleIds).size !== jobTitleIds.length
      ? { duplicate: true }
      : null;
  }

  getResource() {
    this.jobTitleService.getListJobTitle({ IsActive: true }).subscribe(
      (result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.lstJobTitle = result.Data;
        } else {
          this.toastr.error(`${result.Message}`, 'Lỗi');
        }
      }
    );
    this.getListRefType(this.model.ShiftCategoryId);
  }
}
