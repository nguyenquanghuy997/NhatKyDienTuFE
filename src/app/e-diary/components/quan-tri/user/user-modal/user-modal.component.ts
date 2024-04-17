import {
  Component,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import { sysUserRoleModel } from '../../../../models/quan-tri/sysUserModel';
import { sysUserModel } from '../../../../models/quan-tri/sysUserModel';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { RoleService } from 'src/app/e-diary/services/quan-tri/role.service';
import {
  RoleModel,
  RoleModelFilter,
} from 'src/app/e-diary/models/quan-tri/RoleModel';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import { FunctionCode, NgSelectMessage } from 'src/app/e-diary/utils/Enum';
import { ToastrService } from 'ngx-toastr';
import { Utility } from 'src/app/e-diary/utils/Utility';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { UserService } from 'src/app/e-diary/services/quan-tri/user.service';
import { ESConst } from 'src/app/e-diary/utils/Const';
import { AuthModel } from 'src/app/e-diary/models/authentication/AuthModel';

declare var $: any;
@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
})
export class UserModalComponent {
  @Input() model: sysUserModel = {
    Id: 0,
    Username: '',
    Password: '',
    RePassword: '',
    Name: '',
    Note: '',
    Gender: 1,
    Email: '',
    DateOfBirth: new Date(), //'2023-01-01',
    StringOfBirth: '', //'01-01-2023',
    IsActive: true,
  };
  lstUserRole: RoleModel[] = [];
  @Input() lstFunctionCode: string[];
  @Input() functionCode: FunctionCode;
  @Output() onSubmitModal = new EventEmitter();
  @Output() onHideModal = new EventEmitter();
  @Output() onEditModal = new EventEmitter();
  @Output() onDeleteModal = new EventEmitter();
  @Input() isVisible = true;

  TenantCode_: string = '';
  TenantCode: string = '';
  RegexUsername: string = '';
  submitted = false;
  reactiveForm: FormGroup;
  FunctionCode = FunctionCode;
  datePickerConfig: Partial<BsDatepickerConfig>;
  myDateValue: Date;
  minDate: Date;
  maxDate: Date;
  ngSelectMessage = NgSelectMessage;
  DicGenderDesc = ESConst.DicGenderDesc;
  get control(): { [key: string]: AbstractControl } {
    return this.reactiveForm!.controls;
  }
  get userRoleForms() {
    return this.control.UserRoles as FormArray;
  }
  constructor(
    private userService: UserService,
    private vaiTroService: RoleService,
    private formBuilder: FormBuilder,
    public datepipe: DatePipe,
    public commonService: CommonService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.minDate = new Date();
    this.maxDate = new Date();
    this.minDate.setFullYear(this.minDate.getFullYear() - 60);
    this.datePickerConfig = {
      dateInputFormat: 'DD/MM/YYYY',
      showWeekNumbers: false,
      isAnimated: true,
      showClearButton: true,
    };

    // Lấy thông tin xác thực khi đăng nhập
    let authData: AuthModel = JSON.parse(
      Utility.getLocalStorageWithExpiry(ESConst.LocalStorage.Key.AuthData)
    );
    // nếu chưa login thì back về trang đăng nhập
    if (!authData) {
      this.commonService.gotoLoginPage(this.router.url);
    } else if (authData.TenantCode) {
      this.TenantCode = authData.TenantCode;
      this.TenantCode_ = `${this.TenantCode}_`;

      let regexTenantCode = [];
      this.TenantCode.split('').forEach((e) => {
        regexTenantCode.push(`${e.toLowerCase()}${e.toUpperCase()}`);
      });
      this.RegexUsername = `^[${regexTenantCode.join(
        ']['
      )}]_[a-zA-Z0-9][a-zA-Z0-9]*`;
    } else {
      this.RegexUsername = `^[a-zA-Z0-9]*`;
    }

    this.reactiveForm = this.formBuilder.group(
      {
        Username: [
          this.model.Username,
          [
            Validators.required,
            Validators.maxLength(100),
            Validators.pattern(this.RegexUsername),
          ],
        ],
        Password: [
          this.model.Password,
          [
            Validators.required,
            Validators.maxLength(100),
            Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/),
          ],
        ],
        RePassword: [
          this.model.RePassword,
          [
            Validators.required,
            Validators.maxLength(100),
            Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/),
          ],
        ],
        Name: [
          this.model.Name,
          [Validators.required, Validators.maxLength(100)],
        ],
        Note: [this.model.Note, [Validators.maxLength(1000)]],
        Gender: [this.model.Gender],
        Email: [this.model.Email],
        DateOfBirth: [this.model.DateOfBirth],
        StringOfBirth: [this.model.StringOfBirth],
        IsActive: [this.model.IsActive, [Validators.required]],
        UserRoles: new FormArray(
          [this.createUserRoleForm()],
          [this.checkUserRoleDuplicateRole]
        ),
      },
      {
        validator: this.confirmedValidator('Password', 'RePassword'),
      }
    );
  }

  initPopup(id: number, item: sysUserModel) {
    this.submitted = false;
    if (item && id > 0) this.model = item;
    else
      this.model = {
        Id: 0,
        EmployeeId: 0,
        Username: '',
        Password: '',
        Note: '',
        IsActive: true,
        IsDeleted: false,
        CreatedUserId: 1,
        Version: 1,
        UserRoles: [],
        DateOfBirth: '',
      };

    if (this.model.DateOfBirth && this.model.DateOfBirth != null) {
      var parsedDate = new Date(
        this.model.DateOfBirth.replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3')
      );
      this.model.StringOfBirth = this.model.DateOfBirth =
        this.datepipe.transform(
          parsedDate, //this.model.DateOfBirth,
          'yyyy-MM-dd'
        );
      this.model.DateOfBirth = this.datepipe.transform(
        parsedDate,
        'dd-MM-yyyy'
      );
    }
    if (id == 0) {
      this.reactiveForm = this.formBuilder.group(
        {
          Username: [
            this.model.Username,
            [
              Validators.required,
              Validators.maxLength(100),
              Validators.pattern(this.RegexUsername),
            ],
          ],
          Password: [
            this.model.Password,
            [
              Validators.required,
              Validators.maxLength(100),
              Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/),
            ],
          ],
          RePassword: [
            this.model.RePassword,
            [
              Validators.required,
              Validators.maxLength(100),
              Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/),
            ],
          ],
          Name: [
            this.model.Name,
            [Validators.required, Validators.maxLength(100)],
          ],
          Note: [this.model.Note, [Validators.maxLength(1000)]],
          Gender: [this.model.Gender],
          Email: [this.model.Email],
          DateOfBirth: [this.model.DateOfBirth],
          StringOfBirth: [this.model.StringOfBirth],
          IsActive: [this.model.IsActive, [Validators.required]],
          UserRoles: new FormArray(
            [this.createUserRoleForm()],
            [this.checkUserRoleDuplicateRole]
          ),
        },
        {
          validator: this.confirmedValidator('Password', 'RePassword'),
        }
      );
    } else {
      this.reactiveForm = this.formBuilder.group({
        Username: [
          this.model.Username,
          [
            Validators.required,
            Validators.maxLength(100),
            Validators.pattern(this.RegexUsername),
          ],
        ],
        Name: [
          this.model.Name,
          [Validators.required, Validators.maxLength(100)],
        ],
        Note: [this.model.Note, [Validators.maxLength(1000)]],
        Gender: [this.model.Gender],
        Email: [this.model.Email],
        DateOfBirth: [this.model.DateOfBirth],
        StringOfBirth: [this.model.StringOfBirth],
        IsActive: [this.model.IsActive, [Validators.required]],
        UserRoles: new FormArray([], [this.checkUserRoleDuplicateRole]),
      });
    }

    // this.reactiveForm.patchValue({
    //   DateOfBirth: new Date(),
    // });
    let filter: RoleModelFilter = { IsActive: true };
    this.vaiTroService
      .getListItem(filter)
      .subscribe((result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.lstUserRole = result.Data;
          setTimeout(() => {
            $('#selectRole').prop('selectedIndex', -1).trigger('change');
          }, 50);
        } else {
          this.toastr.error(`${result.Message}`, 'Xóa lỗi');
        }
      });
  }
  createUserRoleForm() {
    return this.formBuilder.group({
      RoleId: [null, [Validators.required]],
    });
  }
  checkUserRoleDuplicateRole(array: FormArray) {
    if (array.controls.length < 2) return null;
    let roleIds = [];
    array.controls.forEach((element: FormGroup) => {
      if (element.controls.RoleId.value)
        roleIds.push(element.controls.RoleId.value);
    });
    return new Set(roleIds).size !== roleIds.length
      ? { duplicate: true }
      : null;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.model?.currentValue) {
      this.userRoleForms.clear();
      if (!this.model.UserRoles || this.model.UserRoles.length == 0) {
        this.model.UserRoles = [];
        // this.onAddnewRole();
      } else {
        for (let i = 0; i < this.model.UserRoles.length; i++) {
          let form = this.createUserRoleForm();
          this.userRoleForms.push(form);
        }
      }
    }
  }

  onChange(input: any): void {
    this.model.StringOfBirth = input;
  }
  onDateChange(inputDate: any) {
    var date = moment(inputDate);
    // Create date from input value
    var inputDate1 = new Date(inputDate);

    // Get today's date

    var todaysDate = new Date();

    // call setHours to take the time out of the comparison
    // if (inputDate.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0)) {
    //   // Date equals today's date
    // } else if (
    //   inputDate.setHours(0, 0, 0, 0) > todaysDate.setHours(0, 0, 0, 0)
    // ) {
    //   this.toastr.error(`Ngày sinh không được lớn hơn ngày hiện tại`, 'Lỗi');
    // }
    this.model.StringOfBirth = moment(inputDate).format('DD-MM-YYYY');
    // this.model.StringOfBirth = this.datepipe.transform(inputDate, 'dd-MM-yyyy');
    // this.model.StringOfBirth = event;
  }
  confirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl.errors &&
        !matchingControl.errors.confirmedValidator
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  onDeleteRole(index: number) {
    if (this.model.UserRoles) {
      this.model.UserRoles.splice(index, 1);
      this.userRoleForms.removeAt(index);
    }
  }

  onAddnewRole() {
    let maxId =
      this.model.UserRoles && this.model.UserRoles.length > 0
        ? Math.max(...this.model.UserRoles.map((x) => x.Id))
        : 0;
    maxId = (maxId ?? 0) + 1;

    let modelsysUserRole: sysUserRoleModel = {
      Id: maxId,
      RoleId: null,
      RoleName: '',
      UserId: this.model.Id,
    };

    this.model.UserRoles.push(modelsysUserRole);

    // push userRoleForm
    this.userRoleForms.push(this.createUserRoleForm());
  }

  hideModal() {
    this.onHideModal.emit();
    this.isVisible = false;
  }

  ShowModal() {
    ($('#UserModal') as any).modal('show');
  }

  HideModal() {
    this.submitted = false;
    ($('#UserModal') as any).modal('hide');
  }

  onHide() {
    // chuyển event ra ngoài, thêm xử lý bên ngoài nếu cần
    this.onHideModal.emit();
    this.isVisible = false;
    this.HideModal();
  }

  onSubmit() {
    this.submitted = true;
    if (this.reactiveForm?.invalid) {
      return;
    }
    // if (!this.model.UserRoles || this.model.UserRoles.length == 0) {
    //   this.toastr.error(`Danh sách vai trò không được trống`, 'Lỗi');
    //   return;
    // }
    if (this.model.DateOfBirth && this.model.DateOfBirth != null) {
      let date = moment(this.model.DateOfBirth, 'DD/MM/YYYY HH:mm:ss').format(
        'YYYY-MM-DD HH:mm:ss'
      );
      this.model.DateOfBirth = this.datepipe.transform(date, 'yyyy-MM-dd');
    } else {
      this.model.DateOfBirth = null;
    }
    // chuyển ra ngoài để thực hiện Create/Edit
    this.onSubmitModal.emit(this.model);
    this.isVisible = false;
  }

  onConfirmResetPass() {
    this.commonService
      .confirm(
        'Xác nhận',
        'Bạn chắc chắn muốn đặt lại mật khẩu của người dùng: ' +
          this.model.Name +
          ' về mật khẩu mặc định không?',
        ['Có', 'Không']
      )
      .subscribe((answer) => {
        if (answer) {
          this.onResetPass();
        }
      });
  }

  onResetPass() {
    let item: sysUserModel = {
      Id: this.model.Id,
      Version: this.model.Version,
    };
    this.userService.resetPassword(item).subscribe((result) => {
      if (this.commonService.checkTypeResponseData(result)) {
        this.toastr.success('Đã đặt lại mật khẩu thành công!', 'Thành công');
        this.HideModal();
      } else {
        this.toastr.error(`${result.Message}`, 'Lỗi');
      }
    });
  }

  onEdit() {
    // chuyển trạng thái của modal chứ không cần làm gì nữa
    this.onEditModal.emit(this.model.Id);
  }

  onDelete() {
    // chuyển ra ngoài ds để dùng chung function delete tại đó
    this.onDeleteModal.emit(this.model);
    this.isVisible = false;
  }

  isShowPass = false;
  isShowRePass = false;
  onMouseDownShowPass() {
    this.isShowPass = true;
  }
  onMouseUpHidePass() {
    this.isShowPass = false;
  }
  onMouseOutHidePass() {
    this.isShowPass = false;
  }
  onMouseDownShowRePass() {
    this.isShowRePass = true;
  }
  onMouseUpHideRePass() {
    this.isShowRePass = false;
  }
  onMouseOutHideRePass() {
    this.isShowRePass = false;
  }

  get dislayIsActive() {
    return this.model.IsActive ? 'Hoạt động' : 'Không hoạt động';
  }
  get dislayGendeer() {
    let desc = this.DicGenderDesc.get(this.model.Gender);
    return desc;
  }
}
