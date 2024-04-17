import { Component, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { sysUserChangePassModel } from '../../../../models/quan-tri/sysUserModel';
import { sysUserFilter } from '../../../../models/quan-tri/sysUserModel';
import { sysUserModel } from '../../../../models/quan-tri/sysUserModel';
import { ToastrService } from 'ngx-toastr';
import { PagingModel } from 'src/app/e-diary/models/Commons/PagingModel';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { FunctionCode, ResponseTypeES } from 'src/app/e-diary/utils/Enum';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import { UserModalComponent } from '../user-modal/user-modal.component';
import { FormControl, FormGroup } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import * as moment from 'moment';
import { Utility } from 'src/app/e-diary/utils/Utility';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { UserService } from 'src/app/e-diary/services/quan-tri/user.service';
import { DatePipe } from '@angular/common';
import { UserModalViewSecretkeyComponent } from '../user-modal-view-secretkey/user-modal-view-secretkey.component';
import { RoleModel } from 'src/app/e-diary/models/quan-tri/RoleModel';
import { DeleteModel } from 'src/app/e-diary/models/Commons/DeleteModel';
import { UserModalChangePassComponent } from '../user-modal-change-pass/user-modal-change-pass.component';
import { ESConst } from 'src/app/e-diary/utils/Const';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnDestroy, OnInit {
  listAccount: sysUserModel[] = [];
  searchUsername: string = '';
  searchStatus?: boolean | null = null;
  respone: sysUserModel = {
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
  responePAWD: sysUserChangePassModel = {
    Id: 0,
    Username: '',
    OldPassword: '',
    NewPassword: '',
    ReNewPassword: '',
  };
  crud: string = 'Create';
  showpopupCRUD: boolean = false;
  showpopupPAWD: boolean = false;
  showpopup: boolean = false;

  loading = true;
  pageIndex: number = 1;
  totalItem: number = 0;
  pageSize: number = 10;
  tableSizes: any = [10, 15, 20];
  pageCount: number[] = [];

  functionCode?: FunctionCode = null;
  lstFunctionCode: string[];
  lstFunctionCodePopup: string[];
  FunctionCode = FunctionCode;
  searchForm!: FormGroup;
  bsConfig: Partial<BsDatepickerConfig>;

  lstRoleSearch: RoleModel[] = [];

  @ViewChild('popup') popup: UserModalComponent;
  @ViewChild('popupChangePass') popupChangePass: UserModalChangePassComponent;
  @ViewChild('popupViewSecret')
  popupViewSecret: UserModalViewSecretkeyComponent;
  DicGenderDesc = ESConst.DicGenderDesc;

  constructor(
    private userService: UserService,
    public toastr: ToastrService,
    private commonService: CommonService,
    public router: Router,
    private route: ActivatedRoute,
    private title: Title,
    public datepipe: DatePipe
  ) {
    this.searchForm = new FormGroup({
      searchUsername: new FormControl(''),
      searchName: new FormControl(''),
      searchCode: new FormControl(''),
      searchStatus: new FormControl(null),
      genderSearch: new FormControl(null),
      rangeDate: new FormControl(),
      RoleId: new FormControl(null),
    });
    this.bsConfig = {
      rangeInputFormat: 'DD/MM/YYYY',
      dateInputFormat: 'DD/MM/YYYY',
      showWeekNumbers: false,
      isAnimated: true,
    };

    // Lấy thông tin setup
    this.userService.getDataSetupFormView().subscribe(
      (result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.lstRoleSearch = result.Data.Roles;
        } else {
          console.error(result.Exception);
          this.toastr.error(`${result.Message}`, 'Lỗi');
        }
      },
      (error) => {
        this.loading = false;
        if (error.status === HttpStatusCode.MethodNotAllowed)
          this.lstFunctionCode = error.error.FunctionCodes;
      }
    );
  }

  ngOnInit(): void {
    this.title.setTitle(this.route.snapshot.data.title);
    const currentDate = new Date();
    const startDateDefault = new Date(
      currentDate.getTime() - 10 * 24 * 60 * 60 * 1000
    );
    this.onSearch();
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy');
  }

  onSearch() {
    this.getData(1);
  }

  getData(pageIndex: number) {
    this.loading = true;
    this.pageIndex = pageIndex;
    var dateFrom: Date;
    var dateTo: Date;
    if (
      this.searchForm.get('rangeDate').value &&
      this.searchForm.get('rangeDate').value[0] != null &&
      this.searchForm.get('rangeDate').value[1] != null
    ) {
      dateFrom = new Date(
        Utility.fncOffsetTimeUtc(this.searchForm.get('rangeDate').value[0])
      );
      dateTo = new Date(
        Utility.fncOffsetTimeUtc(this.searchForm.get('rangeDate').value[1])
      );
    }

    let sysUserFilter: sysUserFilter = {
      PageIndex: this.pageIndex,
      PageSize: this.pageSize,
      IsActive:
        this.searchForm.value.searchStatus == 'null'
          ? null
          : this.searchForm.value.searchStatus,
      Username: this.searchForm.value.searchUsername,
      Name: this.searchForm.value.searchName,
      Gender:
        this.searchForm.value.genderSearch == 'null'
          ? null
          : this.searchForm.value.genderSearch,
      fromDate: dateFrom,
      toDate: dateTo,
      RoleId:
        this.searchForm.value.RoleId == 'null'
          ? null
          : this.searchForm.value.RoleId,
    };

    this.loading = true;

    this.userService.getPagingItem(sysUserFilter).subscribe(
      (res: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(res)) {
          this.listAccount = res.Data.Items;
          this.totalItem = res.Data.TotalRecords;
          this.pageCount = new Array(res.Data.PageCount);
          this.lstFunctionCodePopup = res.FunctionCodes;
        } else {
          console.error(res.Exception);
          this.toastr.error(`${res.Message}`, 'Lỗi');
        }
        this.lstFunctionCode = res.FunctionCodes;

        this.loading = false;
      },
      (error) => {
        this.loading = false;
        if (error.status === HttpStatusCode.MethodNotAllowed)
          this.lstFunctionCode = error.error.FunctionCodes;
      }
    );
  }

  changePagination(pagingConfig: PagingModel) {
    this.pageSize = pagingConfig.PageSize;
    this.getData(pagingConfig.PageIndex);
  }

  onOpenModalCreate() {
    this.crud = 'Create';
    this.showpopupCRUD = true;

    this.showpopup = true;
    this.functionCode = FunctionCode.CREATE;
    this.lstFunctionCodePopup = this.lstFunctionCode;
    this.popup.initPopup(0, null);
    this.respone = {
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
    this.popup.ShowModal();
    $('body').on('shown.bs.modal', '#UserModal', function () {
      $('input:visible:enabled:first', this).focus();
    });
  }

  onOpenModalUpdate(id: number) {
    this.crud = 'Update';
    this.loading = true;
    this.userService.getItemEditById(id).subscribe(
      (result: ResponseModel) => {
        if (!this.commonService.checkTypeResponseData(result)) {
          console.error(result.Exception);
          this.toastr.error(`${result.Message}`, 'Lỗi');
          this.loading = false;
          return;
        }
        this.lstFunctionCodePopup = result.FunctionCodes;
        if (!result.FunctionCodes.includes(FunctionCode.EDIT)) {
          this.loading = false;
          this.toastr.error(
            `Không có quyền cập nhật bản ghi`,
            'Không có quyền!'
          );
          return;
        }

        this.respone = result.Data;
        this.popup.initPopup(id, result.Data);
        this.functionCode = FunctionCode.EDIT;
        this.showpopupCRUD = true;
        this.showpopup = true;
        this.popup.ShowModal();
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
    $('body').on('shown.bs.modal', '#UserModal', function () {
      $('input:visible:enabled:first', this).focus();
    });
  }

  onOpenModalDisplay(id: number) {
    this.loading = true;
    this.userService.getItemById(id).subscribe(
      (result: ResponseModel) => {
        if (!this.commonService.checkTypeResponseData(result)) {
          console.error(result.Exception);
          this.toastr.error(`${result.Message}`, 'Lỗi');
          this.loading = false;
          return;
        }
        this.lstFunctionCodePopup = result.FunctionCodes;
        if (!result.FunctionCodes.includes(FunctionCode.DISPLAY)) {
          this.loading = false;
          this.toastr.error(
            `Không có quyền xem chi tiết bản ghi`,
            'Không có quyền!'
          );
          return;
        }
        this.functionCode = FunctionCode.DISPLAY;
        this.showpopup = true;
        this.respone = result.Data;
        this.respone.DateOfBirth = result.Data.DateOfBirth
          ? moment(result.Data.DateOfBirth).format('DD-MM-YYYY')
          : null;
        this.popup.ShowModal();
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  onConfirmDel(model: sysUserModel, callback: UserModalComponent) {
    this.commonService
      .confirm(
        'Xác nhận',
        'Bạn chắc chắn muốn xóa người dùng: ' + model.Name + ' này?',
        ['Có', 'Không']
      )
      .subscribe((answer) => {
        if (answer) {
          this.onDelete(model, callback);
        }
      });
  }

  onOpenModalChangePass(id: number) {
    this.loading = true;
    this.showpopupPAWD = true;
    this.userService.getItemEditById(id).subscribe(
      (result: ResponseModel) => {
        if (!this.commonService.checkTypeResponseData(result)) {
          console.error(result.Exception);
          this.toastr.error(`${result.Message}`, 'Lỗi');
          this.loading = false;
          return;
        }
        this.lstFunctionCodePopup = result.FunctionCodes;
        if (!result.FunctionCodes.includes(FunctionCode.EDIT)) {
          this.loading = false;
          this.toastr.error(
            `Không có quyền cập nhật bản ghi`,
            'Không có quyền!'
          );
          return;
        }

        this.popupChangePass.ShowModal();
        this.responePAWD = {
          Id: result.Data.Id,
          Username: result.Data.Username,
          OldPassword: '',
          NewPassword: '',
          ReNewPassword: '',
        };
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  // submitModalCRUD(model: sysUserModel) {
  //   if (this.crud == 'Create') {
  //     this.onInsert(model);
  //   } else {
  //     this.onUpdate(model);
  //   }
  // }

  // hideModalCRUD() {
  //   this.showpopupCRUD = false;
  // }

  submitModalPAWD(model: sysUserChangePassModel) {
    this.onChangePassword(model);
  }

  hideModalPAWD() {
    this.showpopupPAWD = false;
  }

  onInsert(model: sysUserModel) {
    this.userService.addnewItem(model).subscribe(
      (result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.toastr.success('Thêm mới thành công!', 'Thành công');
          this.popup.HideModal();
          this.showpopup = false;

          this.getData(this.pageIndex);
          // this.showpopupCRUD = false;
        } else {
          console.error(result.Exception);
          this.toastr.error(`${result.Message}`, 'Thêm mới lỗi');
        }
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  onUpdate(model: sysUserModel) {
    this.userService.updateItem(model).subscribe(
      (result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.toastr.success('Cập nhật thành công!', 'Thành công');
          this.popup.HideModal();

          this.getData(this.pageIndex);
          // this.showpopupCRUD = false;
        } else {
          console.error(result.Exception);
          this.toastr.error(`${result.Message}`, 'Cập nhật lỗi');
        }
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  onDelete(model: sysUserModel, callback: UserModalComponent) {
    this.loading = true;
    let { Id, Version } = model;
    let itemDel: DeleteModel = { Id, Version };
    this.userService.deleteItem(itemDel).subscribe(
      (result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.toastr.success('Đã xóa thành công!', 'Thành công');
          this.getData(1);
          if (callback) callback.HideModal();
        } else {
          console.error(result.Exception);
          this.toastr.error(`${result.Message}`, 'Xóa lỗi');
        }
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  onChangePassword(model: sysUserChangePassModel) {
    this.loading = true;
    this.userService.changePassword(model).subscribe(
      (result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.popupChangePass.Hide();
          this.toastr.success('Đổi mật khẩu thành công!', 'Thành công');
          this.showpopupPAWD = false;
        } else {
          console.error(result.Exception);
          this.toastr.error(`${result.Message}`, 'Xóa lỗi');
        }
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  //
  onSubmitModal(item: sysUserModel) {
    this.loading = true;
    if (this.functionCode == FunctionCode.CREATE) {
      this.onInsert(item);
    } else if (this.functionCode == FunctionCode.EDIT) {
      this.onUpdate(item);
    }
  }

  onHideModal() {
    this.showpopupCRUD = false;
    this.lstFunctionCodePopup = [];
  }
  onEditModal(id: number) {
    this.onOpenModalUpdate(id);
  }
  onDeleteModal(item: sysUserModel) {
    this.onConfirmDel(item, this.popup);
  }

  onOpenModalViewSecret(item: sysUserModel) {
    this.respone = item;
    this.popupViewSecret.LoadData(item.Id);
    this.popupViewSecret.ShowModal();
  }
}
