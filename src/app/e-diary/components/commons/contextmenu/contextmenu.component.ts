import {
  Component,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ESConst } from 'src/app/e-diary/utils/Const';
import { EquipmentTagModalComponent } from '../../dashboard/statistic/equipment-tag-modal/equipment-tag-modal.component';

@Component({
  selector: 'app-contextmenu',
  templateUrl: './contextmenu.component.html',
  styleUrls: ['./contextmenu.component.css'],
})
export class ContextmenuComponent {
  @Input() x = 0;
  @Input() y = 0;
  @Input() selectedText: string = null;

  @ViewChild('suggest_equipement_list')
  suggest_equipement_list: EquipmentTagModalComponent;

  constructor(private router: Router) {}
  ngOnInit() {}
  onSearch() {
    // nhảy qua trang Tìm kiếm vs keyword = seletedText
    this.searchWithKeyword(this.selectedText);
  }

  onStatistic() {
    // nhảy qua trang Thống kê vs keyword = seletedText, có chart
    console.log('seletedText', this.selectedText);
    this.onShowSuggestModal();
  }
  searchWithKeyword(keyword: string) {
    this.router.navigate([`Search/nhat-ky`], {
      queryParams: { keyword: keyword },
    });
  }
  onShowSuggestModal() {
    this.suggest_equipement_list.ShowModal();
    this.suggest_equipement_list.initPopup(this.selectedText);
  }
}
