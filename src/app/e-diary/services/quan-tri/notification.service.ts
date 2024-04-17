import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { apiUrl, httpOptions } from 'src/app/config';
import { AuthModel } from '../../models/authentication/AuthModel';
import {
  Message,
  NotificationFilterModel,
} from '../../models/quan-tri/NotificationModel';
import { ESConst } from '../../utils/Const';
import { NotificationType } from '../../utils/Enum';
import { Utility } from '../../utils/Utility';
import { setTime } from 'ngx-bootstrap/chronos/utils/date-setters';
import { environment } from 'src/environments/environment';
declare var $: any;

@Injectable({
  providedIn: 'root',
})
export class NotifcationService {
  public baseURL = apiUrl;
  authData: AuthModel = {};

  constructor(private httpClient: HttpClient, public toastr: ToastrService) {
    this.authData = JSON.parse(
      Utility.getLocalStorageWithExpiry(ESConst.LocalStorage.Key.AuthData)
    );
  }

  getPagingItem(filter: NotificationFilterModel): Observable<any> {
    return this.httpClient.post(
      `${apiUrl}api/Admin/Notification/GetPagingItem`,
      filter,
      httpOptions
    );
  }

  ProcessNotification() {
    var source = new EventSource(
      `${apiUrl}api/Admin/Notification/ProcessNotification`,
      { withCredentials: true }
    );
    let variable = this;
    source.onopen = function (event) {
      console.log('connected');
    };

    source.onmessage = function (event) {
      let data = JSON.parse(event.data) as Message;
      if (
        variable.authData.UserId === data.Detail.ProcessUserId ||
        variable.authData.TenantCode !== data.Detail.TenantCode
      )
        return;
      switch (data.NotificationType) {
        case NotificationType.NhanCa:
          variable.ShowToastr(data.Detail.DisplayContent);
          variable.showNotification(data.Detail.DisplayContent, 'NhanCa');
          break;
        case NotificationType.GiaoCa:
          variable.ShowToastr(data.Detail.DisplayContent);
          variable.showNotification(data.Detail.DisplayContent, 'GiaoCa');
          break;
        default:
          break;
      }
    };

    source.onerror = function (event) {
      console.log(`got error, closing connection...`);

      source.close();
    };
  }

  ShowToastr(message) {
    // hide notification with toastr
    // this.toastr.info(message, '', {
    //   enableHtml: true,
    //   positionClass: 'toast-bottom-right',
    // });
    this.AddNumberNoti();
  }

  AddNumberNoti() {
    let number = $('#numberNoti').text();
    $('#numberNoti').text(+number + 1);
    $('#numberNoti').show();
  }

  showNotification(title, tag) {
    const notification = new Notification('NKDT-ES', {
      body: title,
      icon: 'assets/images/logo/logoNKDT-wh.png',
      vibrate: [100, 50, 100],
      data: {
        primaryKey: 1,
      },
    });

    notification.addEventListener('click', () => {
      window.open(environment.apiUrl);
    });
  }
}
