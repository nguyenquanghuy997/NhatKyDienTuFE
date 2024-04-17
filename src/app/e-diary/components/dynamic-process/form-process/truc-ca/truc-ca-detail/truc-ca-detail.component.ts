import { Component, Input, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import { RefTypeModel } from 'src/app/e-diary/models/cau-hinh/RefTypeModel';
import { ProcessFlowModel } from 'src/app/e-diary/models/nhat-ky-van-hanh/ProcessFlowModel';
import { ProcessFormModel } from 'src/app/e-diary/models/nhat-ky-van-hanh/ProcessFormModel';
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
import { GiaoNhanModalComponent } from '../giao-nhan-modal/giao-nhan-modal.component';
import {
  VerifyPasswordModel,
  VerifyTOTPModel,
} from 'src/app/e-diary/models/Commons/VerifyTOTPModel';
import { FormProcessUserLogTabComponent } from '../../form-process-user-log-tab/form-process-user-log-tab.component';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-truc-ca-detail',
  templateUrl: './truc-ca-detail.component.html',
  styleUrls: ['./truc-ca-detail.component.scss'],
})
export class TrucCaDetailComponent {
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

  lstFunctionCode: string[];

  //#region flow
  flowModalTitle: string;
  flowFunctionCode: FunctionCode;
  showModal: boolean = false;
  iframeHeight: number = 500;
  @ViewChild('form_process_user_log_tab')
  form_process_user_log_tab: FormProcessUserLogTabComponent;
  @ViewChild('flow_process_list') flow_process_list: FlowProcessListComponent;
  @ViewChild('flow_process_modal')
  flow_process_modal: FlowProcessModalComponent;
  @ViewChild('verify_totp') verify_totp: GiaoNhanModalComponent;
  //#endregion
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

  loadData() {
    this.loading = true;
    this.processFormService
      .getItemById(this.Id, this.RefTypeModel.Id)
      .subscribe(
        (result: ResponseModel) => {
          this.lstFunctionCode = result.FunctionCodes;
          if (!this.commonService.checkTypeResponseData(result)) {
            console.error(result.Exception);
            this.toastr.error(`${result.Message}`, 'Lỗi');
            this.loading = false;
            return;
          }

          this.item = result.Data;
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
            this.lstFunctionCode = error.error.FunctionCodes;
        }
      );
  }

  bindData() {
    let jsonArray = JSON.parse(this.item.Content);
    $(document).ready(function () {
      if (jsonArray && jsonArray.length > 0) {
        setTimeout(() => {
          jsonArray.forEach((item) => {
            // $("[id='" + item.id + "']").val(item.value);
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
    this.processFormService.deleteProcessForm(item).subscribe(
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

  computeValue(value1: string, value2: string): string {
    return `${moment(value1).format('DD/MM/YYYY HH:mm')} - ${moment(
      value2
    ).format('DD/MM/YYYY HH:mm')}`;
  }

  //#region Luồng giao nhận ca

  // option xác thực qua mã OTP hay CA là radio, ko thể cùng thời
  onGiaoNhanCa() {
    this.verify_totp.ShowModal();
  }

  //#region Verify Giao Nhận ca
  onSubmitModalGiaoNhanCa(event) {
    let verifyTOTPs: VerifyTOTPModel[] = event.VerifyTOTPs;
    let verifyPasswords: VerifyPasswordModel[] = event.VerifyPasswords;
    let shiftIdNext: number = event.ShiftIdNext;
    let inchargeUserIdNext: number = event.InchargeUserIdNext;
    this.GiaoNhanCa(
      verifyTOTPs,
      verifyPasswords,
      shiftIdNext,
      inchargeUserIdNext
    );
  }
  onHideModalGiaoNhanCa() {}
  //#endregion

  GiaoNhanCa(
    verifyTOTPs: VerifyTOTPModel[],
    verifyPasswords: VerifyPasswordModel[],
    shiftIdNext: number,
    inchargeUserIdNext: number
  ) {
    let data: ProcessFormModel = {
      Id: this.Id,
      RefTypeId: this.RefTypeModel.Id,
      Name: this.item.Name,
      Version: this.item.Version,
      StatusDutyShift: StatusDutyShift.DaGiaoCa,
      VerifyTOTPs: verifyTOTPs,
      VerifyPasswords: verifyPasswords,
      InchargeUserId: this.item.InchargeUserId,
      ProcessFormNext: {
        ShiftId: shiftIdNext,
        InchargeUserId: inchargeUserIdNext,
      },
    };
    this.loading = true;
    this.processFormService.updateStatusGiaoNhanCaItem(data).subscribe(
      (result: ResponseModel) => {
        this.lstFunctionCode = result.FunctionCodes;
        if (this.commonService.checkTypeResponseData(result)) {
          this.loading = false;
          this.toastr.success('Giao - Nhận ca thành công!', 'Thành công');
          this.item.StatusDutyShift = data.StatusDutyShift;
          this.item.Version = data.Version;
          this.verify_totp.HideModal();
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
}
