import { Component, Input, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import { RefTypeModel } from 'src/app/e-diary/models/cau-hinh/RefTypeModel';
import { ProcessFlowModel } from 'src/app/e-diary/models/nhat-ky-van-hanh/ProcessFlowModel';
import { ProcessFormModel } from 'src/app/e-diary/models/nhat-ky-van-hanh/ProcessFormModel';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { ProcessFormService } from 'src/app/e-diary/services/dynamic-process/process-form.service';
import { ESConst } from 'src/app/e-diary/utils/Const';
import { FunctionCode, Status } from 'src/app/e-diary/utils/Enum';
import { FlowProcessListComponent } from '../../../flow-process/flow-process-list/flow-process-list.component';
import { FlowProcessModalComponent } from '../../../flow-process/flow-process-modal/flow-process-modal.component';
import { FormProcessUserLogTabComponent } from '../../form-process-user-log-tab/form-process-user-log-tab.component';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-phieu-lenh-detail',
  templateUrl: './phieu-lenh-detail.component.html',
  styleUrls: ['./phieu-lenh-detail.component.css'],
})
export class PhieuLenhDetailComponent {
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
  FunctionCode = FunctionCode;
  DicStatusStyle = ESConst.DicStatusStyle;
  DicStatusStyleInput = ESConst.DicStatusStyleInput;
  DicStatusDesc = ESConst.DicStatusDesc;

  lstFunctionCode: string[];

  //#region flow
  flowModalTitle: string;
  flowFunctionCode: FunctionCode;
  //#endregion
  @ViewChild('form_process_user_log_tab')
  form_process_user_log_tab: FormProcessUserLogTabComponent;
  @ViewChild('flow_process_list') flow_process_list: FlowProcessListComponent;
  @ViewChild('flow_process_modal')
  flow_process_modal: FlowProcessModalComponent;
  constructor(
    private processFormService: ProcessFormService,
    public toastr: ToastrService,
    private title: Title,
    public router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService
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
    // load lại ds flowprocess
    this.flow_process_list.loadData();
    // load lại ds lịch sử thao tác
    this.form_process_user_log_tab.onSearchData(1);

    // tắt popup
    this.flow_process_modal.HideModal();
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
}
