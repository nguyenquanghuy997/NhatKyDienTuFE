import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import {
  sysUserFilter,
  sysUserModel,
} from 'src/app/e-diary/models/quan-tri/sysUserModel';
import { RefTypeModel } from 'src/app/e-diary/models/cau-hinh/RefTypeModel';
import { ShiftScheduleMemberModel } from 'src/app/e-diary/models/cau-hinh/ShiftScheduleMemberModel';
import { ShiftEffectivePeriodModel } from 'src/app/e-diary/models/danh-muc/ShiftEffectivePeriodModel';
import { ShiftModel } from 'src/app/e-diary/models/danh-muc/ShiftModel';
import { DutyShiftMemberModel } from 'src/app/e-diary/models/nhat-ky-van-hanh/DutyShiftMemberModel';
import { DutyShiftModel } from 'src/app/e-diary/models/nhat-ky-van-hanh/DutyShiftModel';
import { ProcessFormModel } from 'src/app/e-diary/models/nhat-ky-van-hanh/ProcessFormModel';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { ShiftEffectivePeriodService } from 'src/app/e-diary/services/danh-muc/shift-effective-period.service';
import { ShiftService } from 'src/app/e-diary/services/danh-muc/shift.service';
import { UserService } from 'src/app/e-diary/services/quan-tri/user.service';
import { FunctionCode, NgSelectMessage } from 'src/app/e-diary/utils/Enum';

@Component({
  selector: 'app-truc-ca-parent-addnew-modal',
  templateUrl: './truc-ca-parent-addnew-modal.component.html',
  styleUrls: ['./truc-ca-parent-addnew-modal.component.css'],
})
export class TrucCaParentAddnewModalComponent {
  @Input() lstFunctionCode: string[];
  @Input() functionCode: FunctionCode;
  @Input() RefTypeModel!: RefTypeModel;

  @Output() onSubmitModal = new EventEmitter();
  @Output() onHideModal = new EventEmitter();

  model: ProcessFormModel = {};

  ngSelectMessage = NgSelectMessage;
  FunctionCode = FunctionCode;

  popupForm!: FormGroup;
  itemValidate: ProcessFormModel = {};
  submitted: boolean = false;

  // sau khi shiftEffectivePeriod thì có lstShiftModel
  lstShiftModel: ShiftModel[] = [];
  // select Shift thì có giá trị
  shiftSelected: ShiftModel;

  // ds User cho người dùng chọn
  lstUser: sysUserModel[] = [];
  lstMemberChild: ShiftScheduleMemberModel[] = [];

  bsConfig: Partial<BsDatepickerConfig> = {
    dateInputFormat: 'DD/MM/YYYY',
    showWeekNumbers: false,
    isAnimated: true,
    showClearButton: true,
    showTodayButton: true,
  };

  //#region Dùng để validate
  get f(): { [key: string]: AbstractControl } {
    return this.popupForm!.controls;
  }
  //#endregion
  constructor(
    private formBuilder: FormBuilder,
    private shiftService: ShiftService,
    private userSerice: UserService,
    private toastr: ToastrService,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.model = {
      RefTypeId: this.RefTypeModel.Id,
      StartDTG: null,
    };
    this.popupForm = this.formBuilder.group({
      StartDTG: [null, [Validators.required]],
      ShiftId: [null, [Validators.required]],
      Note: ['', [Validators.maxLength(1000)]],
    });

    this.SetupModal();

    // khi document ready thì handle event hide modal
    $(document).ready(function () {
      $('#TrucCaParentAddnewModal').on('hidden.bs.modal', function (e) {
        let is_display_none =
          $('#TrucCaParentAddnewModal').css('display') === 'none';
        if (is_display_none) $('#closeModalButton').click();
      });
    });
  }

  private SetupModal() {
    // load thông tin ds User để người dùng chọn lại thành viên ca trực
    let userFilter: sysUserFilter = {
      IsActive: true,
    };
    // Lấy ds User
    this.userSerice
      .getListItem(userFilter)
      .subscribe((result: ResponseModel) => {
        if (!this.commonService.checkTypeResponseData(result)) {
          console.error(result.Exception);
          this.toastr.error(result.Message, 'Lỗi');
          return;
        }
        this.lstUser = result.Data;
      });

    // this.getShiftEffectivePeriodInfo();
  }

  private getShiftEffectivePeriodInfo() {
    // clear dữ liệu cũ
    this.lstShiftModel = [];
    this.shiftSelected = null;

    if (!this.model.RefTypeId || !this.model.StartDTG) {
      this.lstShiftModel = [];
      this.model.ShiftId = null;
      this.onShiftIdChange();
      return;
    }
    // load thông tin ds ca trực + thành viên ca trực theo lịch trực
    this.shiftService
      .getListShiftByDateAndRefTypeId(this.model.RefTypeId, this.model.StartDTG)
      .subscribe((result: ResponseModel) => {
        if (!this.commonService.checkTypeResponseData(result)) {
          console.error(result.Exception);
          this.toastr.error(result.Message, 'Lỗi');
          return;
        }
        this.lstShiftModel = result.Data;
        if (this.lstShiftModel.length > 0)
          this.model.ShiftId = this.lstShiftModel[0]?.Id;
        else this.model.ShiftId = null;

        this.onShiftIdChange();
      });
  }

  ShowModal() {
    // reset lại dữ liệu, tránh còn dữ liệu cũ
    this.model = {
      RefTypeId: this.RefTypeModel.Id,
      StartDTG: new Date(),
    };
    ($('#TrucCaParentAddnewModal') as any).modal('show');
  }

  private onHide() {
    ($('#TrucCaParentAddnewModal') as any).modal('hide');
    // chuyển event ra ngoài, thêm xử lý bên ngoài nếu cần
    this.onHideModal.emit();
    this.submitted = false;
  }

  private onSubmit() {
    this.submitted = true;
    if (this.popupForm?.invalid) {
      return;
    }

    // => do có sự thay đổi giá trị nên clone ra 1 obj khác để thực hiện nghiệp vụ submit, tránh ảnh hưởng giá trị obj cũ
    let item: ProcessFormModel = Object.assign({}, this.model);

    // map thông tin DutyShift
    let dutyShift = this.getDutyShiftInfo();
    item.DutyShift = dutyShift;

    // chuyển ra ngoài để thực hiện Create/Edit
    ($('#TrucCaParentAddnewModal') as any).modal('hide');
    this.onSubmitModal.emit(item);
  }

  private getDutyShiftInfo(): DutyShiftModel {
    let dutyShift: DutyShiftModel = {};
    // ca trực
    dutyShift.ShiftId = this.shiftSelected.Id;
    dutyShift.ShiftName = this.shiftSelected.Name;

    // xác định ds thành viên
    dutyShift.DutyShiftMembers = this.shiftSelected.ShiftScheduleMembers.map(
      (e) => {
        let member: DutyShiftMemberModel = {
          UserId: e.UserId,
          JobTitleId: e.JobTitleId,
          RefTypes: e.RefTypes,
        };
        return member;
      }
    );

    // xác định StartDate
    // Tính StartDTG = StartDate + StartDate
    // Tính EnđTG = EndDate < StartDate ? (StartDate + 1day) + EndDate : StartDate + EndDate
    dutyShift.StartDTG = new Date(this.model.StartDTG); // làm ntn để chắc chắn StartDate là DateTime
    // dutyShift.EndDTG = new Date(this.model.StartDTG); // làm ntn để chắc chắn EndDate là DateTime
    dutyShift.StartDTG = new Date(
      dutyShift.StartDTG.getFullYear(),
      dutyShift.StartDTG.getMonth(),
      dutyShift.StartDTG.getDate(),
      this.shiftSelected.StartDTG.getHours(),
      this.shiftSelected.StartDTG.getMinutes(),
      this.shiftSelected.StartDTG.getSeconds(),
      this.shiftSelected.StartDTG.getMilliseconds()
    );

    dutyShift.EndDTG = new Date(
      dutyShift.StartDTG.getFullYear(),
      dutyShift.StartDTG.getMonth(),
      dutyShift.StartDTG.getDate(),
      this.shiftSelected.EndDTG.getHours(),
      this.shiftSelected.EndDTG.getMinutes(),
      this.shiftSelected.EndDTG.getSeconds(),
      this.shiftSelected.EndDTG.getMilliseconds()
    );
    if (dutyShift.EndDTG <= dutyShift.StartDTG)
      dutyShift.EndDTG.setDate(dutyShift.EndDTG.getDate() + 1);

    // Nhận thấy datetime từ timepicker đang sai do ảnh hưởng bởi timezone
    // => xác định time offset rùi add bù lại cho giá trị datetime
    if (dutyShift.StartDTG instanceof Date) {
      let startTimezoneOffset = dutyShift.StartDTG.getTimezoneOffset();
      dutyShift.StartDTG.setMinutes(
        dutyShift.StartDTG.getMinutes() - startTimezoneOffset
      );
    } else {
      console.error(`StartDTG không phải Date: ${dutyShift.StartDTG}`);
    }
    // xác định EndDTG
    // Nhận thấy datetime từ timepicker đang sai do ảnh hưởng bởi timezone
    // => xác định time offset rùi add bù lại cho giá trị datetime
    if (dutyShift.EndDTG instanceof Date) {
      let endTimezoneOffset = dutyShift.EndDTG.getTimezoneOffset();
      dutyShift.EndDTG.setMinutes(
        dutyShift.EndDTG.getMinutes() - endTimezoneOffset
      );
    } else {
      console.error(`EndDTG không phải Date: ${dutyShift.EndDTG}`);
    }

    return dutyShift;
  }

  private onStartDTGChange() {
    if (this.model.StartDTG) {
      let startTimezoneOffset = this.model.StartDTG.getTimezoneOffset();
      this.model.StartDTG.setMinutes(
        this.model.StartDTG.getMinutes() - startTimezoneOffset
      );
    }

    // thay đổi ngày thì reload lại ds ca trực
    this.getShiftEffectivePeriodInfo();
    // khi chọn ca trực thì fill data thời gian ca
    this.onShiftIdChange();
  }

  private onShiftIdChange(event?: any) {
    // khi chọn ca trực thì fill data thời gian ca
    this.shiftSelected = this.lstShiftModel.find(
      (e) => e.Id === this.model.ShiftId
    );
    if (this.shiftSelected) {
      this.shiftSelected.StartDTG = new Date(this.shiftSelected.StartDTG);
      this.shiftSelected.EndDTG = new Date(this.shiftSelected.EndDTG);

      this.lstMemberChild = this.shiftSelected.ShiftScheduleMembers;
    }
  }
}
