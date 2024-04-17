import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import { sysUserModel } from 'src/app/e-diary/models/quan-tri/sysUserModel';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { UserService } from 'src/app/e-diary/services/quan-tri/user.service';
import { FunctionCode } from 'src/app/e-diary/utils/Enum';
import { Utility } from 'src/app/e-diary/utils/Utility';

@Component({
  selector: 'app-user-modal-view-secretkey',
  templateUrl: './user-modal-view-secretkey.component.html',
  styleUrls: ['./user-modal-view-secretkey.component.css'],
})
export class UserModalViewSecretkeyComponent {
  @Input() model: sysUserModel;

  lstFunctionCode: string[];

  FunctionCode = FunctionCode;

  secretKey?: string;

  isShow: boolean = false;

  constructor(
    private userService: UserService,
    public commonService: CommonService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.isShow = false;
  }

  LoadData(userId?: number) {
    // lấy thông tin bí mật của người dùng
    this.userService
      .getSecretKeyById(userId ?? this.model.Id)
      .subscribe((res: ResponseModel) => {
        this.lstFunctionCode = res.FunctionCodes;
        if (this.commonService.checkTypeResponseData(res)) {
          this.secretKey = res.Data;
        } else {
          this.toastr.error(`${res.Message}`, 'Lỗi');
        }
      });
  }

  HideModal() {
    ($('#myModalViewSecret') as any).modal('hide');
  }

  ShowModal() {
    ($('#myModalViewSecret') as any).modal('show');
  }

  ClearData() {
    this.secretKey = '';
  }

  onHide() {
    this.ClearData();
    this.HideModal();
  }

  onMouseDownShowInfo() {
    this.isShow = true;
  }
  onMouseUpHideInfo() {
    this.isShow = false;
  }
  onMouseOutHideInfo() {
    this.isShow = false;
  }
}
