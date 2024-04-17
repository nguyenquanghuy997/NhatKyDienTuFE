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
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import {
  sysUserFilter,
  sysUserModel,
} from 'src/app/e-diary/models/quan-tri/sysUserModel';
import {
  OrganizationModel,
  OrganizationModelFilter,
} from 'src/app/e-diary/models/quan-tri/OrganizationModel';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { OrganizationService } from 'src/app/e-diary/services/quan-tri/organization.service';
import { UserService } from 'src/app/e-diary/services/quan-tri/user.service';
import {
  FunctionCode,
  NgSelectMessage,
  TypeOrg,
  TypeOrgDescription,
} from 'src/app/e-diary/utils/Enum';
import { ESConst } from 'src/app/e-diary/utils/Const';

@Component({
  selector: 'app-organi-edit',
  templateUrl: './organi-edit.component.html',
  styleUrls: ['./organi-edit.component.css'],
})
export class OrganiEditComponent {
  @Input() lstFunctionCode: string[];
  @Input() functionCode: FunctionCode;
  @Input() model: OrganizationModel = {};

  @Output() onSubmitModal = new EventEmitter();
  @Output() onHideModal = new EventEmitter();
  @Output() onEditModal = new EventEmitter();
  @Output() onDeleteModal = new EventEmitter();

  FunctionCode = FunctionCode;

  popupForm!: FormGroup;
  lstOrgParent: OrganizationModel[] = [];
  lstUser: sysUserModel[] = [];
  ngSelectMessage = NgSelectMessage;
  typeOrg = TypeOrg;
  typeOrgOptions = [];
  typeOrgDescription = TypeOrgDescription;
  get dislayIsActive() {
    return this.model.IsActive ? 'Hoạt động' : 'Không hoạt động';
  }

  //#region Dùng để validate
  get f(): { [key: string]: AbstractControl } {
    return this.popupForm!.controls;
  }
  //#endregion

  DicGenderDesc = ESConst.DicGenderDesc;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private commonService: CommonService,
    private organizationService: OrganizationService
  ) {
    this.typeOrgOptions = Object.keys(this.typeOrg).map((key) => ({
      value: parseInt(key),
      label: this.typeOrgDescription[parseInt(key)],
      disabled: false,
    }));
    this.initForm();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes?.model?.currentValue) {
      this.initData();
    }
  }
  initData() {
    if (
      this.model.OrganizationUsers &&
      this.model.OrganizationUsers.length > 0
    ) {
      let control = <FormArray>this.popupForm.controls.UserLstComponents;
      for (let i = 0; i < this.model.OrganizationUsers.length; i++) {
        control.push(this.createUserComponents());
      }
    }

    if (this.functionCode != FunctionCode.DISPLAY) {
      // danh sách đơn vị
      let organizationModelFilter: OrganizationModelFilter = {
        IsActive: true,
      };
      this.organizationService
        .getListItem(organizationModelFilter)
        .subscribe((res: ResponseModel) => {
          if (this.commonService.checkTypeResponseData(res)) {
            this.lstOrgParent = res.Data;
            this.lstOrgParent = this.lstOrgParent.filter(
              (x) =>
                !(x.Id === this.model.Id) &&
                !`>${x.BreadcrumbId}>`.includes(`>${this.model.Id}>`)
            );
          } else {
            this.toastr.error(`${res.Message}`, 'Lỗi');
          }
        });

      // ds user
      let sysUserFilter: sysUserFilter = {
        IsActive: true,
      };
      this.userService
        .getListItem(sysUserFilter)
        .subscribe((result: ResponseModel) => {
          if (this.commonService.checkTypeResponseData(result)) {
            this.lstUser = result.Data;
          } else {
            this.toastr.error(`${result.Message}`, 'Xóa lỗi');
          }
        });
    }

    this.popupForm.patchValue({
      Name: this.model.Name,
      Note: this.model.Note,
      IsActive: this.model.IsActive,
      ParentId: this.model.ParentId,
      Type: this.model.Type,
      UserLstComponents: this.model.OrganizationUsers,
    });
  }
  get userLst() {
    return this.popupForm.get('UserLstComponents') as FormArray;
  }
  initForm() {
    this.popupForm = this.formBuilder.group({
      Name: ['', [Validators.required, Validators.maxLength(100)]],
      IsActive: [null, [Validators.required]],
      Note: [''],
      ParentId: [null],
      Type: [null, [Validators.required]],
      UserLstComponents: new FormArray([], [this.checkDuplicateUser]),
    });
  }
  createUserComponents() {
    return this.formBuilder.group({
      UserId: [null, [Validators.required]],
      Username: [null],
      StringOfBirth: [null],
      GenderName: [null],
    });
  }
  checkDuplicateUser(array: FormArray) {
    if (array.controls.length < 2) return null;
    let userIds = [];
    array.controls.forEach((element: FormGroup) => {
      userIds.push(element.controls.UserId.value);
    });
    userIds = userIds.filter((e) => e !== 0 && e);
    return new Set(userIds).size !== userIds.length
      ? { duplicate: true }
      : null;
  }
  HideModal() {
    ($('#OrgModal') as any).modal('hide');
  }

  ShowModal() {
    ($('#OrgModal') as any).modal('show');
    this.initForm();
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
    this.model.Type = this.popupForm.controls.Type.value;
    this.model.Note = this.popupForm.controls.Note.value;
    this.model.ParentId = this.popupForm.controls.ParentId.value;
    this.model.IsActive = this.popupForm.controls.IsActive.value;
    this.model.OrganizationUsers =
      this.popupForm.controls.UserLstComponents.value;
    // chuyển ra ngoài để thực hiện Create/Edit
    this.onSubmitModal.emit(this.model);
  }

  onEdit() {
    // chuyển trạng thái của modal chứ không cần làm gì nữa
    this.onEditModal.emit(this.model.Id);
    // this.functionCode = FunctionCode.EDIT;
  }

  onDelete() {
    // chuyển ra ngoài ds để dùng chung function delete tại đó
    this.onDeleteModal.emit(this.model);
  }

  onAddUserComponent() {
    this.userLst.markAllAsTouched();
    // if (this.userLst.controls.some((p) => p.invalid)) {
    //   return;
    // }
    let item = this.createUserComponents();
    let arrayControl = <FormArray>this.popupForm.controls.UserLstComponents;
    arrayControl.push(item);
  }

  onDeleteUserComponent(index: number) {
    let control = <FormArray>this.popupForm.controls.UserLstComponents;
    control.removeAt(index);
  }

  onSelectChangeOrg(event: any) {
    if (event === undefined) return;
    if (event.ParentId != null && parseInt(event.ParentId) > 0) {
      this.typeOrgOptions = null;
      this.typeOrgOptions = Object.keys(this.typeOrg).map((key) => ({
        value: parseInt(key),
        label: this.typeOrgDescription[parseInt(key)],
        disabled: parseInt(key) == 1 ? true : false,
      }));
    } else {
      this.typeOrgOptions = Object.keys(this.typeOrg).map((key) => ({
        value: parseInt(key),
        label: this.typeOrgDescription[parseInt(key)],
        disabled: false,
      }));
    }
  }

  onSelectChangeTypeOrg(typeOrg: any) {
    if (typeOrg === undefined) return;
  }

  onchangeSelectUser(rowIndex: number, event: any) {
    if (event === undefined || event == null) return;
    // Lấy FormGroup tại index
    const formGroupToUpdate = this.userLst.at(rowIndex) as FormGroup;
    // Cập nhật giá trị của FormGroup
    let userId = event;
    let UserObj = this.lstUser.find((x) => x.Id == userId);
    if (formGroupToUpdate && UserObj) {
      formGroupToUpdate.patchValue({
        Username: UserObj.Username,
        StringOfBirth:
          UserObj?.DateOfBirth != '' && UserObj?.DateOfBirth != null
            ? moment(UserObj?.DateOfBirth).format('DD/MM/YYYY')
            : '',
        GenderName: this.DicGenderDesc.get(UserObj?.Gender),
      });
    }
  }

  onClearSelectUser(index: number, event) {
    const formGroupToUpdate = this.userLst.at(index) as FormGroup;
    if (formGroupToUpdate) {
      formGroupToUpdate.patchValue({
        Username: '',
        StringOfBirth: '',
        GenderName: '',
      });
    }
  }
}
