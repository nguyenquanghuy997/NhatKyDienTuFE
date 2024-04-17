import { Component, ViewChild } from '@angular/core';
import { RefTypeModel } from 'src/app/e-diary/models/cau-hinh/RefTypeModel';
import { TrucCaEditComponent } from '../truc-ca/truc-ca-edit/truc-ca-edit.component';
import { ActivatedRoute, Router } from '@angular/router';
import { RefTypeService } from 'src/app/e-diary/services/cau-hinh/ref-type.service';
import { ToastrService } from 'ngx-toastr';
import { ESConst } from 'src/app/e-diary/utils/Const';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import { Utility } from 'src/app/e-diary/utils/Utility';
import { PhieuLenhEditComponent } from '../phieu-lenh/phieu-lenh-edit/phieu-lenh-edit.component';
import { ProcessFormService } from 'src/app/e-diary/services/dynamic-process/process-form.service';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { TrucCaParentEditComponent } from '../truc-ca-parent/truc-ca-parent-edit/truc-ca-parent-edit.component';
import { FunctionCode } from 'src/app/e-diary/utils/Enum';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-form-process-edit',
  templateUrl: './form-process-edit.component.html',
  styleUrls: ['./form-process-edit.component.css'],
})
export class FormProcessEditComponent {
  refTypeModel: RefTypeModel;
  refTypeId!: number;
  id!: number;
  isReload: boolean = false;

  FunctionCode = FunctionCode;
  lstFunctionCode: string[];

  @ViewChild('trucCaParent') pageTrucCaParent: TrucCaParentEditComponent;
  @ViewChild('trucCa') pageTrucCa: TrucCaEditComponent;
  @ViewChild('phieuLenh') pagePhieuLenh: PhieuLenhEditComponent;

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
      let id = Number.parseInt(val[ESConst.PatchParams.id]);

      if (this.refTypeId != refTypeId || this.id != id) {
        if (this.refTypeId || this.id) this.isReload = true;
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
          if (this.pageTrucCaParent && this.isReload) {
            this.pageTrucCaParent.RefTypeModel = this.refTypeModel;
            this.pageTrucCaParent.id = this.id;
            this.pageTrucCaParent.loadData();
          }
          if (this.pageTrucCa && this.isReload) {
            this.pageTrucCa.RefTypeModel = this.refTypeModel;
            this.pageTrucCa.id = this.id;
            this.pageTrucCa.loadData();
          } else if (this.pagePhieuLenh && this.isReload) {
            this.pageTrucCa.RefTypeModel = this.refTypeModel;
            this.pageTrucCa.id = this.id;
            this.pagePhieuLenh.loadData();
          }
        },
        (error) => {
          if (error.status === HttpStatusCode.MethodNotAllowed)
            this.lstFunctionCode = error.error.FunctionCodes;
        }
      );
  }
}
