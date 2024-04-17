import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FeatureModel } from 'src/app/e-diary/models/cau-hinh/FeatureModel';
import { ThemeConstantService } from 'src/app/shared/services/theme-constant.service';

@Component({
  selector: 'app-item-menu',
  templateUrl: './item-menu.component.html',
  styleUrls: ['./item-menu.component.scss'],
})
export class ItemMenuComponent {
  @Input() menuItems: FeatureModel[];
  isExpand: boolean;
  isFolded: boolean;

  constructor(
    private themeService: ThemeConstantService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.themeService.isMenuFoldedChanges.subscribe(
      (isFolded) => (this.isFolded = isFolded)
    );
    this.themeService.isExpandChanges.subscribe(
      (isExpand) => (this.isExpand = isExpand)
    );
    setTimeout(() => {
      $('.nav-item.alone.active').closest('.dropdown').addClass('open');
    }, 100);
  }

  checkHiddenMenuOnMobile(): void {
    if (window.innerWidth < 992) {
      this.isFolded = false;
      this.isExpand = !this.isExpand;
      this.themeService.toggleExpand(this.isExpand);
      this.themeService.toggleFold(this.isFolded);
    }
  }
}
