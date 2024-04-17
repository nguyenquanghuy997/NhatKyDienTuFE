import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import {
  ProcessFlowActiveModel,
  ProcessFlowFilter,
  ProcessFlowModel,
} from 'src/app/e-diary/models/nhat-ky-van-hanh/ProcessFlowModel';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { ProcessFlowService } from 'src/app/e-diary/services/dynamic-process/process-flow.service';
import { ESConst } from 'src/app/e-diary/utils/Const';
import { Utility } from 'src/app/e-diary/utils/Utility';

@Component({
  selector: 'app-flow-process-list',
  templateUrl: './flow-process-list.component.html',
  styleUrls: ['./flow-process-list.component.css'],
})
export class FlowProcessListComponent {
  @Input() refId: number;
  @Input() refTypeId: number;
  @Input() title: string = 'Thông tin phê duyệt';
  @Input() titleGrid: string = 'Tiến độ phê duyệt';

  processFlow: ProcessFlowModel;
  lstItem: ProcessFlowActiveModel[] = [];
  loading = false;

  DicStatusStyle = ESConst.DicStatusStyle;
  DicStatusDesc = ESConst.DicStatusDesc;

  constructor(
    private processService: ProcessFlowService,
    private router: Router,
    public toastr: ToastrService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.processService
      .GetItemForProcessView(this.refId, this.refTypeId)
      .subscribe(
        (res: ResponseModel) => {
          if (this.commonService.checkTypeResponseData(res)) {
            this.processFlow = res.Data;
            this.lstItem = this.processFlow?.ProcessFlowActives ?? [];
          } else {
            this.toastr.error(`${res.Message}`, 'Lỗi');
          }
          this.loading = false;
        },
        (error) => {
          this.loading = false;
        }
      );
  }
}
