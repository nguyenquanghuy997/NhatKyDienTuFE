import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ConfirmDialogComponent } from 'src/app/component/confirm-dialog/confirm-dialog.component';
import { ResponseModel } from '../models/Commons/ResponseModel';
import { apiUrl, httpOptions } from 'src/app/config';
import { HttpClient } from '@angular/common/http';
import { ResponseTypeES } from '../utils/Enum';
import { ESConst } from '../utils/Const';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  bsModalRef!: BsModalRef;

  constructor(
    private bsModalService: BsModalService,
    private httpClient: HttpClient,
    private router: Router
  ) { }

  confirm(
    title: string,
    message: string,
    options: string[]
  ): Observable<string> {
    const initialState = {
      title: title,
      message: message,
      options: options,
      answer: false,
    };
    this.bsModalRef = this.bsModalService.show(ConfirmDialogComponent, {
      class: 'modal-dialog-centered',
      initialState,
    });

    return new Observable<string>(this.getConfirmSubscriber());
  }

  private getConfirmSubscriber() {
    return (observer: any) => {
      const subscription = this.bsModalService.onHidden.subscribe(
        (reason: string) => {
          observer.next(this.bsModalRef.content.answer);
          observer.complete();
        }
      );

      return {
        unsubscribe() {
          subscription.unsubscribe();
        },
      };
    };
  }

  getListTable(): Observable<ResponseModel> {
    let url = `${apiUrl}api/Commons/Utility/GetListTable`;
    let result = this.httpClient.get<ResponseModel>(url, httpOptions);
    return result;
  }

  convertToLocalDate(responseDate: any, format?: string) {
    try {
      if (format == null) {
        if (responseDate != null) {
          if (typeof (responseDate) === 'string') {
            if (String(responseDate.indexOf('T') >= 0)) {
              responseDate = responseDate.split('T')[0];
            }
            if (String(responseDate.indexOf('+') >= 0)) {
              responseDate = responseDate.split('+')[0];
            }
          }

          responseDate = new Date(responseDate);
          let newDate = new Date(responseDate.getFullYear(), responseDate.getMonth(), responseDate.getDate(), 0, 0, 0);
          let userTimezoneOffset = newDate.getTimezoneOffset() * 60000;

          let finalDate: Date = new Date(newDate.getTime() - userTimezoneOffset);
          return finalDate;
        } else {
          return null;
        }
      }
      else { // contain 3 element dd;MM;yyyy
        let elementFormat: string[] = [];
        let elementDate: number[] = [];
        if (format.indexOf("/") >= 0) {
          elementFormat = format.split("/");
          elementDate = responseDate.split("/");

        }
        else if (format.indexOf("-") >= 0) {
          elementFormat = format.split("-");
          elementDate = responseDate.split("-");
        }

        let iDayFormat = elementFormat.indexOf('dd');
        let iMonthFormat = elementFormat.indexOf('MM');
        let iYearFormat = elementFormat.indexOf('yyyy');

        let day = elementDate[iDayFormat];
        let month = elementDate[iMonthFormat];
        let year = elementDate[iYearFormat];

        let newDate = new Date(year, month - 1, day, 0, 0, 0);
        let userTimezoneOffset = newDate.getTimezoneOffset() * 60000;

        let finalDate: Date = new Date(newDate.getTime() - userTimezoneOffset);
        return finalDate;
      }
    } catch (error) {
      return responseDate;
    }
  }

  gotoLoginPage(url?: string) {
    localStorage.clear();
    if (!url || url == 'authentication/login') url = '/home';

    // this.router.navigateByUrl(`authentication/login?returnUrl=${url}`);
    window.location.href = `authentication/login?returnUrl=${url}`;
  }

  gotoHomePage(isNavigate: boolean) {
    if (isNavigate)
      this.router.navigateByUrl('home');
    else
      window.location.href = '/home';
  }

  gotoPage(url: string, isNavigate: boolean = true) {
    if (url && url != '/') {
      if (isNavigate)
        this.router.navigateByUrl(url);
      else
        window.location.href = url;
    }
    else this.gotoHomePage(isNavigate);
  }

  checkTypeResponseData(
    result: ResponseModel
  ): boolean {
    if (result.Type == ResponseTypeES.Success) {
      return true;
    } else if (result.Type == ResponseTypeES.LoginRequired) {
      this.gotoLoginPage(this.router?.url);
    } else {
      console.error(result.Exception);
      return false;
    }
  }

}
