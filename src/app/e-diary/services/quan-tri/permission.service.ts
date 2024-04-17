import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrl, httpOptions } from 'src/app/config';
import { ResponseModel } from '../../models/Commons/ResponseModel';
import { PermissionFilter, PermissionGrant } from '../../models/quan-tri/PermissionModel';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {

  constructor(private httpClient: HttpClient) { }

  getListItem(filter: PermissionFilter): Observable<ResponseModel> {
    let url = `${apiUrl}api/Admin/Permission/GetListItem`;
    let result = this.httpClient.post<ResponseModel>(url, filter, httpOptions);
    return result;
  }

  getListItemBuildTree(filter: PermissionFilter): Observable<ResponseModel> {
    let url = `${apiUrl}api/Admin/Permission/GetListItemBuildTree`;
    let result = this.httpClient.post<ResponseModel>(url, filter, httpOptions);
    return result;
  }

  grantPermission(permission: PermissionGrant): Observable<ResponseModel> {
    let url = `${apiUrl}api/Admin/Permission/GrantPermission`;
    let result = this.httpClient.post<ResponseModel>(url, permission, httpOptions);
    return result;
  }

  setupFormView(): Observable<ResponseModel> {
    let url = `${apiUrl}api/Admin/Permission/GetDataSetupFormView`;
    let result = this.httpClient.get<ResponseModel>(url, httpOptions);
    return result;
  }
}
