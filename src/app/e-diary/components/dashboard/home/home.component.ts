import { Component } from '@angular/core';
import { CommonService } from 'src/app/e-diary/services/common.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  constructor(private commonService: CommonService) {
    // trang chủ để tạm là màn hình lịch ca trực
    let url = 'configs/ShiftSchedule';
    commonService.gotoPage(url);
  }
}
