import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, catchError, throwError } from 'rxjs';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import { CommonService } from 'src/app/e-diary/services/common.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private commonService: CommonService,
    private toastr: ToastrService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((response: HttpErrorResponse) => {
        // chưa đăng nhập
        if (response.status === HttpStatusCode.Unauthorized) {
          this.commonService.gotoLoginPage();
        } else {
          console.error(response);
          // với các lỗi định danh (405, 500, 501, ... thì có dữ liệu ResponseModel)
          let data = response.error as ResponseModel;
          // các lỗi handled không có quyền
          if (response.status === HttpStatusCode.MethodNotAllowed) {
            this.toastr.error(data.Message, 'Lỗi phân quyền');
          }
          // các lỗi handled theo data input
          else if (response.status === HttpStatusCode.InternalServerError) {
            this.toastr.error(data.Message, 'Lỗi dữ liệu');
          }
          // các lỗi handled cần xử lý
          else if (response.status === HttpStatusCode.NotImplemented) {
            this.toastr.error(data.Message, 'Lỗi');
          }
          // các lỗi unhandled
          else {
            this.toastr.error(
              response.message,
              'Liên hệ quản trị để được hỗ trợ'
            );
          }
        }
        throw response;
        // return throwError(() => new Error(response));
      })
    );
  }
}
