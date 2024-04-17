import { HttpStatusCode } from '@angular/common/http';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import { formMauModel } from 'src/app/e-diary/models/form-mau';
import { FormMauService } from 'src/app/e-diary/services/cau-hinh/form-mau.service';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { ESConst } from 'src/app/e-diary/utils/Const';
import { FunctionCode } from 'src/app/e-diary/utils/Enum';
@Component({
  selector: 'app-form-ck-detail',
  templateUrl: './form-ck-detail.component.html',
})
export class FormCKDetailComponent {
  breadcrumbTitle: string = '';
  loading = true;
  formId!: number;
  formMauDetail!: formMauModel;
  @Input() functionCode: FunctionCode;
  FunctionCode = FunctionCode;
  lstFunctionCode: string[];
  contextFormDong: string;
  @ViewChild('myFrame') myFrame: ElementRef;
  constructor(
    private api: FormMauService,
    public toastr: ToastrService,
    private commonService: CommonService,
    private titleService: Title,
    private activatedRoute: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit() {
    this.breadcrumbTitle = this.activatedRoute.snapshot.data.breadcrumbTitle;
    this.titleService.setTitle(this.activatedRoute.snapshot.data.title);

    this.activatedRoute.params.subscribe((val) => {
      this.formId = val[ESConst.PatchParams.id];
      if (this.formId) {
        this.getFormDetail(val[ESConst.PatchParams.id]);
      } else this.loading = false;
    });
  }

  getFormDetail(formId: number) {
    this.api.getSysFormById(formId).subscribe({
      next: (res: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(res)) {
          this.formMauDetail = res.Data;
        } else {
          this.toastr.error(`${res.Message}`, 'Xóa lỗi');
        }
        this.lstFunctionCode = res.FunctionCodes;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        if (error.status === HttpStatusCode.MethodNotAllowed)
          this.lstFunctionCode = error.error.FunctionCodes;
      },
    });
  }

  //test router cap nhat
  editForm(id: number) {
    return '/configs/form/cap-nhat-form/' + id;
  }
  backToList() {
    return '/configs/form';
  }

  onConfirmDel(item: formMauModel) {
    this.commonService
      .confirm(
        'Xác nhận',
        'Bạn chắc chắn muốn xóa form mẫu : ' + item.Name + ' này?',
        ['Có', 'Không']
      )
      .subscribe((answer) => {
        if (answer) {
          this.DeleteItem(item);
        }
      });
  }

  DeleteItem(item: formMauModel) {
    this.loading = true;
    this.api.deleteSysForm(item).subscribe(
      (result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.toastr.success('Đã xóa thành công!', 'Thành công');

          let urlViewList: string = this.backToList();
          this.commonService.gotoPage(urlViewList);
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
}
