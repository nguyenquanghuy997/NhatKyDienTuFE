import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, startWith } from 'rxjs/operators';
import { ESConst } from 'src/app/e-diary/utils/Const';
import { Utility } from 'src/app/e-diary/utils/Utility';
import { IBreadcrumb } from '../../shared/interfaces/breadcrumb.type';
import { ThemeConstantService } from '../../shared/services/theme-constant.service';
import { NotifcationService } from 'src/app/e-diary/services/quan-tri/notification.service';
import { ProcessFormService } from 'src/app/e-diary/services/dynamic-process/process-form.service';
import { ToastrService } from 'ngx-toastr';
import { FeatureService } from 'src/app/e-diary/services/cau-hinh/feature.service';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import { CommonService } from 'src/app/e-diary/services/common.service';

@Component({
  selector: 'app-common-layout',
  templateUrl: './common-layout.component.html',
})
export class CommonLayoutComponent {
  currentMenu$: Observable<string>;
  dataMenuOrigin: any[] = [];
  dataMenu: any[] = [];
  breadcrumbs: any[] = [];
  contentHeaderDisplay: string;
  isFolded: boolean = false;
  isSideNavDark: boolean = false;
  isExpand: boolean;
  selectedHeaderColor: string;

  // event xử lý khi click các nút quay lại tiến tới của trình duyệt thì bỏ các class .modal-backdrop của modal
  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    // location.reload()

    $(document).ready(function () {
      // $('.modal').modal('hide') // closes all active pop ups.
      $('.modal-backdrop').remove(); // removes the grey overlay.
    });
  }

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private themeService: ThemeConstantService,
    private notifcationService: NotifcationService,
    private commonService: CommonService
  ) {
    // Lấy thông tin xác thực khi đăng nhập
    let authData = JSON.parse(
      Utility.getLocalStorageWithExpiry(ESConst.LocalStorage.Key.AuthData)
    );
    // nếu chưa login thì back về trang đăng nhập
    if (!authData) {
      this.commonService.gotoLoginPage(this.router.url);
    }

    this.notifcationService.ProcessNotification();

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let child = this.activatedRoute.firstChild;
          while (child) {
            if (child.firstChild) {
              child = child.firstChild;
            } else if (
              child.snapshot.data &&
              child.snapshot.data['headerDisplay']
            ) {
              return child.snapshot.data['headerDisplay'];
            } else {
              return null;
            }
          }
          return null;
        })
      )
      .subscribe((data: any) => {
        this.contentHeaderDisplay = data;
        this.getBreadCrumbs();
      });
  }

  ngOnInit() {
    this.currentMenu$ = this.router.events.pipe(
      startWith(new NavigationEnd(0, '/', '/')),
      filter((event) => event instanceof NavigationEnd),
      distinctUntilChanged(),
      map((data) => this.getCurrentRouteMenu(this.activatedRoute.root))
    );
    this.themeService.isMenuFoldedChanges.subscribe(
      (isFolded) => (this.isFolded = isFolded)
    );
    this.themeService.isSideNavDarkChanges.subscribe(
      (isDark) => (this.isSideNavDark = isDark)
    );
    this.themeService.selectedHeaderColor.subscribe(
      (color) => (this.selectedHeaderColor = color)
    );
    this.themeService.isExpandChanges.subscribe(
      (isExpand) => (this.isExpand = isExpand)
    );
  }

  getBreadCrumbs() {
    let dataMenuLocal = localStorage.getItem(ESConst.LocalStorage.Key.DataMenu);
    if (!dataMenuLocal) return;
    this.dataMenuOrigin = JSON.parse(dataMenuLocal);
    this.dataMenu = this.flattenArray(this.dataMenuOrigin);
    this.processBreadcrumbs();
  }

  flattenArray = (array) =>
    array.flatMap(({ Id, Name, Url, ParentId, SubFeature }) => [
      { Id, Name, Url, ParentId },
      ...this.flattenArray(SubFeature || []),
    ]);

  findMenu(id) {
    let menu = [];
    if (!id) return menu;

    let item = this.dataMenu.filter((x) => x.Id === id)[0];
    menu.push(item);
    if (item.ParentId) {
      menu = menu.concat(this.findMenu(item.ParentId));
    }
    return menu;
  }

  getCurrentRouteMenu(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: IBreadcrumb[] = []
  ): string {
    let label = '',
      path = '/';

    if (route.routeConfig) {
      if (route.routeConfig.data) {
        label = route.routeConfig.data['subTitle'];
        path += route.routeConfig.path;
      }
    } else {
      label = 'Dashboard';
      path += 'dashboard';
    }

    const nextUrl = path && path !== '/dashboard' ? `${url}${path}` : url;
    const breadcrumb = <IBreadcrumb>{
      label: label,
      url: nextUrl,
    };

    if (!route.firstChild) return breadcrumb.label ?? '';
    return this.getCurrentRouteMenu(route.firstChild, nextUrl, breadcrumbs);
  }

  processBreadcrumbs() {
    let [path] = this.router.url.split('?');
    let currentMenu = this.dataMenu.filter(
      (x) =>
        x.Url.split('/')[0] === path.split('/')[1] &&
        x.Url.split('/')[1] === path.split('/')[2]
    );

    if (currentMenu.length > 1 && path.split('/')[3]) {
      currentMenu = currentMenu.filter(
        (x) => x.Url.split('/')[2] === path.split('/')[3]
      );
    }

    this.breadcrumbs = this.findMenu(currentMenu[0]?.Id);
    if (currentMenu[0]?.Url === 'home') {
      return;
    }
    this.breadcrumbs.push(this.dataMenu.find((x) => x.Url === 'home'));
    this.breadcrumbs.reverse();
  }
}
