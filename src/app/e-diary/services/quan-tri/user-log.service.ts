import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl, httpOptions } from 'src/app/config';
import { sysUserFilter } from '../../models/quan-tri/sysUserModel';
import { UserLogFilterModel, UserLogModel } from '../../models/quan-tri/UserLogModel';
@Injectable({
  providedIn: 'root'
})

export class UserLogService {

  public baseURL = apiUrl;

  constructor(private httpClient: HttpClient) {
  }

  getPagingItem(filter: UserLogFilterModel): Observable<any> {
    return this.httpClient.post(`${apiUrl}api/Admin/UserLog/GetPagingItem`, filter, httpOptions);
  }

  getItemById(id: number): Observable<UserLogModel> {
    return this.httpClient.get<UserLogModel>(`${apiUrl}api/Admin/UserLog/GetItemByID?id=${id}`, httpOptions);
  }
}
