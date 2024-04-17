import { CommonModule, registerLocaleData } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NouisliderModule } from 'ng2-nouislider';
import { SharedModule } from '../shared/shared.module';
import { EDiaryRoutingModule } from './e-diary-routing.module';

// import { NzCardModule } from 'ng-zorro-antd/card';
// import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
// import { NzAvatarModule } from 'ng-zorro-antd/avatar';
// import { NzPaginationModule } from 'ng-zorro-antd/pagination';
// import { NzDividerModule } from 'ng-zorro-antd/divider';
// import { NzButtonModule } from 'ng-zorro-antd/button';
// import { NzListModule } from 'ng-zorro-antd/list';
// import { NzTableModule } from 'ng-zorro-antd/table';
// import { NzRadioModule } from 'ng-zorro-antd/radio';
// import { NzRateModule } from 'ng-zorro-antd/rate';
// import { NzTabsModule } from 'ng-zorro-antd/tabs';
// import { NzTagModule } from 'ng-zorro-antd/tag';
// import { NzFormModule } from 'ng-zorro-antd/form';
// import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
// import { NzSelectModule } from 'ng-zorro-antd/select';
// import { NzSwitchModule } from 'ng-zorro-antd/switch';
// import { NzUploadModule } from 'ng-zorro-antd/upload';
// import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
// import { NzModalModule } from 'ng-zorro-antd/modal';
// import { NzMessageModule } from 'ng-zorro-antd/message';
// import { NzInputModule } from 'ng-zorro-antd/input';
// import { NgZorroAntdModule } from '../ng-zorro-antd.module';

import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { NgxSummernoteModule } from 'ngx-summernote';

import { ConfirmDialogComponent } from '../component/confirm-dialog/confirm-dialog.component';
import { FormAddEditComponent } from './components/cau-hinh/form/form-add-edit/form-add-edit.component';
import { FormDetailComponent } from './components/cau-hinh/form/form-detail/form-detail.component';
import { FormListComponent } from './components/cau-hinh/form/form-list/form-list.component';
import { PaginationComponent } from './components/commons/pagination/pagination.component';
import { TagListComponent } from './components/danh-muc/tag/tag-list/tag-list.component';
import { TagModalComponent } from './components/danh-muc/tag/tag-modal/tag-modal.component';
import { UnitComponent } from './components/danh-muc/unit/unit-list/unit-list.component';
import { UnitModalComponent } from './components/danh-muc/unit/unit-modal/unit-modal.component';
import { TrucCaDetailComponent } from './components/dynamic-process/form-process/truc-ca/truc-ca-detail/truc-ca-detail.component';
import { TrucCaEditComponent } from './components/dynamic-process/form-process/truc-ca/truc-ca-edit/truc-ca-edit.component';
import { TrucCaListComponent } from './components/dynamic-process/form-process/truc-ca/truc-ca-list/truc-ca-list.component';
import { UserListComponent } from './components/quan-tri/user/user-list/user-list.component';
import { UserModalChangePassComponent } from './components/quan-tri/user/user-modal-change-pass/user-modal-change-pass.component';
import { UserModalComponent } from './components/quan-tri/user/user-modal/user-modal.component';

import { FeatureListComponent } from './components/cau-hinh/feature/feature-list/feature-list.component';
import { FeatureModalComponent } from './components/cau-hinh/feature/feature-modal/feature-modal.component';
import { ModalInputComponent } from './components/cau-hinh/form/modal-input/modal-input.component';
import { ReftypeListComponent } from './components/cau-hinh/reftype/reftype-list/reftype-list.component';
import { ReftypeModalComponent } from './components/cau-hinh/reftype/reftype-modal/reftype-modal.component';
import { EquipmentListComponent } from './components/danh-muc/equipment/equipment-list/equipment-list.component';
import { EquipmentModalComponent } from './components/danh-muc/equipment/equipment-modal/equipment-modal.component';
import { FormProcessListComponent } from './components/dynamic-process/form-process/form-process-list/form-process-list.component';

import { NgSelectModule } from '@ng-select/ng-select';
import { NgChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ConfigComponent } from './components/cau-hinh/config/config-list/config.component';
import { ConfigModalComponent } from './components/cau-hinh/config/config-modal/config-modal.component';
import { FlowListComponent } from './components/cau-hinh/flow/flow-list/flow-list.component';
import { FlowModalComponent } from './components/cau-hinh/flow/flow-modal/flow-modal.component';
import { ModalInputEditComponent } from './components/cau-hinh/form/modal-input-edit/modal-input-edit.component';
import { ModalTableEditComponent } from './components/cau-hinh/form/modal-table-edit/modal-table-edit.component';
import { ContextmenuComponent } from './components/commons/contextmenu/contextmenu.component';
import { ErrorPageComponent } from './components/commons/error-page/error-page.component';
import { ChiTietComponent } from './components/dashboard/search/chi-tiet/chi-tiet.component';
import { SearchListComponent } from './components/dashboard/search/search-list/search-list.component';
import { SearchModalComponent } from './components/dashboard/search/search-modal/search-modal.component';
import { EquipmentTagModalComponent } from './components/dashboard/statistic/equipment-tag-modal/equipment-tag-modal.component';
import { IndexStatisticComponent } from './components/dashboard/statistic/index-statistic/index-statistic.component';
import { FlowProcessListComponent } from './components/dynamic-process/flow-process/flow-process-list/flow-process-list.component';
import { FlowProcessModalComponent } from './components/dynamic-process/flow-process/flow-process-modal/flow-process-modal.component';
import { FormProcessAddnewComponent } from './components/dynamic-process/form-process/form-process-addnew/form-process-addnew.component';
import { FormProcessDetailComponent } from './components/dynamic-process/form-process/form-process-detail/form-process-detail.component';
import { FormProcessEditComponent } from './components/dynamic-process/form-process/form-process-edit/form-process-edit.component';
import { FormProcessUserLogTabComponent } from './components/dynamic-process/form-process/form-process-user-log-tab/form-process-user-log-tab.component';
import { PhieuLenhAddnewComponent } from './components/dynamic-process/form-process/phieu-lenh/phieu-lenh-addnew/phieu-lenh-addnew.component';
import { PhieuLenhDetailComponent } from './components/dynamic-process/form-process/phieu-lenh/phieu-lenh-detail/phieu-lenh-detail.component';
import { PhieuLenhEditComponent } from './components/dynamic-process/form-process/phieu-lenh/phieu-lenh-edit/phieu-lenh-edit.component';
import { PhieuLenhListComponent } from './components/dynamic-process/form-process/phieu-lenh/phieu-lenh-list/phieu-lenh-list.component';
import { TrucCaCreateModalComponent } from './components/dynamic-process/form-process/truc-ca/truc-ca-create-modal/truc-ca-create-modal.component';
import { GiaoNhanModalComponent } from './components/dynamic-process/form-process/truc-ca/giao-nhan-modal/giao-nhan-modal.component';
import { FunctionListComponent } from './components/quan-tri/function/function-list/function-list.component';
import { FunctionModalComponent } from './components/quan-tri/function/function-modal/function-modal.component';
import { NotificationComponent } from './components/quan-tri/notification/notification.component';
import { PermissionListComponent } from './components/quan-tri/permission/permission-list/permission-list.component';
import { PermissionTreeComponent } from './components/quan-tri/permission/permission-tree/permission-tree.component';
import { RoleListComponent } from './components/quan-tri/role/role-list/role-list.component';
import { RoleModalComponent } from './components/quan-tri/role/role-modal/role-modal.component';
import { RuleListComponent } from './components/quan-tri/rule/rule-list/rule-list.component';
import { RuleModalComponent } from './components/quan-tri/rule/rule-modal/rule-modal.component';
import { UserLogListComponent } from './components/quan-tri/user-log/user-log-list/user-log-list.component';
import { UserLogModalComponent } from './components/quan-tri/user-log/user-log-modal/user-log-modal.component';

import localeVi from '@angular/common/locales/vi';
import { NgxCleaveDirectiveModule } from 'ngx-cleave-directive';
import { IframeContentComponent } from '../shared/components/iframe-content/iframe-content.component';
import { ShiftScheduleListComponent } from './components/cau-hinh/shift-schedule/shift-schedule-list/shift-schedule-list.component';
import { ShiftScheduleModalComponent } from './components/cau-hinh/shift-schedule/shift-schedule-modal/shift-schedule-modal.component';
import { NodataInfoComponent } from './components/commons/nodata-info/nodata-info.component';
import { JobTitleListComponent } from './components/danh-muc/job-title/job-title-list/job-title-list.component';
import { JobTitleModalComponent } from './components/danh-muc/job-title/job-title-modal/job-title-modal.component';
import { ShiftCategoryListComponent } from './components/danh-muc/shift-category/shift-category-list/shift-category-list.component';
import { ShiftCategoryModalComponent } from './components/danh-muc/shift-category/shift-category-modal/shift-category-modal.component';
import { ShiftEffectivePeriodComponent } from './components/cau-hinh/shift-effective-period/shift-effective-period-list/shift-effective-period-list.component';
import { ShiftEffectivePeriodConfigModalComponent } from './components/cau-hinh/shift-effective-period/shift-effective-period-config-modal/shift-effective-period-config-modal.component';
import { FormProcessUserLogDetailEditedComponent } from './components/dynamic-process/form-process/form-process-user-log-detail-edited/form-process-user-log-detail-edited.component';
import { TrucCaParentAddnewModalComponent } from './components/dynamic-process/form-process/truc-ca-parent/truc-ca-parent-addnew-modal/truc-ca-parent-addnew-modal.component';
import { TrucCaParentDetailComponent } from './components/dynamic-process/form-process/truc-ca-parent/truc-ca-parent-detail/truc-ca-parent-detail.component';
import { TrucCaParentEditComponent } from './components/dynamic-process/form-process/truc-ca-parent/truc-ca-parent-edit/truc-ca-parent-edit.component';
import { TrucCaParentListComponent } from './components/dynamic-process/form-process/truc-ca-parent/truc-ca-parent-list/truc-ca-parent-list.component';
import { OrganiDetailComponent } from './components/quan-tri/organi-struct/organi-detail/organi-detail.component';
import { OrganiEditComponent } from './components/quan-tri/organi-struct/organi-edit/organi-edit.component';
import { OrganiIndexComponent } from './components/quan-tri/organi-struct/organi-index/organi-index.component';
import { OrganiListComponent } from './components/quan-tri/organi-struct/organi-list/organi-list.component';
import { UserModalViewSecretkeyComponent } from './components/quan-tri/user/user-modal-view-secretkey/user-modal-view-secretkey.component';
import { ReportListComponent } from './components/reports/report-list/report-list.component';
import { ReportSmovComponent } from './components/reports/report-smov/report-smov.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { GiaoNhanParentModalComponent } from './components/dynamic-process/form-process/truc-ca-parent/giao-nhan-parent-modal/giao-nhan-parent-modal.component';
import { NgxColorsModule } from 'ngx-colors';
import { FormCkListComponent } from './components/cau-hinh/form-ck/form-ck-list/form-ck-list.component';
import { FormCkAddEditFormComponent } from './components/cau-hinh/form-ck/form-ck-add-edit-form/form-ck-add-edit-form.component';
import { FormCKDetailComponent } from './components/cau-hinh/form-ck/form-ck-detail/form-ck-detail.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ModalInputEditCKComponent } from './components/cau-hinh/form-ck/modal-ck-input-edit/modal-ck-input-edit.component';
import { ModalTableEditCKComponent } from './components/cau-hinh/form-ck/modal-ck-table-edit/modal-ck-table-edit.component';
import { TenantListComponent } from './components/quan-tri/tenant/tenant-list/tenant-list.component';
import { TenantModalComponent } from './components/quan-tri/tenant/tenant-modal/tenant-modal.component';
import { ModalCkInputInsertRangeComponent } from './components/cau-hinh/form-ck/modal-ck-input-insert-range/modal-ck-input-insert-range.component';
import { ShiftEffectivePeriodEditModalComponent } from './components/cau-hinh/shift-effective-period/shift-effective-period-edit-modal/shift-effective-period-edit-modal.component';
import { DownloadLogComponent } from './components/quan-tri/download-log/download-log.component';
import { DirectoryItemComponent } from './components/quan-tri/download-log/directory-item/directory-item.component';
import { FilterLogPipe } from './components/quan-tri/download-log/filter-log.pipe';

// const antdModule = [
//   NzCardModule,
//   NzSkeletonModule,
//   NzAvatarModule,
//   NzPaginationModule,
//   NzDividerModule,
//   NzButtonModule,
//   NzListModule,
//   NzTableModule,
//   NzRadioModule,
//   NzRateModule,
//   NzTabsModule,
//   NzTagModule,
//   NzFormModule,
//   NzDatePickerModule,
//   NzSelectModule,
//   NzSwitchModule,
//   NzUploadModule,
//   NzToolTipModule,
//   NzModalModule,
//   NzMessageModule,
//   NzInputModule,
//   NzCardModule,
// ];
registerLocaleData(localeVi);
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    CKEditorModule,
    // ...antdModule,
    NgxColorsModule,
    EDiaryRoutingModule,
    NgxSummernoteModule,
    TimepickerModule.forRoot(),
    NgSelectModule,
    NouisliderModule,
    NgChartsModule,
    PopoverModule.forRoot(),
    BsDropdownModule.forRoot(),
    NgxCleaveDirectiveModule,
    FullCalendarModule,
  ],
  declarations: [
    UserListComponent,
    UserModalComponent,
    UserModalChangePassComponent,
    FormAddEditComponent,
    FormListComponent,
    FormDetailComponent,
    UnitComponent,
    UnitModalComponent,
    TagListComponent,
    TagModalComponent,
    ConfirmDialogComponent,
    PaginationComponent,
    TrucCaListComponent,
    TrucCaDetailComponent,
    TrucCaEditComponent,
    ModalInputComponent,
    ReftypeListComponent,
    ReftypeModalComponent,
    FeatureListComponent,
    FeatureModalComponent,
    EquipmentListComponent,
    EquipmentModalComponent,
    FormProcessListComponent,

    PhieuLenhListComponent,
    PhieuLenhDetailComponent,
    PhieuLenhAddnewComponent,
    PhieuLenhEditComponent,
    FlowListComponent,
    FlowModalComponent,
    FunctionListComponent,
    FunctionModalComponent,
    SearchListComponent,
    RoleListComponent,
    RoleModalComponent,
    RuleModalComponent,
    RuleListComponent,
    ErrorPageComponent,
    SearchModalComponent,
    PermissionListComponent,
    PermissionTreeComponent,
    ChiTietComponent,
    TrucCaCreateModalComponent,
    UserLogModalComponent,
    UserLogListComponent,
    FormProcessDetailComponent,
    FormProcessEditComponent,
    FormProcessAddnewComponent,
    FlowProcessListComponent,
    FlowProcessModalComponent,
    ModalInputEditComponent,
    ContextmenuComponent,
    FormProcessUserLogTabComponent,
    GiaoNhanModalComponent,
    EquipmentTagModalComponent,
    IndexStatisticComponent,
    NotificationComponent,
    ConfigComponent,
    ConfigModalComponent,
    ModalTableEditComponent,
    UserModalViewSecretkeyComponent,
    ReportListComponent,
    ReportSmovComponent,
    NodataInfoComponent,
    IframeContentComponent,
    OrganiListComponent,
    OrganiDetailComponent,
    OrganiEditComponent,
    OrganiIndexComponent,
    ShiftCategoryListComponent,
    ShiftEffectivePeriodComponent,
    ShiftCategoryModalComponent,
    ShiftEffectivePeriodConfigModalComponent,
    FormProcessUserLogDetailEditedComponent,
    TrucCaParentListComponent,
    TrucCaParentEditComponent,
    TrucCaParentDetailComponent,
    TrucCaParentAddnewModalComponent,
    JobTitleListComponent,
    JobTitleModalComponent,
    ShiftScheduleListComponent,
    ShiftScheduleModalComponent,
    GiaoNhanParentModalComponent,
    FormCkListComponent,
    FormCkAddEditFormComponent,
    ModalInputEditCKComponent,
    ModalTableEditCKComponent,
    TenantListComponent,
    TenantModalComponent,
    ModalCkInputInsertRangeComponent,
    ShiftEffectivePeriodEditModalComponent,
    FormCKDetailComponent,
    DownloadLogComponent,
    DirectoryItemComponent,
    FilterLogPipe,
  ],
  providers: [],
  exports: [FilterLogPipe],
})
export class EDiaryModule {}
