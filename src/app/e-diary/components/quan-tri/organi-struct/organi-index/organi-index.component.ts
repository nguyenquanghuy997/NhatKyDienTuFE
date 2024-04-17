import { Component, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import {
  OrganizationModel,
  OrganizationModelFilter,
} from 'src/app/e-diary/models/quan-tri/OrganizationModel';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { OrganizationService } from 'src/app/e-diary/services/quan-tri/organization.service';
import { FunctionCode } from 'src/app/e-diary/utils/Enum';
import { OrganiEditComponent } from '../organi-edit/organi-edit.component';
import { FormControl, FormGroup } from '@angular/forms';
import { DeleteModel } from 'src/app/e-diary/models/Commons/DeleteModel';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-organi-index',
  templateUrl: './organi-index.component.html',
  styleUrls: ['./organi-index.component.scss'],
})
export class OrganiIndexComponent {
  sidebarExpanded = true;
  searchForm!: FormGroup;
  lstOrg: OrganizationModel[] = [];
  loading = true;
  totalItem: number = 0;
  showpopup: boolean = false;
  functionCode?: FunctionCode = null;
  lstFunctionCode: string[];
  lstFunctionCodePopup: string[];
  FunctionCode = FunctionCode;
  orgResponeModel: OrganizationModel = {};
  ItemOrgModel: OrganizationModel = {};
  @ViewChild('popup') popup: OrganiEditComponent;
  constructor(
    private organizationService: OrganizationService,
    public toastr: ToastrService,
    private commonService: CommonService,
    public router: Router,
    private route: ActivatedRoute,
    private title: Title
  ) {
    this.searchForm = new FormGroup({
      Name: new FormControl(''),
      User_Name: new FormControl(''),
      UserLogin: new FormControl(''),
      IsActive: new FormControl(null),
    });
  }

  ngOnInit(): void {
    this.title.setTitle(this.route.snapshot.data.title);

    this.onSearch();
  }

  showSubmenu(itemEl: HTMLElement) {
    itemEl.classList.toggle('showMenu');
  }
  onSearch(id?: number) {
    this.loading = true;
    let organizationModelFilter: OrganizationModelFilter = {
      Name: this.searchForm.value.Name,
      User_Name: this.searchForm.value.User_Name,
      UserLogin: this.searchForm.value.UserLogin,
      IsActive:
        this.searchForm.value.IsActive == 'null'
          ? null
          : this.searchForm.value.IsActive,
    };
    this.organizationService
      .GetListItemBuildTree(organizationModelFilter)
      .subscribe(
        (res: ResponseModel) => {
          if (this.commonService.checkTypeResponseData(res)) {
            this.lstOrg = res.Data;
            if (this.lstOrg.length > 0)
              this.getOrganizationDetail(id ?? this.lstOrg[0].Id);

            this.totalItem = this.lstOrg.length;
            this.lstFunctionCodePopup = res.FunctionCodes;
          } else {
            this.toastr.error(`${res.Message}`, 'Lỗi');
          }
          this.lstFunctionCode = res.FunctionCodes;
          this.loading = false;
        },
        (error) => {
          this.loading = false;
          if (error.status === HttpStatusCode.MethodNotAllowed)
            this.lstFunctionCode = error.error.FunctionCodes;
        }
      );
  }

  onOpenModalCreate() {
    this.popup.ShowModal();
    this.showpopup = true;
    this.lstFunctionCodePopup = this.lstFunctionCode;
    this.functionCode = FunctionCode.CREATE;
    this.orgResponeModel = {
      Id: null,
      ParentId: null,
      Type: null,
      Name: '',
      Note: '',
      IsActive: true,
      IsCollapse: false,
      checked: false,
      expand: false,
      Version: null,
      OrganizationUsers: [],
    };
    $('body').on('shown.bs.modal', '#OrgModal', function () {
      $('input:visible:enabled:first', this).focus();
    });
  }

  onOpenModalUpdate(id: number) {
    this.loading = true;
    this.organizationService.getItemEditById(id).subscribe(
      (result: ResponseModel) => {
        if (!this.commonService.checkTypeResponseData(result)) {
          this.toastr.error(`${result.Message}`, 'Lỗi');
          this.loading = false;
          return;
        }
        this.lstFunctionCodePopup = result.FunctionCodes;
        if (!result.FunctionCodes.includes(FunctionCode.EDIT)) {
          this.loading = false;
          this.toastr.error(
            `Không có quyền cập nhật bản ghi`,
            'Không có quyền!'
          );
          return;
        }
        this.popup.ShowModal();
        this.functionCode = FunctionCode.EDIT;

        this.orgResponeModel = result.Data;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
    $('body').on('shown.bs.modal', '#OrgModal', function () {
      $('input:visible:enabled:first', this).focus();
    });
  }

  onSubmitModal(item: OrganizationModel) {
    this.loading = true;
    if (this.functionCode == FunctionCode.CREATE) {
      this.CreateItem(item);
    } else if (this.functionCode == FunctionCode.EDIT) {
      this.UpdateItem(item);
    }
  }

  onHideModal() {
    this.showpopup = false;
    this.lstFunctionCodePopup = [];
  }

  onEditModal(id: number) {
    this.onOpenModalUpdate(id);
  }

  onDeleteModal(item: OrganizationModel) {
    this.onConfirmDel(item);
  }

  CreateItem(item: OrganizationModel) {
    this.organizationService.createItem(item).subscribe(
      (result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.toastr.success('Thêm mới thành công!', 'Thành công');
          this.popup.HideModal();
          this.onSearch();
          console.log('result.Data: ', result.Data);
          this.ItemOrgModel = result.Data;
        } else {
          this.toastr.error(`${result.Message}`, 'Thêm mới lỗi');
        }
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  UpdateItem(item: OrganizationModel) {
    this.organizationService.updateItem(item).subscribe(
      (result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.toastr.success('Cập nhật thành công!', 'Thành công');
          this.popup.HideModal();
          this.onSearch(item.Id);
          // this.getOrganizationDetail(item.Id);
          // this.onSearch();
        } else {
          this.toastr.error(`${result.Message}`, 'Cập nhật lỗi');
        }
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  onConfirmDel(item: OrganizationModel) {
    this.commonService
      .confirm(
        'Xác nhận',
        'Bạn chắc chắn muốn xóa bản ghi: ' + item.Name + ' này?',
        ['Có', 'Không']
      )
      .subscribe((answer) => {
        if (answer) {
          this.DeleteItem(item);
        }
      });
  }

  DeleteItem(item: OrganizationModel) {
    this.loading = true;
    let { Id, Version } = item;
    let itemDel: DeleteModel = { Id, Version };
    this.organizationService.deleteItem(itemDel).subscribe(
      (result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.toastr.success('Đã xóa thành công!', 'Thành công');
          this.onSearch();
        } else {
          this.toastr.error(`${result.Message}`, 'Xóa lỗi');
        }
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  onReceitItemDetail(item) {
    this.getOrganizationDetail(item.Id);
  }

  getOrganizationDetail(id: number) {
    this.loading = true;
    this.organizationService.getItemById(id).subscribe(
      (result: ResponseModel) => {
        this.loading = false;
        if (!this.commonService.checkTypeResponseData(result)) {
          this.toastr.error(`${result.Message}`, 'Lỗi');
          return;
        }
        this.ItemOrgModel = result.Data;
        setTimeout(() => {
          $('.accordion.containerCard span.clickedOrg').removeClass(
            'clickedOrg'
          );
          $('.accordion.containerCard a.linkClicked').removeClass(
            'linkClicked'
          );
          $('#span' + id).addClass('clickedOrg');
          $('#' + id).addClass('linkClicked');
        }, 200);
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  onReceiveModalEditOrg(id: number) {
    this.onOpenModalUpdate(id);
  }
  onReceiveEmitDelOrg(item: OrganizationModel) {
    this.onConfirmDel(item);
  }
}
