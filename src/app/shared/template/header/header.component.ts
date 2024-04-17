import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import { AuthModel } from 'src/app/e-diary/models/authentication/AuthModel';
import { AuthService } from 'src/app/e-diary/services/auth.service';
import { NotifcationService } from 'src/app/e-diary/services/quan-tri/notification.service';
import { ESConst } from 'src/app/e-diary/utils/Const';
import { Utility } from 'src/app/e-diary/utils/Utility';
import { ThemeConstantService } from '../../services/theme-constant.service';
import { CommonService } from 'src/app/e-diary/services/common.service';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  searchVisible: boolean = false;
  quickViewVisible: boolean = false;
  isFolded: boolean;
  isExpand: boolean;
  loading: boolean;
  authData: AuthModel = {};
  notificationList: any[] = [];
  constructor(
    private themeService: ThemeConstantService,
    private notificationService: NotifcationService,
    private authService: AuthService,
    private toastr: ToastrService,
    public router: Router,
    private commonService: CommonService
  ) {
    // Lấy thông tin xác thực khi đăng nhập
    this.authData = JSON.parse(
      Utility.getLocalStorageWithExpiry(ESConst.LocalStorage.Key.AuthData)
    );
    // nếu chưa login thì back về trang đăng nhập
    if (!this.authData) {
      this.commonService.gotoLoginPage(this.router.url);
    }
  }

  ngOnInit(): void {
    this.themeService.isMenuFoldedChanges.subscribe(
      (isFolded) => (this.isFolded = isFolded)
    );
    this.themeService.isExpandChanges.subscribe(
      (isExpand) => (this.isExpand = isExpand)
    );
  }

  toggleFold() {
    this.isFolded = !this.isFolded;
    this.themeService.toggleFold(this.isFolded);
  }

  toggleExpand() {
    this.isFolded = false;
    this.isExpand = !this.isExpand;
    this.themeService.toggleExpand(this.isExpand);
    this.themeService.toggleFold(this.isFolded);
  }

  searchToggle(): void {
    this.searchVisible = !this.searchVisible;
  }

  quickViewToggle(): void {
    this.quickViewVisible = !this.quickViewVisible;
  }

  GetNotification() {
    this.loading = true;
    this.notificationService
      .getPagingItem({ PageIndex: 1, PageSize: this.GetNumberNotification() })
      .subscribe(
        (result: ResponseModel) => {
          if (this.commonService.checkTypeResponseData(result)) {
            this.notificationList = result.Data.Items.map((item) => {
              item.icon = 'mail';
              item.color = 'blue';
              return item;
            });
            $('#numberNoti').text('').hide();
          } else {
            this.toastr.error(`${result.Message}`, 'Lỗi');
          }
          this.loading = false;
        },
        (error) => {
          this.loading = false;
        }
      );
  }

  GetNumberNotification(): number {
    let number = $('#numberNoti').text();
    if (+number > 5) return number;
    return 5;
  }

  onLogout() {
    // let authData = JSON.parse(Utility.getLocalStorageWithExpiry(ESConst.LocalStorage.Key.AuthData))
    this.authService
      .Logout(this.authData)
      .subscribe((result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          localStorage.removeItem(ESConst.LocalStorage.Key.Token);
          localStorage.removeItem(ESConst.LocalStorage.Key.AuthData);
          localStorage.removeItem(ESConst.LocalStorage.Key.DataMenu);
          // logout thì nhảy về trang login, ko đính kèm url
          this.commonService.gotoLoginPage();
        } else {
          this.toastr.error(`${result.Message}`, 'Đăng xuất lỗi');
        }
      });
  }
}
