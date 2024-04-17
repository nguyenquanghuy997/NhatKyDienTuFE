import { HttpStatusCode } from '@angular/common/http';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { ReportService } from 'src/app/e-diary/services/reports/report.service';
import { FunctionCode } from 'src/app/e-diary/utils/Enum';
import { Utility } from 'src/app/e-diary/utils/Utility';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.css'],
})
export class ReportListComponent {
  lstFunctionCode: string[];
  FunctionCode = FunctionCode;
  loading = false;

  constructor(
    private title: Title,
    private router: Router,
    private route: ActivatedRoute,
    private reportService: ReportService,
    private toastr: ToastrService,
    private commonService: CommonService
  ) {
    this.title.setTitle(this.route.snapshot.data.title);
    this.loading = true;
    this.reportService.getPageFunctionCodePermission().subscribe(
      (res: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(res)) {
          this.lstFunctionCode = res.FunctionCodes;
        } else {
          this.toastr.error(`${res.Message}`, 'Lỗi');
        }
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        if (error.status === HttpStatusCode.MethodNotAllowed)
          this.lstFunctionCode = error.error.FunctionCodes;
      }
    );
  }
}
