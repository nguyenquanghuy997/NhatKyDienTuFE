import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RefTypeService } from 'src/app/e-diary/services/cau-hinh/ref-type.service';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import { RefTypeModel } from 'src/app/e-diary/models/cau-hinh/RefTypeModel';
import { ToastrService } from 'ngx-toastr';
import { ESConst } from 'src/app/e-diary/utils/Const';
import { Utility } from 'src/app/e-diary/utils/Utility';
import { TrucCaListComponent } from '../truc-ca/truc-ca-list/truc-ca-list.component';
import { PhieuLenhListComponent } from '../phieu-lenh/phieu-lenh-list/phieu-lenh-list.component';
import { ProcessFormService } from 'src/app/e-diary/services/dynamic-process/process-form.service';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { TrucCaParentListComponent } from '../truc-ca-parent/truc-ca-parent-list/truc-ca-parent-list.component';
import { FunctionCode } from 'src/app/e-diary/utils/Enum';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-form-process-list',
  templateUrl: './form-process-list.component.html',
})
export class FormProcessListComponent {
  refTypeModel: RefTypeModel;
  refTypeId!: number;
  isReload: boolean = false;

  FunctionCode = FunctionCode;
  lstFunctionCode: string[];

  @ViewChild('trucCaParent') pageTrucCaParent: TrucCaParentListComponent;
  @ViewChild('trucCa') pageTrucCa: TrucCaListComponent;
  @ViewChild('phieuLenh') pagePhieuLenh: PhieuLenhListComponent;

  constructor(
    private activatedRoute: ActivatedRoute,
    private processFormService: ProcessFormService,
    private toastr: ToastrService,
    private router: Router,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((val) => {
      let refTypeId = val[ESConst.PatchParams.refTypeId];
      if (this.refTypeId != refTypeId) {
        if (this.refTypeId) this.isReload = true;
        this.refTypeId = refTypeId;
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

          if (this.pageTrucCaParent && this.isReload) {
            this.pageTrucCaParent.RefTypeModel = this.refTypeModel;
            this.pageTrucCaParent.clearFilterData();
            this.pageTrucCaParent.loadData(1);
          } else if (this.pageTrucCa && this.isReload) {
            this.pageTrucCa.RefTypeModel = this.refTypeModel;
            this.pageTrucCa.clearFilterData();
            this.pageTrucCa.loadData(1);
          } else if (this.pagePhieuLenh && this.isReload) {
            this.pagePhieuLenh.RefTypeModel = this.refTypeModel;
            this.pagePhieuLenh.clearFilterData();
            this.pagePhieuLenh.loadData(1);
          }
        },
        (error) => {
          if (error.status === HttpStatusCode.MethodNotAllowed)
            this.lstFunctionCode = error.error.FunctionCodes;
        }
      );
  }
}
