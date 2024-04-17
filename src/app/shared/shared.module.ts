import { CommonModule } from '@angular/common';
import {
  HttpClientJsonpModule,
  HttpClientModule
} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SearchPipe } from './pipes/search.pipe';
import { ThemeConstantService } from './services/theme-constant.service';
import { BsDatepickerModule, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';

@NgModule({
  exports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    NzIconModule,
    PerfectScrollbarModule,
    SearchPipe,
    BsDatepickerModule,
  ],
  imports: [
    RouterModule,
    CommonModule,
    NzIconModule,
    NzToolTipModule,
    PerfectScrollbarModule,
    BsDatepickerModule.forRoot(),
  ],
  declarations: [SearchPipe, PrivacyPolicyComponent],
  providers: [
    ThemeConstantService,
  ],
})
export class SharedModule {
  constructor( private bsLocaleService: BsLocaleService){
    this.bsLocaleService.use('vi');//fecha en español, datepicker
  }
}
