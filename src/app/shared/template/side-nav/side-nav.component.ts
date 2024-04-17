import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import { FeatureService } from 'src/app/e-diary/services/cau-hinh/feature.service';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { ESConst } from 'src/app/e-diary/utils/Const';
import { ThemeConstantService } from '../../services/theme-constant.service';
import { FeatureModel } from 'src/app/e-diary/models/cau-hinh/FeatureModel';

@Component({
  selector: 'app-sidenav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent {
  @Output() callGetBreadCrumbs = new EventEmitter;
  public menuItems: FeatureModel[];
  isFolded: boolean;
  isSideNavDark: boolean;
  isExpand: boolean;

  constructor(
    private themeService: ThemeConstantService,
    private featureService: FeatureService,
    private commonService: CommonService,
    private toastr: ToastrService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.getMenuData();
    this.themeService.isMenuFoldedChanges.subscribe(
      (isFolded) => (this.isFolded = isFolded)
    );
    this.themeService.isExpandChanges.subscribe(
      (isExpand) => (this.isExpand = isExpand)
    );
    this.themeService.isSideNavDarkChanges.subscribe(
      (isDark) => (this.isSideNavDark = isDark)
    );
  }

  getMenuData() {
    let dataMenuLocal = localStorage.getItem(ESConst.LocalStorage.Key.DataMenu);
    if (dataMenuLocal) {
      this.menuItems = JSON.parse(dataMenuLocal);
      return;
    }
    this.featureService.getAllListItemBuildMenu().subscribe(
      (res: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(res)) {
          this.menuItems = res.Data;
          localStorage.setItem(
            ESConst.LocalStorage.Key.DataMenu,
            JSON.stringify(res.Data)
          );
          this.callGetBreadCrumbs.emit();
        } else {
          this.toastr.error(`${res.Message}`, 'Lỗi');
        }
      }
    );
  }
}
