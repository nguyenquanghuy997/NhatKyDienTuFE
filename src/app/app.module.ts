import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

// import { NgZorroAntdModule } from './ng-zorro-antd.module';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { NZ_ICONS } from 'ng-zorro-antd/icon';

import { ToastrModule } from 'ngx-toastr';

import {
  DatePipe,
  LocationStrategy,
  PathLocationStrategy
} from '@angular/common';

import { NgChartjsModule } from 'ng-chartjs';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './e-diary/components/dashboard/home/home.component';
import { CommonService } from './e-diary/services/common.service';
import { CommonLayoutComponent } from './layouts/common-layout/common-layout.component';
import { FullLayoutComponent } from './layouts/full-layout/full-layout.component';
import { JwtInterceptor } from './shared/interceptor/token.interceptor';
import { ThemeConstantService } from './shared/services/theme-constant.service';
import { SharedModule } from './shared/shared.module';
import { TemplateModule } from './shared/template/template.module';
import { LineBreakPipe } from './utils/lineBreak.pipe';

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(
  (key) => antDesignIcons[key]
);
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,

    //Enlink
    CommonLayoutComponent,
    FullLayoutComponent,
    LineBreakPipe,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
    ]),
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    ModalModule.forRoot(),
    ReactiveFormsModule,
    //Enlink
    AppRoutingModule,
    TemplateModule,
    SharedModule,
    NgChartjsModule,
    NzDatePickerModule,
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    { provide: NZ_ICONS, useValue: icons },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    //Enlink
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy,
    },

    ThemeConstantService,
    CommonService,
    DatePipe,
  ],
  bootstrap: [AppComponent],
  exports: [LineBreakPipe],
})
export class AppModule {}
