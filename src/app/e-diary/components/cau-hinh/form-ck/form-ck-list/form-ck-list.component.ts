import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PagingModel } from 'src/app/e-diary/models/Commons/PagingModel';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import { PagingConfig } from 'src/app/e-diary/models/PagingConfig';
import {
  formMauModel,
  formMauModelFilter,
} from 'src/app/e-diary/models/form-mau';
import { FormMauService } from 'src/app/e-diary/services/cau-hinh/form-mau.service';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { FunctionCode, ResponseTypeES } from 'src/app/e-diary/utils/Enum';

@Component({
  selector: 'app-form-ck-list',
  templateUrl: './form-ck-list.component.html',
  styleUrls: ['./form-ck-list.component.css'],
})
export class FormCkListComponent {
  breadcrumbTitle: string = '';
  listForm: formMauModel[] = [];
  loading = true;
  pageIndex: number = 1;
  totalItem: number = 0;
  pageSize: number = 10;
  tableSizes: any = [10, 15, 20];
  pageCount: number[] = [];
  pagingConfig: PagingConfig = {} as PagingConfig;
  Keyword: string = '';
  params: any = {
    PageIndex: this.pageIndex,
    Keyword: '',
    PageSize: this.pageSize,
  };

  errorMsg: string = '';
  searchForm!: FormGroup;
  answers: string[] = [];
  functionCode?: FunctionCode = null;

  //#region FunctionCodes allow permission
  lstFunctionCode: string[];
  //#endregion

  FunctionCode = FunctionCode;

  constructor(
    private formMauService: FormMauService,
    private titleService: Title,
    public toastr: ToastrService,
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute,
    public router: Router
  ) {
    this.searchForm = new FormGroup({
      name: new FormControl(''),
      status: new FormControl(-1),
    });

    this.pagingConfig = {
      itemsPerPage: this.pageSize,
      currentPage: this.pageIndex,
      totalItems: this.totalItem,
    };
  }

  isCollapse = false;
  onHideShow() {
    this.isCollapse = !this.isCollapse;
  }
  resetForm(): void {
    // this.searchForm.reset();
    this.searchForm = new FormGroup({
      name: new FormControl(''),
      status: new FormControl(-1),
    });
  }
  confirmDel(id: number, model: formMauModel) {
    this.commonService
      .confirm(
        'Xác nhận',
        'Bạn chắc chắn muốn xóa form: ' + model.Name + ' này?',
        ['Có', 'Không']
      )
      .subscribe((answer) => {
        console.log('answer==', answer);
        this.answers.push(answer);
        if (answer) {
          this.onDelete(id, model);
        }
      });
  }

  ngOnInit(): void {
    this.breadcrumbTitle = this.activatedRoute.snapshot.data.breadcrumbTitle;
    this.titleService.setTitle(this.activatedRoute.snapshot.data.title);
    this.onSearch();
  }

  public onSearch(reset: boolean = false): void {
    console.log(this.searchForm.value);
    let status =
      this.searchForm.value.status === -1 ||
      this.searchForm.value.status.toString() === '-1'
        ? null
        : this.searchForm.value.status == 1;
    let formMauModel: formMauModelFilter = {
      PageIndex: this.pageIndex,
      PageSize: this.pageSize,
      Name: this.searchForm.value.name,
      IsActive: status,
    };
    this.loading = true;
    this.formMauService.getFormsPaging(formMauModel).subscribe(
      (result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.totalItem = result.Data.TotalRecords;
          this.pageCount = new Array(result.Data.PageCount);
          this.listForm = result.Data.Items;
        } else {
          this.toastr.error(`${result.Message}`, 'Lỗi');
        }
        this.lstFunctionCode = result.FunctionCodes;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        if (error.status === HttpStatusCode.MethodNotAllowed)
          this.lstFunctionCode = error.error.FunctionCodes;
      }
    );
  }

  onTableDataChange(event: any) {
    this.loading = true;
    this.pageIndex = event;
    this.params.PageIndex = event;
    this.params.PageSize = this.pageSize;

    this.onSearch();
  }

  onTableSizeChange(event: any): void {
    console.log('event.target.value==', event.target.value);
    this.pageSize = event.target.value;
    this.pageIndex = 1;
    this.onSearch();
  }

  changePagination(pagingConfig: PagingModel) {
    this.pageSize = pagingConfig.PageSize;
    this.pageIndex = pagingConfig.PageIndex;
    this.onSearch();
  }
  addForm() {
    return '/configs/form/them-form-mau';
  }
  editForm(id: number) {
    return '/configs/form/cap-nhat-form/' + id;
  }

  detailForm(id: number) {
    return '/configs/form/chi-tiet-form/' + id;
  }

  public onDelete(id: number, model: formMauModel) {
    this.loading = true;
    this.formMauService.deleteSysForm(model).subscribe(
      (result: ResponseModel) => {
        if (result.Type == ResponseTypeES.Success) {
          this.toastr.success('Đã xóa thành công!', 'Thành công');
          this.onSearch();
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
