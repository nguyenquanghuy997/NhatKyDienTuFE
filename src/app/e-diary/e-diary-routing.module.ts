import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ConfigComponent } from './components/cau-hinh/config/config-list/config.component';
import { FeatureListComponent } from './components/cau-hinh/feature/feature-list/feature-list.component';
import { FlowListComponent } from './components/cau-hinh/flow/flow-list/flow-list.component';
import { FormAddEditComponent } from './components/cau-hinh/form/form-add-edit/form-add-edit.component';
import { FormDetailComponent } from './components/cau-hinh/form/form-detail/form-detail.component';
import { FormListComponent } from './components/cau-hinh/form/form-list/form-list.component';
import { ReftypeListComponent } from './components/cau-hinh/reftype/reftype-list/reftype-list.component';
import { EquipmentListComponent } from './components/danh-muc/equipment/equipment-list/equipment-list.component';
import { TagListComponent } from './components/danh-muc/tag/tag-list/tag-list.component';
import { UnitComponent } from './components/danh-muc/unit/unit-list/unit-list.component';
import { HomeComponent } from './components/dashboard/home/home.component';
import { ChiTietComponent } from './components/dashboard/search/chi-tiet/chi-tiet.component';
import { SearchListComponent } from './components/dashboard/search/search-list/search-list.component';
import { IndexStatisticComponent } from './components/dashboard/statistic/index-statistic/index-statistic.component';
import { FormProcessAddnewComponent } from './components/dynamic-process/form-process/form-process-addnew/form-process-addnew.component';
import { FormProcessDetailComponent } from './components/dynamic-process/form-process/form-process-detail/form-process-detail.component';
import { FormProcessEditComponent } from './components/dynamic-process/form-process/form-process-edit/form-process-edit.component';
import { FormProcessListComponent } from './components/dynamic-process/form-process/form-process-list/form-process-list.component';
import { FunctionListComponent } from './components/quan-tri/function/function-list/function-list.component';
import { NotificationComponent } from './components/quan-tri/notification/notification.component';
import { PermissionListComponent } from './components/quan-tri/permission/permission-list/permission-list.component';
import { RoleListComponent } from './components/quan-tri/role/role-list/role-list.component';
import { RuleListComponent } from './components/quan-tri/rule/rule-list/rule-list.component';
import { UserLogListComponent } from './components/quan-tri/user-log/user-log-list/user-log-list.component';
import { UserListComponent } from './components/quan-tri/user/user-list/user-list.component';
import { ReportListComponent } from './components/reports/report-list/report-list.component';
import { ESConst } from './utils/Const';
import { OrganiIndexComponent } from './components/quan-tri/organi-struct/organi-index/organi-index.component';
import { ShiftCategoryListComponent } from './components/danh-muc/shift-category/shift-category-list/shift-category-list.component';
import { ShiftEffectivePeriodComponent } from './components/cau-hinh/shift-effective-period/shift-effective-period-list/shift-effective-period-list.component';
import { FormProcessUserLogDetailEditedComponent } from './components/dynamic-process/form-process/form-process-user-log-detail-edited/form-process-user-log-detail-edited.component';
import { JobTitleListComponent } from './components/danh-muc/job-title/job-title-list/job-title-list.component';
import { ShiftScheduleListComponent } from './components/cau-hinh/shift-schedule/shift-schedule-list/shift-schedule-list.component';
import { FormCkListComponent } from './components/cau-hinh/form-ck/form-ck-list/form-ck-list.component';
import { FormCkAddEditFormComponent } from './components/cau-hinh/form-ck/form-ck-add-edit-form/form-ck-add-edit-form.component';
import { TenantListComponent } from './components/quan-tri/tenant/tenant-list/tenant-list.component';
import { FormCKDetailComponent } from './components/cau-hinh/form-ck/form-ck-detail/form-ck-detail.component';
import { DownloadLogComponent } from './components/quan-tri/download-log/download-log.component';

const routes: Routes = [
  //Trang chủ
  {
    path: 'home',
    component: HomeComponent,
    data: {
      title: 'Trang chủ',
    },
  },

  {
    path: `Search/nhat-ky`,
    component: SearchListComponent,
    data: {
      title: 'Tra cứu nhật ký',
    },
  },
  // thống kê
  {
    path: `Statistic/nhat-ky`,
    component: IndexStatisticComponent,
    data: {
      title: 'Thống kê',
    },
  },

  // Quản trị
  {
    path: 'admins/org',
    component: OrganiIndexComponent,
    data: {
      title: 'Cơ cấu tổ chức',
    },
  },
  {
    path: 'admins/user',
    component: UserListComponent,
    data: {
      title: 'Quản lý người dùng',
    },
  },

  {
    path: 'admins/function',
    component: FunctionListComponent,
    data: {
      title: 'Chức năng',
    },
  },

  {
    path: 'admins/permission',
    component: PermissionListComponent,
    // component: PhanQuyenComponent,
    data: {
      title: 'Phân quyền',
    },
  },

  {
    path: `admins/rule`,
    component: RuleListComponent,
    data: {
      title: 'Quyền dữ liệu',
    },
  },

  {
    path: 'admins/role',
    component: RoleListComponent,
    data: {
      title: 'Vai trò',
    },
  },
  {
    path: 'admins/user-log',
    component: UserLogListComponent,
    data: {
      title: 'Lịch sử hành động',
    },
  },
  {
    path: 'admins/notification',
    component: NotificationComponent,
    data: {
      title: 'Thông báo',
    },
  },
  // Đơn vị vận hành
  {
    path: 'admins/tenant',
    component: TenantListComponent,
    data: {
      title: 'Đơn vị vận hành',
    },
  },
  // download file log
  {
    path: 'admins/downloadLog',
    component: DownloadLogComponent,
    data: {
      title: 'Tải file log',
    },
  },
  //Danh mục
  {
    path: 'params/unit',
    component: UnitComponent,
    data: {
      title: 'Đơn vị tính',
    },
  },
  {
    path: 'params/tag',
    component: TagListComponent,
    data: {
      title: 'Thông số',
    },
  },
  {
    path: 'params/ShiftCategory',
    component: ShiftCategoryListComponent,
    data: {
      title: 'Loại ca trực',
    },
  },
  {
    path: 'params/jobtitle',
    component: JobTitleListComponent,
    data: {
      title: 'Chức danh',
    },
  },
  {
    path: 'params/equipment',
    component: EquipmentListComponent,
    data: {
      title: 'Thiết bị',
    },
  },
  //Cấu hình
  {
    path: 'configs/formOld',
    component: FormListComponent,
    data: {
      title: 'Màn hình động',
    },
  },
  {
    path: 'configs/form',
    component: FormCkListComponent,
    data: {
      title: 'Màn hình động CK',
    },
  },
  {
    path: 'configs/form/them-form-mau',
    component: FormCkAddEditFormComponent,
    data: {
      title: 'Thêm mới form mẫu',
      subTitle: 'Thêm mới',
    },
  },
  {
    path: 'configs/formOld/them-form-mau',
    component: FormAddEditComponent,
    data: {
      title: 'Tạo mới form mẫu',
      subTitle: 'Tạo mới',
    },
  },
  {
    path: 'configs/ShiftSchedule',
    component: ShiftScheduleListComponent,
    data: {
      title: 'Lịch trực ca',
    },
  },
  {
    path: `configs/formOld/cap-nhat-form/:${ESConst.PatchParams.id}`,
    component: FormAddEditComponent,
    data: { title: 'Cập nhật form mẫu', subTitle: 'Cập nhật' },
  },
  {
    path: `configs/formOld/chi-tiet-form/:${ESConst.PatchParams.id}`,
    component: FormDetailComponent,
    data: { title: 'Chi tiết form mẫu', subTitle: 'Chi tiết' },
  },
  {
    path: `configs/form/cap-nhat-form/:${ESConst.PatchParams.id}`,
    component: FormCkAddEditFormComponent,
    data: { title: 'Cập nhật form mẫu', subTitle: 'Cập nhật' },
  },
  {
    path: `configs/form/chi-tiet-form/:${ESConst.PatchParams.id}`,
    component: FormCKDetailComponent,
    data: { title: 'Chi tiết form mẫu', subTitle: 'Chi tiết' },
  },
  {
    path: 'configs/ShiftEffectivePeriod',
    component: ShiftEffectivePeriodComponent,
    data: {
      title: 'Mẫu ca trực',
    },
  },
  {
    path: 'configs/reftype',
    component: ReftypeListComponent,
    data: {
      title: 'Nghiệp vụ',
    },
  },
  {
    path: 'configs/feature',
    component: FeatureListComponent,
    data: {
      title: 'Menu',
    },
  },
  {
    path: 'configs/flow',
    component: FlowListComponent,
    data: {
      title: 'Luồng phê duyệt',
    },
  },
  {
    path: 'configs/common',
    component: ConfigComponent,
    data: {
      title: 'Cấu hình chung',
    },
  },

  //Nhật ký vận hành
  {
    path: `processform/reftype/:${ESConst.PatchParams.refTypeId}`,
    component: FormProcessListComponent,
    data: {
      title: 'Nhật ký vận hành',
    },
  },

  {
    path: `processform/reftype/:${ESConst.PatchParams.refTypeId}/cap-nhat/:${ESConst.PatchParams.id}`,
    component: FormProcessEditComponent,
    data: {
      title: 'Cập nhật nhật ký trực ca',
      subTitle: 'Cập nhật',
    },
  },

  {
    path: `processform/reftype/:${ESConst.PatchParams.refTypeId}/chi-tiet/:${ESConst.PatchParams.id}`,
    component: FormProcessDetailComponent,
    data: { title: 'Chi tiết nhật ký trực ca', subTitle: 'Chi tiết' },
  },

  {
    path: `processform/reftype/:${ESConst.PatchParams.refTypeId}/them-moi`,
    component: FormProcessAddnewComponent,
    data: {
      title: 'Thêm mới',
      subTitle: 'Thêm mới',
    },
  },

  {
    path: `processform/log-edited/:chi-tiet`,
    component: FormProcessUserLogDetailEditedComponent,
    data: {
      title: 'Chi tiết log cập nhật nhật ký trực ca',
      subTitle: 'Chi tiết log cập nhật',
    },
  },
  // {
  //   path: 'not-authorized',
  //   component: ErrorComponent,
  //   data: {
  //     title: '',
  //   },
  // },
  {
    path: 'Search/nhat-ky/:chi-tiet',
    component: ChiTietComponent,
    data: { title: 'Chi tiết kết quả tìm kiếm', subTitle: 'Chi tiết' },
  },

  //#region Reports
  {
    path: 'reports',
    component: ReportListComponent,
    data: { title: 'Báo cáo' },
  },
  //#endregion
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EDiaryRoutingModule {}
