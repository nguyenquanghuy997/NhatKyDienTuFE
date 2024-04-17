import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormGroup,
  AbstractControl,
  FormArray,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import { ShiftCategoryModel } from 'src/app/e-diary/models/danh-muc/ShiftCategoryModel';
import {
  SysProcessFormDeliveyModel,
  SysProcessMemberModel,
} from 'src/app/e-diary/models/nhat-ky-van-hanh/SysProcessFormDeliveryModel';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { UserService } from 'src/app/e-diary/services/quan-tri/user.service';
import {
  FunctionCode,
  NgSelectMessage,
  StatusDutyShift,
} from 'src/app/e-diary/utils/Enum';
import {
  sysUserFilter,
  sysUserModel,
} from 'src/app/e-diary/models/quan-tri/sysUserModel';
import { RefTypeModel } from 'src/app/e-diary/models/cau-hinh/RefTypeModel';
import { ESConst } from 'src/app/e-diary/utils/Const';

@Component({
  selector: 'app-giao-nhan-parent-modal',
  templateUrl: './giao-nhan-parent-modal.component.html',
  styleUrls: ['./giao-nhan-parent-modal.component.css'],
})
export class GiaoNhanParentModalComponent {
  @Input() RefTypeModel: RefTypeModel;
  @Input() lstFunctionCode: string[];
  @Input() functionCode: FunctionCode;
  @Input() model: SysProcessFormDeliveyModel = {};

  @Input() lstShiftCategory: ShiftCategoryModel[] = [];

  @Output() onSubmitGiaoNhanModal = new EventEmitter();
  FunctionCode = FunctionCode;
  popupForm!: FormGroup;
  ngSelectMessage = NgSelectMessage;
  lstUser: sysUserModel[] = [];

  DicStatusStyle_OnShiftDuty = ESConst.DicStatusStyle_OnShiftDuty;
  DicStatusDesc_OnShiftDuty = ESConst.DicStatusDesc_OnShiftDuty;
  StatusDutyShift = StatusDutyShift;

  //#region Dùng để validate
  get f(): { [key: string]: AbstractControl } {
    return this.popupForm!.controls;
  }

  get SysShiftMemberCurrentList() {
    return this.popupForm.get('SysShiftMemberCurrentList') as FormArray;
  }

  get SysShiftMemberNextList() {
    return this.popupForm.get('SysShiftMemberNextList') as FormArray;
  }
  //#endregion
  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private userService: UserService,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.resetForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.model?.currentValue || changes?.modelNext?.currentValue) {
      this.initData();
    }
  }

  setupForm() {
    this.resetForm();

    let filter: sysUserFilter = {
      IsActive: true,
      OrganizationId: this.RefTypeModel.OrganizationId,
    };
    this.userService.getListItem(filter).subscribe((result: ResponseModel) => {
      if (this.commonService.checkTypeResponseData(result)) {
        this.lstUser = result.Data;
      } else {
        this.toastr.error(`${result.Message}`, 'Lỗi');
      }
    });
  }

  resetForm() {
    this.popupForm = this.formBuilder.group({
      IdCurr: ['', [Validators.required]],
      RefTypeIdCurr: [''],
      StartDTGCurr: ['', [Validators.required]],
      EndDTGCurr: [''],
      ShiftIdCurr: [null, [Validators.required]],
      NameCurr: [''],
      ShiftNameCurr: [''],
      NoteCurr: [''],
      TimeShiftCurr: [''],
      SysShiftMemberCurrentList: new FormArray([
        this.createMemberShiftCurrent(),
      ]),
      // ca tiếp theo
      Id: [''],
      RefTypeId: [''],
      StartDTG: ['', [Validators.required]],
      EndDTG: [''],
      ShiftId: [null, [Validators.required]],
      Name: [''],
      ShiftName: [''],
      Note: ['', [Validators.maxLength(1000)]],
      TimeShift: [''],
      SysShiftMemberNextList: new FormArray(
        [this.createMemberShiftNext()],
        [this.checkDuplicateValue]
      ),
    });
  }
  createMemberShiftCurrent(member?: SysProcessMemberModel) {
    let form = this.formBuilder.group({
      UserId: ['', [Validators.required]],
      JobTitleId: [''],
      JobTitleName: [''],
      Username: [''],
      User_Name: [''],
      StatusDutyShift: [null],
      TOTP: [''],
    });
    // nếu Đã giao ca thì ko required nhập TOTP nữa
    let tOTPColumnControl = form.get('TOTP');
    if (
      member &&
      member.StatusDutyShift &&
      member.StatusDutyShift != StatusDutyShift.DaGiaoCa
    ) {
      tOTPColumnControl.setValidators([
        Validators.required,
        Validators.maxLength(100),
      ]);
    }
    return form;
  }
  createMemberShiftNext(member?: SysProcessMemberModel) {
    let form = this.formBuilder.group({
      UserId: ['', [Validators.required]],
      JobTitleId: [''],
      ShiftId: [''],
      JobTitleName: [''],
      User_Name: [''],
      RefTypeId: [''],
      StatusDutyShift: [null],
      TOTP: [''],
    });

    // nếu Đã giao ca thì ko required nhập TOTP nữa
    let tOTPColumnControl = form.get('TOTP');
    if (
      member &&
      (!member.StatusDutyShift ||
        member.StatusDutyShift != StatusDutyShift.DaGiaoCa)
    ) {
      tOTPColumnControl.setValidators([
        Validators.required,
        Validators.maxLength(100),
      ]);
    }
    return form;
  }
  initData() {
    // dữ liệu ca hiện tại
    if (this.model.Members && this.model.Members.length > 0) {
      // clear control cũ
      this.SysShiftMemberCurrentList.clear();

      // thực hiện thêm control cho từng member
      for (let i = 0; i < this.model.Members.length; i++) {
        let memberCurr = this.model.Members[i];

        // xác định trạng thái giao nhận ca của người dùng theo ds giao nhận ca của tài liệu
        if (memberCurr && memberCurr.RefTypes) {
          // order ds nghiep vu
          memberCurr.RefTypes = memberCurr.RefTypes.sort(
            (a: RefTypeModel, b: RefTypeModel) => a.Name.localeCompare(b.Name)
          );

          // check neu co nghiep vu cha giao ca thi user do chua gioa ca xong
          let refTypeChuaGiaoCa = memberCurr.RefTypes.find(
            (e) => e.StatusDutyShift != StatusDutyShift.DaGiaoCa
          );
          memberCurr.StatusDutyShift = refTypeChuaGiaoCa
            ? StatusDutyShift.DangNhap
            : StatusDutyShift.DaGiaoCa;
        }

        // push control
        this.SysShiftMemberCurrentList.push(
          this.createMemberShiftCurrent(memberCurr)
        );
      }

      // ca tiếp
      if (
        this.model.ProcessFormNext.Members &&
        this.model.ProcessFormNext.Members.length > 0
      ) {
        // clear control cũ
        this.SysShiftMemberNextList.clear();

        // duyet tung member de insert control
        for (let i = 0; i < this.model.ProcessFormNext.Members.length; i++) {
          let memberNext = this.model.ProcessFormNext.Members[i];

          // xác định trạng thái giao nhận ca của người dùng theo ds giao nhận ca của tài liệu
          if (memberNext && memberNext.RefTypes) {
            // order ds nghiep vu
            memberNext.RefTypes = memberNext.RefTypes.sort(
              (a: RefTypeModel, b: RefTypeModel) => a.Name.localeCompare(b.Name)
            );

            // check neu ca tiep theo all nghiep vu cua user  co trang thai ca thi la da giao ca
            let refTypeChuaGiaoCa = memberNext.RefTypes.find(
              (e) => !Object.values(StatusDutyShift).includes(e.StatusDutyShift)
            );
            memberNext.StatusDutyShift = refTypeChuaGiaoCa
              ? null
              : StatusDutyShift.DaGiaoCa;
          }

          // push control
          this.SysShiftMemberNextList.push(
            this.createMemberShiftNext(memberNext)
          );
        }
      }
      this.popupForm.patchValue({
        // ca hiện tại
        IdCurr: this.model.Id,
        RefTypeIdCurr: this.model.RefTypeId,
        StartDTGCurr: this.model.StartDTG,
        EndDTGCurr: this.model.EndDTG,
        ShiftIdCurr: this.model.ShiftId,
        ShiftNameCurr: this.model.ShiftName,
        SysShiftMemberCurrentList: this.model.Members, // da sort khi tao control roi
        NameCurr: this.model.Name,
        NoteCurr: this.model.Note,

        // ca tiếp theo
        Id: null,
        RefTypeId: this.model.RefTypeId,
        StartDTG: this.model.ProcessFormNext.StartDTG,
        EndDTG: this.model.ProcessFormNext.EndDTG,
        ShiftId: this.model.ProcessFormNext.ShiftId,
        ShiftName: this.model.ProcessFormNext.ShiftName,
        Name: this.model.ProcessFormNext.Name,
        Note: this.model.ProcessFormNext.Note,

        SysShiftMemberNextList: this.model.ProcessFormNext.Members, // da sort khi tao control roi
      });
    }
  }

  HideModal() {
    ($('#GiaoNhanCaModal') as any).modal('hide');
    this.popupForm.reset();
  }

  ShowModal() {
    this.setupForm();

    ($('#GiaoNhanCaModal') as any).modal('show');
  }

  onHide() {
    // chuyển event ra ngoài, thêm xử lý bên ngoài nếu cần
    this.HideModal();
    // this.resetForm();
    this.popupForm.reset();
  }

  onSubmit() {
    if (this.popupForm?.invalid) {
      this.popupForm.markAllAsTouched();
      return;
    }

    let itemSubmit: SysProcessFormDeliveyModel = Object.assign({}, this.model);

    itemSubmit.ProcessFormNext.Note = this.f.Note.value;

    // lấy thông tin ca hiện tại
    this.SysShiftMemberCurrentList.controls.forEach((form: FormGroup) => {
      let jobTitleId = form.controls.JobTitleId.value;
      let member = itemSubmit.Members.find((e) => e.JobTitleId === jobTitleId);
      if (member && member.StatusDutyShift != StatusDutyShift.DaGiaoCa) {
        if (this.RefTypeModel.HasOTP) member.TOTP = form.controls.TOTP.value;
        else member.Password = form.controls.TOTP.value;
      }
    });
    // gán kiểu này mất dữ liệu nếu ko khai báo groupcontrol
    // this.model.Members =
    //   this.popupForm.controls.SysShiftMemberCurrentList.value;

    // lấy thông tin của ca tiếp theo
    this.SysShiftMemberNextList.controls.forEach((form: FormGroup) => {
      let jobTitleId = form.controls.JobTitleId.value;
      let member = itemSubmit.ProcessFormNext.Members.find(
        (e) => e.JobTitleId === jobTitleId
      );
      if (member && member.StatusDutyShift != StatusDutyShift.DaGiaoCa) {
        member.UserId = form.controls.UserId.value;
        if (this.RefTypeModel.HasOTP) member.TOTP = form.controls.TOTP.value;
        else member.Password = form.controls.TOTP.value;
      }
    });

    // chuyển ra ngoài để thực hiện nghiệp vụ tiếp
    this.onSubmitGiaoNhanModal.emit(itemSubmit);
  }

  onChangeSelect(id) {
    if (!id) return;
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
}
