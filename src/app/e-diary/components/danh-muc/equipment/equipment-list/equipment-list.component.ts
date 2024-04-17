import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  FunctionCode,
  NgSelectMessage,
  ResponseTypeES,
} from 'src/app/e-diary/utils/Enum';
import { PagingModel } from 'src/app/e-diary/models/Commons/PagingModel';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import {
  EquipmentModel,
  EquipmentModelFilter,
} from 'src/app/e-diary/models/cau-hinh/EquipmentModel';
import { EquipmentTagModel } from 'src/app/e-diary/models/cau-hinh/EquipmentTagModel';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { EquipmentService } from 'src/app/e-diary/services/danh-muc/equipment.service';
import { EquipmentModalComponent } from '../equipment-modal/equipment-modal.component';
import { Utility } from 'src/app/e-diary/utils/Utility';
import { ESConst } from 'src/app/e-diary/utils/Const';
import { OrganizationModel } from 'src/app/e-diary/models/quan-tri/OrganizationModel';
import { DeleteModel } from 'src/app/e-diary/models/Commons/DeleteModel';

@Component({
  selector: 'app-equipment-list',
  templateUrl: './equipment-list.component.html',
  styleUrls: ['./equipment-list.component.css'],
})
export class EquipmentListComponent {
  breadcrumbTitle: string = '';
  loading = false;
  id: number;
  isShowDetailOnLoad: boolean = false;

  lstOrgSearch: OrganizationModel[] = [];
  searchForm!: FormGroup;

  lstEquipment: EquipmentModel[] = [];
  pageIndex: number = 1;
  pageSize: number = 10;
  totalItem: number = 0;
  pageCount: number[] = [];

  respone: EquipmentModel = {};
  EquipmentTags: EquipmentTagModel[] = [];
  showpopup: boolean = false;
  functionCode?: FunctionCode = null;
  lstFunctionCode: string[];
  lstFunctionCodePopup: string[];
  FunctionCode = FunctionCode;
  ngSelectMessage = NgSelectMessage;
  @ViewChild('popup') popup: EquipmentModalComponent;

  constructor(
    private thietBiService: EquipmentService,
    private titleService: Title,
    public toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService
  ) {
    this.searchForm = new FormGroup({
      name: new FormControl(''),
      code: new FormControl(''),
      status: new FormControl(-1),
      orgId: new FormControl(null),
    });
  }
  ngOnInit(): void {
    this.breadcrumbTitle = this.route.snapshot.data.breadcrumbTitle;
    this.titleService.setTitle(this.route.snapshot.data.title);
    this.route.queryParams.subscribe((val) => {
      this.id = val[ESConst.PatchParams.id];
    });
    this.setupFrom();
  }
  setupFrom() {
    this.thietBiService.getDataSetupFormView().subscribe(
      (result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.lstOrgSearch = result.Data.Orgs;
          this.lstFunctionCodePopup = result.FunctionCodes;

          this.getData(1);
        } else {
          console.error(result.Exception);
          this.toastr.error(`${result.Message}`, 'Lỗi');
        }
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        if (error.status === HttpStatusCode.MethodNotAllowed)
          this.lstFunctionCode = error.error.FunctionCodes;
      }
    );
  }

  public onSearch(): void {
    this.getData(1);
  }
  getData(pageIndex: number) {
    this.pageIndex = pageIndex;
    let status =
      this.searchForm.value.status === -1 ||
      this.searchForm.value.status.toString() === '-1'
        ? null
        : this.searchForm.value.status == 1;
    let orgId =
      this.searchForm.value.orgId == 'null'
        ? null
        : this.searchForm.value.orgId;
    let equipmentModelFilter: EquipmentModelFilter = {
      PageIndex: this.pageIndex,
      PageSize: this.pageSize,
      Name: this.searchForm.value.name,
      Code: this.searchForm.value.code,
      IsActive: status,
      OrganizationId: orgId,
    };
    this.loading = true;
    this.thietBiService.getEquipmentPaging(equipmentModelFilter).subscribe(
      (res: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(res)) {
          this.lstEquipment = res.Data.Items;
          this.totalItem = res.Data.TotalRecords;
          this.pageCount = new Array(res.Data.PageCount);
          this.lstFunctionCodePopup = res.FunctionCodes;

          // nếu có Id trên url thì show detail
          if (this.id && this.isShowDetailOnLoad == false) {
            // do không truyền đc giá trị từ (this) của code ts qua code html, nên cần cho vào biến bình thường trước
            let id = this.id;
            $(document).ready(function () {
              document.getElementById('Item_' + id).click();
              this.isShowDetailOnLoad == true;
            });
          }
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

  changePagination(pagingConfig: PagingModel) {
    this.pageSize = pagingConfig.PageSize;
    this.pageIndex = pagingConfig.PageIndex;
    this.getData(pagingConfig.PageIndex);
  }

  onOpenModalCreate() {
    // this.popup.formArr.clear();
    this.popup.ShowModal();
    this.showpopup = true;
    this.lstFunctionCodePopup = this.lstFunctionCode;
    this.functionCode = FunctionCode.CREATE;
    this.respone = {
      Id: null,
      ParentId: null,
      Type: null,
      Name: '',
      Code: '',
      Note: '',
      IsActive: true,
      IsDeleted: false,
      CreatedUserId: null,
      CreatedDTG: null,
      UpdatedUserId: null,
      UpdatedDTG: null,
      Version: null,
      EquipmentTags: [],
    };
  }

  onOpenModalUpdate(id: number) {
    this.loading = true;

    // this.popup.formArr.clear();
    this.popup.equipmentId = id;
    this.thietBiService.getEquipmentEditById(id).subscribe(
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
        this.respone = result.Data;
        this.popup.ShowModal();
        this.functionCode = FunctionCode.EDIT;
        this.showpopup = true;
        // this.respone.EquipmentTags = result.Data.EquipmentTags;
        // for (var i = 0; i < this.respone.EquipmentTags.length; i++) {
        //   let obj = this.respone.EquipmentTags[i];
        //   console.log('obj==', obj);
        //   this.popup.formArr.push(this.popup.addRow(obj));
        // }
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  onOpenModalDisplay(id: number) {
    this.loading = true;
    this.thietBiService.getEquipmentById(id).subscribe(
      (result: ResponseModel) => {
        if (!this.commonService.checkTypeResponseData(result)) {
          this.toastr.error(`${result.Message}`, 'Lỗi');
          this.loading = false;
          return;
        }
        this.lstFunctionCodePopup = result.FunctionCodes;
        if (
          result.FunctionCodes == null ||
          !result.FunctionCodes.includes(FunctionCode.DISPLAY)
        ) {
          this.loading = false;
          this.toastr.error(
            `Không có quyền xem chi tiết bản ghi`,
            'Không có quyền!'
          );

          return false;
        }
        this.functionCode = FunctionCode.DISPLAY;
        this.showpopup = true;
        this.popup.ShowModal();
        this.respone = result.Data;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  onSubmitModal(item: EquipmentModel) {
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
    if (this.functionCode == FunctionCode.CREATE)
      this.EquipmentTags.forEach((item, index) => {});

    // Remove query params
    if (this.id) {
      const queryParams = {};
      this.router.navigate([], {
        queryParams,
        replaceUrl: true,
        relativeTo: this.route,
      });
    }
  }

  onEditModal(id: number) {
    this.onOpenModalUpdate(id);
  }

  onDeleteModal(item: EquipmentModel) {
    this.onConfirmDel(item, this.popup);
  }

  CreateItem(item: EquipmentModel) {
    this.thietBiService.createEquipment(item).subscribe(
      (result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.toastr.success('Thêm mới thành công!', 'Thành công');
          this.popup.HideModal();
          this.showpopup = false;
          this.getData(this.pageIndex);
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

  UpdateItem(item: EquipmentModel) {
    this.thietBiService.updateEquipment(item).subscribe(
      (result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.toastr.success('Cập nhật thành công!', 'Thành công');
          this.popup.HideModal();
          this.getData(this.pageIndex);
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
  onConfirmDel(item: EquipmentModel, callback: EquipmentModalComponent) {
    this.commonService
      .confirm(
        'Xác nhận',
        'Bạn chắc chắn muốn xóa bản ghi: ' + item.Name + ' này?',
        ['Có', 'Không']
      )
      .subscribe((answer) => {
        if (answer) {
          this.DeleteItem(item, callback);
        }
      });
  }

  DeleteItem(item: EquipmentModel, callback: EquipmentModalComponent) {
    this.loading = true;
    let { Id, Version } = item;
    let itemDel: DeleteModel = { Id, Version };
    this.thietBiService.deleteEquipment(itemDel).subscribe(
      (result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.toastr.success('Đã xóa thành công!', 'Thành công');
          this.getData(1);
          if (callback) callback.HideModal();
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
}
