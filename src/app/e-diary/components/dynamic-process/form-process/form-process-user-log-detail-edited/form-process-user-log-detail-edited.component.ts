import { Component, Input, Renderer2, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
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
  Status,
  StatusDutyShift,
  FunctionCode,
} from 'src/app/e-diary/utils/Enum';
import { FlowProcessListComponent } from '../../flow-process/flow-process-list/flow-process-list.component';
import { FlowProcessModalComponent } from '../../flow-process/flow-process-modal/flow-process-modal.component';
import { GiaoNhanModalComponent } from '../truc-ca/giao-nhan-modal/giao-nhan-modal.component';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-form-process-user-log-detail-edited',
  templateUrl: './form-process-user-log-detail-edited.component.html',
  styleUrls: ['./form-process-user-log-detail-edited.component.css'],
})
export class FormProcessUserLogDetailEditedComponent {
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
  functionCode?: FunctionCode = null;
  showModal: boolean = false;
  private processFormId!: number;
  private refTypeId!: number;
  private flowId!: number;
  private logId!: number;
  ActionParams: string;
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
    private activatedRoute: ActivatedRoute,
    private renderer: Renderer2
  ) {
    this.breadcrumbTitle = this.activatedRoute.snapshot.data.breadcrumbTitle;
    this.title.setTitle(this.activatedRoute.snapshot.data.title);
  }
  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.activatedRoute.queryParams.subscribe(
      (params) => {
        this.refTypeId = Number.parseInt(params.refTypeId);
        this.processFormId = Number.parseInt(params.id);
        if (params.flowId) this.flowId = Number.parseInt(params.flowId);
        if (params.logId) this.logId = Number.parseInt(params.logId);
        console.log('this.flowId: ', this.flowId);
        this.activatedRoute.queryParams;
        if (this.logId) {
          this.processFormService
            .getSysProcessInfoUserLogById(this.logId, this.refTypeId)
            .subscribe(
              (result: ResponseModel) => {
                this.lstFunctionCode = result.FunctionCodes;
                if (!this.commonService.checkTypeResponseData(result)) {
                  this.toastr.error(`${result.Message}`, 'Lỗi');
                  this.loading = false;
                  return;
                }
                if (!result.FunctionCodes.includes(FunctionCode.DISPLAY)) {
                  this.loading = false;
                  this.toastr.error(
                    `Không có quyền xem chi tiết bản ghi`,
                    'Không có quyền!'
                  );
                  return;
                }
                this.functionCode = FunctionCode.DISPLAY;
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
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  bindData() {
    let jsonArray = JSON.parse(this.item.Content);
    console.log('jsonArray: ', jsonArray);
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
  reLoadDataFlow() {
    // tắt popup
    this.flow_process_modal.HideModal();
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
  computeValue(value1: string, value2: string): string {
    return `${moment(value1).format('DD/MM/YYYY HH:mm')} - ${moment(
      value2
    ).format('DD/MM/YYYY HH:mm')}`;
  }
}
