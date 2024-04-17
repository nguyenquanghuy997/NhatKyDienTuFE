import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import { ESConst } from 'src/app/e-diary/utils/Const';
import { PhieuLenhAddnewComponent } from '../phieu-lenh/phieu-lenh-addnew/phieu-lenh-addnew.component';
import { RefTypeModel } from 'src/app/e-diary/models/cau-hinh/RefTypeModel';
import { ProcessFormService } from 'src/app/e-diary/services/dynamic-process/process-form.service';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { FunctionCode } from 'src/app/e-diary/utils/Enum';
import { error } from 'console';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-form-process-addnew',
  templateUrl: './form-process-addnew.component.html',
  styleUrls: ['./form-process-addnew.component.css'],
})
export class FormProcessAddnewComponent {
  refTypeModel: RefTypeModel;
  refTypeId!: number;
  isReload: boolean = false;

  FunctionCode = FunctionCode;
  lstFunctionCode: string[];

  // @ViewChild('trucCa') pageTrucCa: TrucCaDetailComponent;
  @ViewChild('phieuLenh') pagePhieuLenh: PhieuLenhAddnewComponent;

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

          // CaTruc có popup thêm nhanh cho ca hiện tại, ko có page riêng
          // if (this.pageTrucCa && this.isReload) {
          //   this.pageTrucCa.refTypeId = this.refTypeModel.Id;
          //   this.pageTrucCa.id = this.id;
          //   this.pageTrucCa.loadData();
          // }
          if (this.pagePhieuLenh && this.isReload) {
            this.pagePhieuLenh.RefTypeModel = this.refTypeModel;
            this.pagePhieuLenh.setupForm();
          }
        },
        (error) => {
          if (error.status === HttpStatusCode.MethodNotAllowed)
            this.lstFunctionCode = error.error.FunctionCodes;
        }
      );
  }
}
