import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import { ProcessFormModel } from 'src/app/e-diary/models/nhat-ky-van-hanh/ProcessFormModel';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { ProcessFormService } from 'src/app/e-diary/services/dynamic-process/process-form.service';
import { FunctionCode } from 'src/app/e-diary/utils/Enum';

@Component({
  selector: 'app-chi-tiet',
  templateUrl: './chi-tiet.component.html',
  styleUrls: ['./chi-tiet.component.css'],
})
export class ChiTietComponent {
  title = 'Chi tiết nhật ký';
  loading = true;
  htmlContext: string = ``;
  private processFormId!: number;
  private formSettingId!: number;
  private refTypeId!: number;
  FunctionCode = FunctionCode;
  lstFunctionCode: string[];
  item!: ProcessFormModel;
  constructor(
    public toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private api: ProcessFormService,
    private commonService: CommonService
  ) {}
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.refTypeId = Number.parseInt(params.refTypeId);
      this.processFormId = Number.parseInt(params.id);
      this.activatedRoute.queryParams;
      if (this.processFormId) {
        this.loadData();
      } else this.loading = false;
    });
  }

  loadData() {
    this.loading = true;
    this.api.getItemSearchById(this.processFormId, this.refTypeId).subscribe(
      (result: ResponseModel) => {
        this.lstFunctionCode = result.FunctionCodes;
        if (!this.commonService.checkTypeResponseData(result)) {
          console.error(result.Exception);
          this.toastr.error(`${result.Message}`, 'Lỗi');
          this.loading = false;
          return;
        }

        this.item = result.Data;
        if (!result.Data.Context || result.Data.Context == null) {
          this.toastr.error(`Không tìm thấy thiết kế form`, 'Lỗi!');
          return;
        }
        this.bindData();
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  bindData() {
    let jsonArray = JSON.parse(this.item.Content);
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

  computeValue(value1: string, value2: string): string {
    if (value1 == null || value2 == null) return '';
    return `${moment(value1).format('DD/MM/YYYY HH:mm')} - ${moment(
      value2
    ).format('DD/MM/YYYY HH:mm')}`;
  }
}
