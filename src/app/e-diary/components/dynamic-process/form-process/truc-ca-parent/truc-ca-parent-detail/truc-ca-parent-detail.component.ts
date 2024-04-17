import { Component, Input, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import {
  VerifyPasswordModel,
  VerifyTOTPModel,
} from 'src/app/e-diary/models/Commons/VerifyTOTPModel';
import { RefTypeModel } from 'src/app/e-diary/models/cau-hinh/RefTypeModel';
import { DutyShiftMemberModel } from 'src/app/e-diary/models/nhat-ky-van-hanh/DutyShiftMemberModel';
import { DutyShiftModel } from 'src/app/e-diary/models/nhat-ky-van-hanh/DutyShiftModel';
import { ProcessFlowModel } from 'src/app/e-diary/models/nhat-ky-van-hanh/ProcessFlowModel';
import { ProcessFormModel } from 'src/app/e-diary/models/nhat-ky-van-hanh/ProcessFormModel';
import {
  SysProcessFormDeliveyModel,
  SysProcessMemberModel,
} from 'src/app/e-diary/models/nhat-ky-van-hanh/SysProcessFormDeliveryModel';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { ProcessFormService } from 'src/app/e-diary/services/dynamic-process/process-form.service';
import { ESConst } from 'src/app/e-diary/utils/Const';
import {
  FunctionCode,
  Status,
  StatusDutyShift,
} from 'src/app/e-diary/utils/Enum';
import { FlowProcessListComponent } from '../../../flow-process/flow-process-list/flow-process-list.component';
import { FlowProcessModalComponent } from '../../../flow-process/flow-process-modal/flow-process-modal.component';
import { GiaoNhanModalComponent } from '../../truc-ca/giao-nhan-modal/giao-nhan-modal.component';
import { GiaoNhanParentModalComponent } from '../giao-nhan-parent-modal/giao-nhan-parent-modal.component';
import { FormProcessUserLogTabComponent } from '../../form-process-user-log-tab/form-process-user-log-tab.component';
import { Utility } from 'src/app/e-diary/utils/Utility';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-truc-ca-parent-detail',
  templateUrl: './truc-ca-parent-detail.component.html',
  styleUrls: ['./truc-ca-parent-detail.component.css'],
})
export class TrucCaParentDetailComponent {
  @Input() RefTypeModel: RefTypeModel;
  @Input() Id!: number;

  breadcrumbTitle: string = '';
  loading = true;
  item!: ProcessFormModel;
  processFlow: ProcessFlowModel = {
    RefId: null,
    RefTypeId: null,
    SubmittedNote: '',
  };

  Status = Status;
  StatusDutyShift = StatusDutyShift;
  FunctionCode = FunctionCode;
  DicStatusStyleInput_OnShiftDuty = ESConst.DicStatusStyleInput_OnShiftDuty;
  DicStatusDesc_OnShiftDuty = ESConst.DicStatusDesc_OnShiftDuty;
  DicStatusStyleInput = ESConst.DicStatusStyleInput;
  DicStatusDesc = ESConst.DicStatusDesc;

  functionCode?: FunctionCode = null;
  lstFunctionCode: string[];

  //#region flow
  flowModalTitle: string;
  flowFunctionCode: FunctionCode;
  showModal: boolean = false;
  iframeHeight: number = 500;
  lstFunctionCodePopup: string[];
  @ViewChild('form_process_user_log_tab')
  form_process_user_log_tab: FormProcessUserLogTabComponent;
  @ViewChild('flow_process_list') flow_process_list: FlowProcessListComponent;
  @ViewChild('flow_process_modal')
  flow_process_modal: FlowProcessModalComponent;
  @ViewChild('verify_totp') verify_totp: GiaoNhanModalComponent;
  @ViewChild('giao_nhan') giao_nhan: GiaoNhanParentModalComponent;
  lstTabLink: ProcessFormModel;
  activeTab: string = 'data';
  itemContext: string = '';
  popupItem: SysProcessFormDeliveyModel;
  constructor(
    private processFormService: ProcessFormService,
    private commonService: CommonService,
    public toastr: ToastrService,
    private title: Title,
    public router: Router,
    private route: ActivatedRoute
  ) {
    this.breadcrumbTitle = this.route.snapshot.data.breadcrumbTitle;
    this.title.setTitle(this.route.snapshot.data.title);
  }
  ngOnInit() {
    this.loadData();
  }
  setActiveTab(tabId: string, itemTab: ProcessFormModel) {
    if (itemTab == null || typeof itemTab === 'undefined') return;
    this.activeTab = tabId;
    setTimeout(() => {
      this.itemContext = itemTab.Context;
      this.bindDataFrameChild(itemTab);
    }, 200);
  }
  loadData() {
    this.loading = true;
    this.processFormService
      .getItemById(this.Id, this.RefTypeModel.Id)
      .subscribe((result: ResponseModel) => {
        this.lstFunctionCode = result.FunctionCodes;
        if (!this.commonService.checkTypeResponseData(result)) {
          this.toastr.error(`${result.Message}`, 'Lỗi');
          this.loading = false;
       
          return;
        }

        this.item = result.Data;
        if (result.Data.ChildSysProcessform) {
          this.lstTabLink = result.Data.ChildSysProcessform;
        }
        if (!this.item.Context) {
          this.toastr.error(`Không tìm thấy thiết kế form`, 'Lỗi!');
          return;
        }

        this.bindData();
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        if (error.status === HttpStatusCode.MethodNotAllowed)
          this.lstFunctionCode = error.error.FunctionCodes;});
  }

  bindData() {
    let jsonArray = JSON.parse(this.item.Content);
    $(document).ready(function () {
      if (jsonArray && jsonArray.length > 0) {
        setTimeout(() => {
          jsonArray.forEach((item) => {
            $('.previewFormDong')
              .contents()
              .find("[id='" + item.id + "']")
              .val(item.value);
          });
        }, 300);
      }
    });
  }

  bindDataFrameChild(item: ProcessFormModel) {
    if (item.Content == null) return;
    let jsonArray = JSON.parse(item.Content);
    $(document).ready(function () {
      if (jsonArray && jsonArray.length > 0) {
        setTimeout(() => {
          jsonArray.forEach((item) => {
            $('.previewFormDong')
              .contents()
              .find("[id='" + item.id + "']")
              .val(item.value);
          });
        }, 300);
      }
    });
  }

  //#region Delete
  onConfirmDel(item: ProcessFormModel) {
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

  DeleteItem(item: ProcessFormModel) {
    this.loading = true;
    this.processFormService.deleteProcessFormParent(item).subscribe(
      (result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          // nhảy về trang ds
          this.commonService.gotoPage(
            `/processform/reftype/${this.RefTypeModel.Id}`
          );
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
  //#endregion

  //#region Luồng giao nhận ca

  onGiaoCa() {
    this.GiaoNhanCaCheckHasOTP();
  }

  GiaoNhanCaCheckHasOTP() {
    if (this.RefTypeModel.HasOTP === true) {
      this.verify_totp.ShowModal();
    } else {
      this.GiaoNhanCaCheckHasCA();
    }
  }

  GiaoNhanCaCheckHasCA() {
    // hiện chưa check HasCA
    if (this.RefTypeModel.HasCA === true) {
      this.GiaoNhanCa();
    } else {
      this.GiaoNhanCa();
    }
  }

  GiaoNhanCa() {
    let data: ProcessFormModel = {
      Id: this.Id,
      RefTypeId: this.RefTypeModel.Id,
      Name: this.item.Name,
      Version: this.item.Version,
      StatusDutyShift: StatusDutyShift.DaGiaoCa,
    };
    this.loading = true;
    this.processFormService.updateStatusGiaoNhanCaItem(data).subscribe(
      (result: ResponseModel) => {
        this.lstFunctionCode = result.FunctionCodes;
        if (this.commonService.checkTypeResponseData(result)) {
          this.loading = false;
          this.toastr.success('Giao nhận ca thành công!', 'Thành công');
          this.item.StatusDutyShift = data.StatusDutyShift;
          this.item.Version = data.Version + 1;
        } else {
          console.error(result.Exception);
          this.toastr.error(result.Message, 'Lỗi');
        }
      },
      (error) => {
        this.loading = false;
      }
    );
  }
  //#endregion

  //#region Luồng phê duyệt
  onShowModal(functionCode: FunctionCode) {
    this.flowFunctionCode = functionCode;
    this.processFlow = {
      RefId: this.Id,
      RefTypeId: this.RefTypeModel.Id,
      SubmittedNote: '',
    };
    this.flow_process_modal.ShowModal();
  }

  onSubmitProcessFlow(model: ProcessFlowModel) {
    this.reLoadDataFlow();

    // nếu ko có sự thay đổi Status thì bỏ qua
    if (this.item.Status == model.Status) {
      this.getPageFunctionCodePermission();
      return;
    }
    this.loading = true;
    // update item.Status
    this.item.Status = model.Status;
    this.processFormService.submitProcessForm(this.item).subscribe(
      (result: ResponseModel) => {
        if (!this.commonService.checkTypeResponseData(result)) {
          this.toastr.error(`${result.Message}`, 'Lỗi');
        }
        this.lstFunctionCode = result.FunctionCodes;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  onApproveProcessFlow(model: ProcessFlowModel) {
    this.reLoadDataFlow();

    // nếu ko có sự thay đổi Status thì bỏ qua
    if (this.item.Status == model.Status) {
      this.getPageFunctionCodePermission();
      return;
    }
    this.loading = true;
    // update item.Status
    this.item.Status = model.Status;
    this.processFormService.approveProcessForm(this.item).subscribe(
      (result: ResponseModel) => {
        if (!this.commonService.checkTypeResponseData(result)) {
          this.toastr.error(`${result.Message}`, 'Lỗi');
        }
        this.lstFunctionCode = result.FunctionCodes;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  onRejectProcessFlow(model: ProcessFlowModel) {
    this.reLoadDataFlow();

    // nếu ko có sự thay đổi Status thì check lại quyền thôi
    if (this.item.Status == model.Status) {
      this.getPageFunctionCodePermission();
      return;
    }
    this.loading = true;
    // update item.Status
    this.item.Status = model.Status;
    this.processFormService.rejectProcessForm(this.item).subscribe(
      (result: ResponseModel) => {
        if (!this.commonService.checkTypeResponseData(result)) {
          this.toastr.error(`${result.Message}`, 'Lỗi');
        }
        this.lstFunctionCode = result.FunctionCodes;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  reLoadDataFlow() {
    // tắt popup
    this.flow_process_modal.HideModal();
    // load lại ds lịch sử thao tác
    this.form_process_user_log_tab.onSearchData(1);
    // load lại ds flowprocess
    this.flow_process_list.loadData();
  }

  getPageFunctionCodePermission() {
    this.loading = true;
    this.processFormService
      .getPageFunctionCodePermission(this.RefTypeModel.Id, this.item.Id)
      .subscribe(
        (res: ResponseModel) => {
          if (!this.commonService.checkTypeResponseData(res)) {
            this.toastr.error(`${res.Message}`, 'Lỗi');
          }
          this.lstFunctionCode = res.Data;
          this.loading = false;
        },
        (error) => {
          this.loading = false;
        }
      );
  }
  //#endregion

  //#region Verify T-OTP
  onSubmitModalVerifyTotp() {
    this.GiaoNhanCaCheckHasOTP();
  }
  //#endregion

  computeValue(value1: string, value2: string): string {
    return `${moment(value1).format('DD/MM/YYYY HH:mm')} - ${moment(
      value2
    ).format('DD/MM/YYYY HH:mm')}`;
  }

  // giao nhận ca
  onGiaoNhanCa() {
    this.loading = true;
    this.processFormService
      .GetInfoShiftDelivery(this.Id, this.RefTypeModel.Id)
      .subscribe(
        (result: any) => {
          if (!this.commonService.checkTypeResponseData(result)) {
            this.toastr.error(`${result.Message}`, 'Lỗi');
            this.loading = false;
            return;
          }
          this.lstFunctionCodePopup = result.FunctionCodes;
          if (!result.FunctionCodes.includes(FunctionCode.GiaoNhanCa)) {
            this.toastr.error(
              `Không có quyền xem giao nhận ca`,
              'Không có quyền!'
            );
            return;
          }
          this.functionCode = FunctionCode.GiaoNhanCa;
          this.popupItem = result.Data;
          this.popupItem.StartDTG = new Date(this.popupItem.StartDTG);
          this.giao_nhan.ShowModal();
          this.loading = false;
        },
        (error) => {
          this.loading = false;
        }
      );
  }
  onSubmitGiaoNhanModal(item: SysProcessFormDeliveyModel) {
    this.loading = true;
    // clone
    let itemSubmit: SysProcessFormDeliveyModel = Object.assign({}, item);
    let lstUserTOTP: VerifyTOTPModel[] = [];
    let lstUserPassword: VerifyPasswordModel[] = [];
    if (itemSubmit.Members && itemSubmit.Members.length > 0) {
      itemSubmit.Members.forEach((element: SysProcessMemberModel) => {
        // VerifyTOTP
        if (
          this.RefTypeModel.HasOTP &&
          element.StatusDutyShift != StatusDutyShift.DaGiaoCa &&
          !lstUserTOTP.find(
            (e) => e.UserId == element.UserId && e.TOTP == element.TOTP
          )
        ) {
          let itemUserOTP: VerifyTOTPModel = {
            UserId: element.UserId,
            TOTP: element.TOTP,
          };
          lstUserTOTP.push(itemUserOTP);
        }

        // VerifyPassword
        if (
          !this.RefTypeModel.HasOTP &&
          element.StatusDutyShift != StatusDutyShift.DaGiaoCa &&
          !lstUserPassword.find(
            (e) => e.UserId == element.UserId && e.Password == element.Password
          )
        ) {
          let itemUserPass: VerifyPasswordModel = {
            UserId: element.UserId,
            Password: element.Password,
          };
          lstUserPassword.push(itemUserPass);
        }
      });
    }

    if (
      itemSubmit.ProcessFormNext.Members &&
      itemSubmit.ProcessFormNext.Members.length > 0
    ) {
      // trên popup xác định có ca trực giao nhận ca tương ứng trước đó hay chưa
      // giá trị nhận diện update vào trường StatusDutyShift như bên ca hiện tại
      itemSubmit.ProcessFormNext.Members.forEach(
        (element: SysProcessMemberModel) => {
          // verifyTOTP
          if (
            this.RefTypeModel.HasOTP &&
            element.StatusDutyShift != StatusDutyShift.DaGiaoCa &&
            !lstUserTOTP.find(
              (e) => e.UserId == element.UserId && e.TOTP == element.TOTP
            )
          ) {
            let itemUserTOTP: VerifyTOTPModel = {
              UserId: element.UserId,
              TOTP: element.TOTP,
            };
            lstUserTOTP.push(itemUserTOTP);
          }
          // verifyOPassword
          if (
            !this.RefTypeModel.HasOTP &&
            element.StatusDutyShift != StatusDutyShift.DaGiaoCa &&
            !lstUserPassword.find(
              (e) =>
                e.UserId == element.UserId && e.Password == element.Password
            )
          ) {
            let itemUserPass: VerifyPasswordModel = {
              UserId: element.UserId,
              Password: element.Password,
            };
            lstUserPassword.push(itemUserPass);
          }
        }
      );
    }
    //cho veryfitotp
    itemSubmit.VerifyTOTPs = lstUserTOTP;
    itemSubmit.VerifyPasswords = lstUserPassword;
    //
    // cho việc thêm mới ca tiếp theo
    let startDTG = new Date(
      Utility.fncOffsetTimeUtc(
        `${itemSubmit.ProcessFormNext.StartDTG.toString()}`
      )
    );

    let endDTG = new Date(
      Utility.fncOffsetTimeUtc(
        `${itemSubmit.ProcessFormNext.EndDTG.toString()}`
      )
    );
    itemSubmit.ProcessFormNext.StartDTG = startDTG;
    itemSubmit.ProcessFormNext.EndDTG = endDTG;
    itemSubmit.ProcessFormNext.RefTypeId = itemSubmit.RefTypeId;
    let dutyShift = this.initDutyShiftInfo(itemSubmit);
    dutyShift.StartDTG = startDTG;
    dutyShift.EndDTG = endDTG;
    //////////
    // update status ca hiện tại
    itemSubmit.ProcessFormNext.DutyShift = dutyShift;
    itemSubmit.StatusDutyShift = StatusDutyShift.DaGiaoCa;
    ///
    this.processFormService
      .updateStatusGiaoNhanCaItemParent(itemSubmit)
      .subscribe(
        (result: ResponseModel) => {
          if (this.commonService.checkTypeResponseData(result)) {
            this.toastr.success('Giao nhận ca thành công!', 'Thành công');
            this.item.Version = itemSubmit.Version + 1;
            this.giao_nhan.HideModal();

            // sau khi giao nhận ca xong thì đến màn hình danh sách
            let url = `/processform/reftype/${this.RefTypeModel.Id}`;
            this.commonService.gotoPage(url);
          } else {
            this.toastr.error(`${result.Message}`, 'Lỗi');
            this.giao_nhan.HideModal();
          }
          this.lstFunctionCode = result.FunctionCodes;
          this.loading = false;
        },
        (error) => {
          this.loading = false;
          this.giao_nhan.HideModal();
        }
      );
  }

  initDutyShiftInfo(item: SysProcessFormDeliveyModel): DutyShiftModel {
    let dutyShift: DutyShiftModel = {};
    // ca trực
    dutyShift.ShiftId = item.ProcessFormNext.ShiftId;
    dutyShift.ShiftName = item.ProcessFormNext.ShiftName;

    // xác định ds thành viên
    dutyShift.DutyShiftMembers = item.ProcessFormNext.Members.map((e) => {
      let member: DutyShiftMemberModel = {
        UserId: e.UserId,
        JobTitleId: e.JobTitleId,
        RefTypes: e.RefTypes,
      };
      return member;
    });
    return dutyShift;
  }
}
