import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { sysUserChangePassModel } from '../../models/quan-tri/sysUserModel';
import { sysUserFilter } from '../../models/quan-tri/sysUserModel';
import { sysUserModel } from '../../models/quan-tri/sysUserModel';
import { apiUrl, httpOptions } from 'src/app/config';
import { ResponseModel } from '../../models/Commons/ResponseModel';
import { DeleteModel } from '../../models/Commons/DeleteModel';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  public baseURL = apiUrl;

  constructor(private httpClient: HttpClient) {}

  getDataSetupFormView(): Observable<ResponseModel> {
    return this.httpClient.get<ResponseModel>(
      `${apiUrl}api/Admin/User/GetDataSetupFormView`,
      httpOptions
    );
  }

  getPagingItem(filter: sysUserFilter): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(
      `${apiUrl}api/Admin/User/GetPagingItem`,
      filter,
      httpOptions
    );
  }

  getListItem(filter: sysUserFilter): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(
      `${apiUrl}api/Admin/User/GetListItem`,
      filter,
      httpOptions
    );
  }

  getSecretKeyById(id: number): Observable<ResponseModel> {
    return this.httpClient.get<ResponseModel>(
      `${apiUrl}api/Admin/User/GetSecretKeyByID?id=${id}`,
      httpOptions
    );
  }

  getItemById(id: number): Observable<ResponseModel> {
    return this.httpClient.get<ResponseModel>(
      `${apiUrl}api/Admin/User/GetItemByID?id=${id}`,
      httpOptions
    );
  }

  getItemEditById(id: number): Observable<ResponseModel> {
    return this.httpClient.get<ResponseModel>(
      `${apiUrl}api/Admin/User/GetItemEditByID?id=${id}`,
      httpOptions
    );
  }

  addnewItem(item: sysUserModel): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(
      `${apiUrl}api/Admin/User/AddNewItem`,
      item,
      httpOptions
    );
  }

  updateItem(item: sysUserModel): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(
      `${apiUrl}api/Admin/User/UpdateItem`,
      item,
      httpOptions
    );
  }

  deleteItem(item: DeleteModel): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(
      `${apiUrl}api/Admin/User/DeleteItem`,
      item,
      httpOptions
    );
  }

  changePassword(item: sysUserChangePassModel): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(
      `${apiUrl}api/Admin/User/ChangePassword`,
      item,
      httpOptions
    );
  }

  resetPassword(item: sysUserChangePassModel): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(
      `${apiUrl}api/Admin/User/ResetPassword`,
      item,
      httpOptions
    );
  }
}
