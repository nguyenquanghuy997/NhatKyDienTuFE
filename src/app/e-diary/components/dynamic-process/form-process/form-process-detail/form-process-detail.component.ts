import { Component, ViewChild } from '@angular/core';
import { RefTypeModel } from 'src/app/e-diary/models/cau-hinh/RefTypeModel';
import { TrucCaDetailComponent } from '../truc-ca/truc-ca-detail/truc-ca-detail.component';
import { PhieuLenhDetailComponent } from '../phieu-lenh/phieu-lenh-detail/phieu-lenh-detail.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ESConst } from 'src/app/e-diary/utils/Const';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import { ProcessFormService } from 'src/app/e-diary/services/dynamic-process/process-form.service';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { TrucCaParentDetailComponent } from '../truc-ca-parent/truc-ca-parent-detail/truc-ca-parent-detail.component';
import { FunctionCode } from 'src/app/e-diary/utils/Enum';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-form-process-detail',
  templateUrl: './form-process-detail.component.html',
  styleUrls: ['./form-process-detail.component.css'],
})
export class FormProcessDetailComponent {
  refTypeModel: RefTypeModel;
  refTypeId!: number;
  id!: number;

  FunctionCode = FunctionCode;
  lstFunctionCode: string[];

  @ViewChild('trucCa') pageTrucCa: TrucCaDetailComponent;
  @ViewChild('phieuLenh') pagePhieuLenh: PhieuLenhDetailComponent;
  @ViewChild('trucCaParent') pageTrucCaParent: TrucCaParentDetailComponent;

  constructor(
    private activatedRoute: ActivatedRoute,
    private processFormService: ProcessFormService,
    private toastr: ToastrService,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((val) => {
      let refTypeId = val[ESConst.PatchParams.refTypeId];
      let id = Number.parseInt(val[ESConst.PatchParams.id]);

      if (this.refTypeId != refTypeId || this.id != id) {
        this.refTypeId = refTypeId;
        this.id = id;
        this.getRefTypeData();
      }
    });
  }

  getRefTypeData() {
    this.processFormService
      .getSysRefTypeSetupProcessFormByRefTypeId(this.refTypeId)
      .subscribe(
        (result: ResponseModel) => {
          this.lstFunctionCode = result.FunctionCodes;
          if (!this.commonService.checkTypeResponseData(result)) {
            console.error(result.Exception);
            this.toastr.error(result.Message, 'Lỗi');
            return;
          }

          this.refTypeModel = result.Data;

          if (this.pageTrucCa) {
            this.pageTrucCa.RefTypeModel = this.refTypeModel;
            this.pageTrucCa.Id = this.id;
            this.pageTrucCa.loadData();
          }
          if (this.pagePhieuLenh) {
            this.pagePhieuLenh.RefTypeModel = this.refTypeModel;
            this.pagePhieuLenh.Id = this.id;
            this.pagePhieuLenh.loadData();
          }
          if (this.pageTrucCaParent) {
            this.pageTrucCaParent.RefTypeModel = this.refTypeModel;
            this.pageTrucCaParent.Id = this.id;
            this.pageTrucCaParent.loadData();
          }
        },
        (error) => {
          if (error.status === HttpStatusCode.MethodNotAllowed)
            this.lstFunctionCode = error.error.FunctionCodes;
        }
      );
  }
}
