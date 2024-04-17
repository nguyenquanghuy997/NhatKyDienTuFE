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
  FormGroup,
  Validators,
} from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { Observable, forkJoin } from 'rxjs';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import { sysUserModel } from 'src/app/e-diary/models/quan-tri/sysUserModel';
import { ShiftScheduleMemberModel } from 'src/app/e-diary/models/cau-hinh/ShiftScheduleMemberModel';
import { ShiftScheduleModel } from 'src/app/e-diary/models/cau-hinh/ShiftScheduleModel';
import {
  ShiftEffectivePeriodFilter,
  ShiftEffectivePeriodModel,
} from 'src/app/e-diary/models/danh-muc/ShiftEffectivePeriodModel';
import {
  ShiftFilter,
  ShiftModel,
} from 'src/app/e-diary/models/danh-muc/ShiftModel';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { JobTitleService } from 'src/app/e-diary/services/danh-muc/job-title.service';
import { ShiftEffectivePeriodService } from 'src/app/e-diary/services/danh-muc/shift-effective-period.service';
import { ShiftService } from 'src/app/e-diary/services/danh-muc/shift.service';
import { UserService } from 'src/app/e-diary/services/quan-tri/user.service';
import { FunctionCode, NgSelectMessage } from 'src/app/e-diary/utils/Enum';
import { error } from 'console';

@Component({
  selector: 'app-shift-schedule-modal',
  templateUrl: './shift-schedule-modal.component.html',
  styleUrls: ['./shift-schedule-modal.component.css'],
})
export class ShiftScheduleModalComponent {
  @Input() lstFunctionCode: string[];
  @Input() functionCode: FunctionCode;
  @Input() model: ShiftScheduleModel = {};
  @Input() shiftCategoryId: number;
  @Input() organizationId: number;

  @Output() onSubmitModal = new EventEmitter();
  @Output() onConfirmDel = new EventEmitter();
  @Output() onSwitchEdit = new EventEmitter();

  lstUser: sysUserModel[] = [];
  lstShiftEffective: ShiftEffectivePeriodModel[] = [];
  FunctionCode = FunctionCode;
  popupForm!: FormGroup;
  ngSelectMessage = NgSelectMessage;
  datePickerConfig: Partial<BsDatepickerConfig>;
  invalidTime: boolean = false;
  //#region Dùng để validate
  get f(): { [key: string]: AbstractControl } {
    return this.popupForm!.controls;
  }

  get shiftSchedules() {
    return this.popupForm.get('ShiftScheduleMembers') as FormArray;
  }
  //#endregion

  constructor(
    private formBuilder: FormBuilder,
    private shiftService: ShiftService,
    private shiftEffecService: ShiftEffectivePeriodService,
    private jobTitleService: JobTitleService,
    private userService: UserService,
    private toastr: ToastrService,
    private commonService: CommonService
  ) {
    this.datePickerConfig = {
      rangeInputFormat: 'DD/MM/YYYY',
      showWeekNumbers: false,
      isAnimated: true,
    };
    this.resetForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.model?.currentValue) {
      this.initData();
    }
  }

  resetForm() {
    this.popupForm = this.formBuilder.group({
      RangeTime: [null, [Validators.required]],
      ShiftEffectivePeriodId: [null, [Validators.required]],
      ShiftEffectivePeriodName: [null],
      ShiftCategoryId: [null, [Validators.required]],
      ShiftScheduleIds: [null],
      ShiftScheduleMembers: new FormArray([], [this.checkDuplicateValue]),
    });
  }

  initData() {
    if (
      this.model.ShiftScheduleMembers &&
      this.model.ShiftScheduleMembers.length > 0
    ) {
      let control = <FormArray>this.popupForm.controls.ShiftScheduleMembers;
      this.model.ShiftScheduleMembers.forEach((e) => {
        let timeRequired = new Date(e.EndDTG);
        let addDay =
          new Date(e.StartDTG).getMonth() < new Date(e.EndDTG).getMonth()
            ? 1
            : new Date(e.StartDTG).getDate() < new Date(e.EndDTG).getDate()
            ? 1
            : 0;

        timeRequired.setFullYear(
          this.model.EndDTG.getFullYear(),
          this.model.EndDTG.getMonth(),
          this.model.EndDTG.getDate() + addDay
        );

        control.push(
          this.formBuilder.group({
            UserId: [
              null,
              timeRequired < new Date() ? undefined : [Validators.required],
            ],
            Username: [null],
            JobTitleId: [null, [Validators.required]],
            JobTitleName: [null, [Validators.required]],
            ShiftId: [null, [Validators.required]],
            ShiftName: [null],
            RefTypeIds: [null, [Validators.required]],
            EndDTG: [null],
            StartDTG: [null],
            ChildNumber: [null],
            ChildFirst: [null],
            // index: [null],
          })
        );
      });
    }

    if (this.functionCode != FunctionCode.DISPLAY) this.getResource();

    this.popupForm.patchValue({
      RangeTime:
        this.functionCode == FunctionCode.CREATE
          ? [this.model.StartDTG, this.model.EndDTG]
          : this.model.StartDTG,
      ShiftCategoryId: this.shiftCategoryId,
      ShiftScheduleIds: this.model.ShiftScheduleIds,
      ShiftEffectivePeriodId: this.model.ShiftEffectivePeriodId,
      ShiftEffectivePeriodName: this.model.ShiftEffectivePeriodName,
      ShiftScheduleMembers: this.renderGroupTable(
        this.model.ShiftScheduleMembers
      ),
    });

    if (this.functionCode != FunctionCode.CREATE) {
      let dateNow = new Date();
      dateNow.setHours(10, 0, 0, 0);
      this.invalidTime = this.model.StartDTG >= dateNow;
    }
    if (!this.model.ShiftEffectivePeriodId || !this.model.StartDTG) return;
    this.getListShift(true);
  }

  HideModal() {
    ($('#ShiftScheduleModal') as any).modal('hide');
  }

  ShowModal() {
    ($('#ShiftScheduleModal') as any).modal('show');
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
    if (this.functionCode == FunctionCode.CREATE) {
      this.model.StartDTG = this.popupForm.controls.RangeTime.value[0];
      this.model.StartDTG.setHours(10);
      this.model.EndDTG = this.popupForm.controls.RangeTime.value[1];
      this.model.EndDTG.setHours(10);
    } else {
      this.model.StartDTG = this.popupForm.controls.RangeTime.value;
      this.model.StartDTG.setHours(10);
      this.model.EndDTG = this.model.StartDTG;
    }

    this.model.ShiftEffectivePeriodId =
      this.popupForm.controls.ShiftEffectivePeriodId.value;
    this.model.ShiftScheduleMembers =
      this.popupForm.controls.ShiftScheduleMembers.value;
    this.model.ShiftCategoryId = this.popupForm.controls.ShiftCategoryId.value;
    this.model.ShiftScheduleIds =
      this.popupForm.controls.ShiftScheduleIds.value;
    // chuyển ra ngoài để thực hiện Create/Edit
    this.onSubmitModal.emit(this.model);
  }

  onEdit() {
    this.onSwitchEdit.emit();
    this.getResource();
  }

  onDelete() {
    this.onConfirmDel.emit(this.model);
    this.HideModal();
  }

  onChangeSelect(id) {
    if (!id) return;
    this.getListShift();
  }

  getListShift(isRenderMember?: boolean) {
    if (!this.f.ShiftEffectivePeriodId.value) return;
    let shiftEffectivePeriodId = this.f.ShiftEffectivePeriodId.value;

    let oShifts: Observable<ResponseModel> =
      this.shiftService.GetListItemByShiftEffectivePeriodId(
        shiftEffectivePeriodId
      );
    let oJobTitles: Observable<ResponseModel> =
      this.jobTitleService.GetListJobTitleByShiftEffectivePeriodId(
        shiftEffectivePeriodId
      );
    forkJoin([oShifts, oJobTitles], (result, resultJobTile) => {
      return [result, resultJobTile];
    }).subscribe(
      ([result, resultJobTile]) => {
        if (
          this.commonService.checkTypeResponseData(result) &&
          this.commonService.checkTypeResponseData(resultJobTile)
        ) {
          let lstShift = result.Data as ShiftModel[];
          if (!isRenderMember) {
            let arrayControl = <FormArray>(
              this.popupForm.controls.ShiftScheduleMembers
            );
            while (arrayControl.length !== 0) {
              arrayControl.removeAt(0);
            }
            lstShift.forEach((shift) => {
              let timeRequired = new Date(shift.EndDTG);
              let addDay =
                new Date(shift.StartDTG).getMonth() <
                new Date(shift.EndDTG).getMonth()
                  ? 1
                  : new Date(shift.StartDTG).getDate() <
                    new Date(shift.EndDTG).getDate()
                  ? 1
                  : 0;

              timeRequired.setFullYear(
                this.model.EndDTG.getFullYear(),
                this.model.EndDTG.getMonth(),
                this.model.EndDTG.getDate() + addDay
              );

              resultJobTile.Data.forEach((p) => {
                arrayControl.push(
                  this.formBuilder.group({
                    UserId: [
                      null,
                      timeRequired < new Date()
                        ? undefined
                        : [Validators.required],
                    ],
                    Username: [null],
                    JobTitleId: [p.Id, [Validators.required]],
                    ShiftId: [shift.Id, [Validators.required]],
                    ShiftName: [shift.Name],
                    JobTitleName: [p.Name],
                    RefTypeIds: [p.RefTypeIds, [Validators.required]],
                    EndDTG: [shift.EndDTG],
                    StartDTG: [shift.StartDTG],
                    ChildNumber: [null],
                    ChildFirst: [null],
                  })
                );
              });
            });

            this.popupForm.controls.ShiftScheduleMembers.setValue(
              this.renderGroupTable(
                this.popupForm.controls.ShiftScheduleMembers.value
              )
            );
          }
        } else {
          this.toastr.error(
            `${result.Message || resultJobTile.Message}`,
            'Lỗi'
          );
        }
      }
    );
  }

  checkDuplicateValue(array: FormArray) {
    if (array.controls.length < 2) return null;
    let arrayGroups = [];
    array.controls.forEach((element: FormGroup) => {
      arrayGroups.push({
        UserId: element.controls.UserId.value,
        ShiftId: element.controls.ShiftId.value,
      });
    });

    let group = arrayGroups.reduce(function (r, a) {
      r[a.ShiftId] = r[a.ShiftId] || [];
      r[a.ShiftId].push(a);
      return r;
    }, Object.create(null));

    let isValid = null;
    Object.values(group).some((item: []) => {
      let array = item.map(function (item) {
        return item['UserId'];
      });
      array = array.filter((e) => e !== 0 && e);
      if (new Set(array).size !== array.length) {
        isValid = { duplicate: true };
        return true;
      }
    });

    return isValid;
  }

  renderGroupTable(items: ShiftScheduleMemberModel[]) {
    // let index = 0;
    if (!items || items.length == 0) return items;

    items.forEach((e) => {
      let arrayChild = items.filter((p) => p.ShiftId == e.ShiftId);
      e.ChildNumber = arrayChild.length;
      e.ChildFirst = arrayChild[0].JobTitleId == e.JobTitleId ? true : false;
      // e.index = e.ChildFirst ? index++ : index;
    });
    return items;
  }

  changeRangeTime() {
    let date;
    if (this.functionCode == FunctionCode.CREATE)
      date = this.popupForm.controls.RangeTime.value[1];
    else date = this.popupForm.controls.RangeTime.value;

    let arrayControl = <FormArray>this.popupForm.controls.ShiftScheduleMembers;
    arrayControl.controls.forEach((control: FormGroup) => {
      if (control.controls.EndDTG.value) {
        let timeRequired = new Date(control.controls.EndDTG.value);
        let addDay =
          new Date(control.controls.StartDTG.value).getMonth() <
          new Date(control.controls.EndDTG.value).getMonth()
            ? 1
            : new Date(control.controls.StartDTG.value).getDate() <
              new Date(control.controls.EndDTG.value).getDate()
            ? 1
            : 0;
        timeRequired.setFullYear(
          date.getFullYear(),
          date.getMonth(),
          date.getDate() + addDay
        );

        if (timeRequired < new Date()) {
          control.controls.UserId.clearValidators();
        } else {
          control.controls.UserId.setValidators([Validators.required]);
        }
      }
    });
    arrayControl.updateValueAndValidity();
  }

  getResource() {
    this.userService
      .getListItem({ IsActive: true, OrganizationId: this.organizationId })
      .subscribe((result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.lstUser = result.Data;
        } else {
          this.toastr.error(`${result.Message}`, 'Lỗi');
        }
      });

    let filterPeriod: ShiftEffectivePeriodFilter = {
      ShiftCategoryId: this.shiftCategoryId,
      IsActive: true,
    };
    this.shiftEffecService
      .getListShiftEffectivePeriod(filterPeriod)
      .subscribe((result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.lstShiftEffective = result.Data;
          if (this.functionCode === FunctionCode.CREATE) {
            this.popupForm.controls.ShiftEffectivePeriodId.setValue(
              this.lstShiftEffective[0].Id
            );
            this.getListShift();
          }
        } else {
          this.toastr.error(`${result.Message}`, 'Lỗi');
        }
      });
  }
}
