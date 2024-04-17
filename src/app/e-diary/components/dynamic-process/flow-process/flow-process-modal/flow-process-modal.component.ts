import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { error } from 'console';
import { ToastrService } from 'ngx-toastr';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import { ProcessFlowModel } from 'src/app/e-diary/models/nhat-ky-van-hanh/ProcessFlowModel';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { ProcessFlowService } from 'src/app/e-diary/services/dynamic-process/process-flow.service';
import { FunctionCode, Status } from 'src/app/e-diary/utils/Enum';
import { Utility } from 'src/app/e-diary/utils/Utility';

@Component({
  selector: 'app-flow-process-modal',
  templateUrl: './flow-process-modal.component.html',
  styleUrls: ['./flow-process-modal.component.css']
})
export class FlowProcessModalComponent {
  @Input() lstFunctionCode: string[];
  @Input() functionCode: FunctionCode;
  @Input() model: ProcessFlowModel = {
    SubmittedNote: '',
  };

  @Output() onSubmitProcessFlow = new EventEmitter();
  @Output() onApproveProcessFlow = new EventEmitter();
  @Output() onRejectProcessFlow = new EventEmitter();

  Status = Status;
  FunctionCode = FunctionCode;

  popupForm!: FormGroup;
  itemValidate: ProcessFlowModel = {
    SubmittedNote: ''
  };
  submitted: boolean = false;

  //#region Dùng để validate
  get f(): { [key: string]: AbstractControl } {
    return this.popupForm!.controls;
  }
  //#endregion
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private processFlowService: ProcessFlowService,
    private commonService: CommonService,
  ) {
    this.popupForm = this.formBuilder.group({
      Note: [this.model.SubmittedNote, [Validators.maxLength(1000)]],
    });
  }

  HideModal() {
    $('#closeFlowModalButton').click();
  }
  ShowModal() {
    $("#openModalButton").click();
  }

  onSubmit() {
    // thực hiện call các function về phê duyệt động
    if (this.functionCode == FunctionCode.SUBMIT) {
      this.submitItem();
    }
    if (this.functionCode == FunctionCode.APPROVE) {
      this.approveItem();
    }
    if (this.functionCode == FunctionCode.REJECT) {
      this.rejectItem();
    }

  }

  rejectItem() {
    this.processFlowService.RejectedProcess(this.model).subscribe(
      (result: ResponseModel) => {
        if (!this.commonService.checkTypeResponseData(result)) {
          console.error(result.Exception);
          this.toastr.error(`${result.Message}`, 'Lỗi');
          return;
        }

        this.lstFunctionCode = result.FunctionCodes;
        this.toastr.success(`Đã Từ chối bản ghi`, 'Thành công');

        // bắn event ra ngoài để bên ngoài xử lý tiếp
        this.model.Status = result.Data;
        this.onRejectProcessFlow.emit(this.model);
      }
    );
  }
  approveItem() {
    this.processFlowService.ApproveProcess(this.model).subscribe(
      (result: ResponseModel) => {
        if (!this.commonService.checkTypeResponseData(result)) {
          console.error(result.Exception);
          this.toastr.error(`${result.Message}`, 'Lỗi');
          return;
        }

        this.lstFunctionCode = result.FunctionCodes;
        this.toastr.success(`Đã Phê duyệt bản ghi`, 'Thành công');

        // bắn event ra ngoài để bên ngoài xử lý tiếp
        this.model.Status = result.Data;
        this.onApproveProcessFlow.emit(this.model);
      }
    );
  }
  submitItem() {
    this.processFlowService.SubmitProcess(this.model).subscribe(
      (result: ResponseModel) => {
        if (!this.commonService.checkTypeResponseData(result)) {
          console.error(result.Exception);
          this.toastr.error(`${result.Message}`, 'Lỗi');
          return;
        }

        this.lstFunctionCode = result.FunctionCodes;
        this.toastr.success(`Đã Gửi yêu cầu phê duyệt`, 'Thành công');

        // bắn event ra ngoài để bên ngoài xử lý tiếp
        this.model.Status = result.Data;
        this.onSubmitProcessFlow.emit(this.model);
      }
    );
  }

}
