import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { error } from 'console';
import { ToastrService } from 'ngx-toastr';
import { ESConst } from 'src/app/e-diary/utils/Const';
import { ResponseTypeES } from 'src/app/e-diary/utils/Enum';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import { AuthModel } from 'src/app/e-diary/models/authentication/AuthModel';
import { AuthService } from 'src/app/e-diary/services/auth.service';
import { Utility } from 'src/app/e-diary/utils/Utility';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/e-diary/services/common.service';

@Component({
  templateUrl: './login.component.html',
})
export class LoginComponent {
  typePassword: boolean = true;
  version?: string;

  loginForm: FormGroup;
  submitted: boolean = false;

  model: AuthModel = {
    Username: '',
    Password: '',
  };

  //#region Dùng để validate
  get f(): { [key: string]: AbstractControl } {
    return this.loginForm!.controls;
  }
  //#endregion

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private commonService: CommonService
  ) {
    this.version = environment.version;
  }

  ngOnInit(): void {
    let authData = JSON.parse(
      Utility.getLocalStorageWithExpiry(ESConst.LocalStorage.Key.AuthData)
    );
    // nếu chưa login thì back về trang đăng nhập
    if (authData) {
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
      this.commonService.gotoPage(returnUrl, false);
    } else {
      this.loginForm = this.formBuilder.group({
        username: [this.model.Username, [Validators.required]],
        password: [this.model.Password, [Validators.required]],
      });
    }
  }

  submitForm(): void {
    this.submitted = true;
    if (this.loginForm?.invalid) {
      let lstErr = [];
      if (this.f.username.invalid && this.f.username.errors.required)
        lstErr.push(`Username không được trống.`);
      if (this.f.password.invalid && this.f.password.errors.required)
        lstErr.push(`Password không được trống.`);
      this.toastr.error(`${lstErr.join('\n')}`, 'Đăng nhập lỗi');

      // this.submitted = false;
      return;
    }

    // cắt lấy tenantCode từ username
    let arrUsernameSplit = this.model.Username.split('_', 2);
    this.model.TenantCode =
      arrUsernameSplit.length > 1 ? arrUsernameSplit[0] : null;

    this.authService.Login(this.model).subscribe(
      (result: ResponseModel) => {
        if (result.Type == ResponseTypeES.Success) {
          // sau khi login thành công, remove các localStorage cũ đi
          localStorage.removeItem(ESConst.LocalStorage.Key.Token);
          localStorage.removeItem(ESConst.LocalStorage.Key.AuthData);

          // lưu các localStorage mới vào
          Utility.setLocalStorageWithExpiry(
            ESConst.LocalStorage.Key.Token,
            result.Data.Token
          );
          Utility.setLocalStorageWithExpiry(
            ESConst.LocalStorage.Key.AuthData,
            JSON.stringify(result.Data)
          );

          // nhảy qua trang Home
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.commonService.gotoPage(returnUrl, false);
        } else {
          console.error(`${result.Exception}`);
          this.toastr.error(`${result.Message}`, 'Đăng nhập lỗi');
          // this.submitted = false;
        }
      },
      (error) => {
        // console.error(error);
        // this.toastr.error(`${error.error.Message}`, 'Đăng nhập lỗi');
        // this.submitted = false;
      }
    );

    // for (const i in this.loginForm.controls) {
    //     this.loginForm.controls[i].markAsDirty();
    //     this.loginForm.controls[i].updateValueAndValidity();
    // }

    // if (true) // nếu đăng nhập thành công
    // {
    //     window.location.href = '/home'
    // }
  }

  ChangeTypeInputPassword() {
    this.typePassword = !this.typePassword;
  }
}
