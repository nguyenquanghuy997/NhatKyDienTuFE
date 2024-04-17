import { Component, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { error } from 'console';
import { ToastrService } from 'ngx-toastr';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import { sysUserModel } from 'src/app/e-diary/models/quan-tri/sysUserModel';
import {
  PermissionFilter,
  PermissionGrant,
  PermissionModel,
} from 'src/app/e-diary/models/quan-tri/PermissionModel';
import { RoleModel } from 'src/app/e-diary/models/quan-tri/RoleModel';
import { RuleModel } from 'src/app/e-diary/models/quan-tri/RuleModel';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { PermissionService } from 'src/app/e-diary/services/quan-tri/permission.service';
import {
  FunctionCode,
  NgSelectMessage,
  ResponseTypeES,
} from 'src/app/e-diary/utils/Enum';
import { Utility } from 'src/app/e-diary/utils/Utility';
import { RuleModalComponent } from '../../rule/rule-modal/rule-modal.component';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-permission-list',
  templateUrl: './permission-list.component.html',
  styleUrls: ['./permission-list.component.css'],
})
export class PermissionListComponent {
  breadcrumbTitle: string = '';
  loading: boolean = false;
  functionCode?: FunctionCode = null;
  FunctionCode = FunctionCode;
  lstFunctionCode: string[];
  phamVi: string;
  phamVi_Role: string = 'Role';
  phamVi_User: string = 'User';
  roleId?: number;
  userId?: number;

  lstRole: RoleModel[] = [];
  lstUser: sysUserModel[] = [];

  lstItemTree: PermissionModel[] = [];
  lstRule: RuleModel[] = [];
  popupRule: RuleModel = {};
  popupFunctionCode: FunctionCode = FunctionCode.DISPLAY;
  popupPermissionFunctionCodes: string[] = [FunctionCode.DISPLAY.toString()];
  ngSelectMessage = NgSelectMessage;

  constructor(
    private permissionService: PermissionService,
    private toastr: ToastrService,
    private title: Title,
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService
  ) {
    this.breadcrumbTitle = this.route.snapshot.data.breadcrumbTitle;
    this.title.setTitle(this.route.snapshot.data.title);
    this.setupForm();
  }

  setupForm() {
    // lấy thông tin user, role
    this.loading = true;
    this.permissionService.setupFormView().subscribe(
      (result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.lstRole = result.Data.Roles;
          this.lstUser = result.Data.Users;
          this.lstRule = result.Data.Rules;
          // sau khi load thong tin setup thi search data
          this.phamVi = this.phamVi_Role;
          // trong onChangePhamVi đã có search data rồi
          this.onChangePhamVi();
        } else {
          this.toastr.error(`${result.Message}`, 'Lỗi');
        }
        this.lstFunctionCode = result.FunctionCodes;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        if (error.status === HttpStatusCode.MethodNotAllowed)
          this.lstFunctionCode = error.error.FunctionCodes;
      }
    );
  }

  onSearchData() {
    // lấy all ds featurefunction, có thông tin feature và permission luôn
    let filter: PermissionFilter = {
      RoleId: this.roleId,
      UserId: this.userId,
      IsGranted: true,
    };
    this.loading = true;
    this.permissionService.getListItemBuildTree(filter).subscribe(
      (result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.lstItemTree = result.Data;
        } else {
          this.toastr.error(`${result.Message}`, 'Lỗi');
        }
        this.lstFunctionCode = result.FunctionCodes;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        if (error.status === HttpStatusCode.MethodNotAllowed)
          this.lstFunctionCode = error.error.FunctionCodes;
      }
    );
  }

  //#region filter events
  onChangePhamVi() {
    // khi thay đổi phạm vi thì set giá trị mặc định cho Role hoặc User
    // lấy giá trị đầu tiên trong list
    // set null cho thằng còn lại
    if (this.phamVi == this.phamVi_Role) {
      this.roleId = this.lstRole[0]?.Id;
      this.userId = null;
    } else {
      this.userId = this.lstUser[0]?.Id;
      this.roleId = null;
    }
    this.onSearchData();
  }

  onChangeRole() {
    this.userId = null;
    this.onSearchData();
  }

  onChangeUser() {
    this.roleId = null;
    this.onSearchData();
  }
  //#endregion

  onSaveData() {
    let permissions = this.getListPermission(this.lstItemTree);

    let permissionGrant: PermissionGrant = {
      RoleId: this.roleId,
      UserId: this.userId,
      Permissions: permissions,
    };
    this.loading = true;
    this.permissionService.grantPermission(permissionGrant).subscribe(
      (result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.toastr.success('Phân quyền thành công!', 'Thành công');
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

  getListPermission(lstParent: PermissionModel[]): PermissionModel[] {
    let permissions: PermissionModel[] = [];

    for (let item of lstParent) {
      if (item.IsGranted && item.FeatureFunctionId) {
        permissions.push(item);
      }
      if (item.Childs) {
        permissions.push(...this.getListPermission(item.Childs));
      }
    }

    return permissions;
  }

  @ViewChild('popupRuleInfo') popupRuleInfo: RuleModalComponent;

  onShowModalRule(ruleId: number) {
    // xác định Rule
    this.popupRule = this.lstRule.find((en) => en.Id === ruleId);
    // show popup
    this.popupRuleInfo.ShowModal();
  }
}
