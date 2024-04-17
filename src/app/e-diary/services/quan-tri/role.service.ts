import { Injectable } from '@angular/core';
import { RoleModel, RoleModelFilter } from '../../models/quan-tri/RoleModel';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrl, httpOptions } from 'src/app/config';
import { ResponseModel } from '../../models/Commons/ResponseModel';
import { DeleteModel } from '../../models/Commons/DeleteModel';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  constructor(private httpClient: HttpClient) {}

  getPagingItem(filter: RoleModelFilter): Observable<ResponseModel> {
    let url = `${apiUrl}api/Admin/Role/GetPagingItem`;
    let result = this.httpClient.post<ResponseModel>(url, filter, httpOptions);
    return result;
  }

  getListItem(filter: RoleModelFilter): Observable<ResponseModel> {
    let url = `${apiUrl}api/Admin/Role/GetListItem`;
    let result = this.httpClient.post<ResponseModel>(url, filter, httpOptions);
    return result;
  }

  getItemById(id: number): Observable<ResponseModel> {
    let url = `${apiUrl}api/Admin/Role/GetItemById?id=${id}`;
    let result = this.httpClient.get<ResponseModel>(url, httpOptions);
    return result;
  }

  getItemEditById(id: number): Observable<ResponseModel> {
    let url = `${apiUrl}api/Admin/Role/GetItemEditById?id=${id}`;
    let result = this.httpClient.get<ResponseModel>(url, httpOptions);
    return result;
  }

  deleteItem(item: DeleteModel): Observable<ResponseModel> {
    let url = `${apiUrl}api/Admin/Role/DeleteItem`;
    let result = this.httpClient.post<ResponseModel>(url, item, httpOptions);
    return result;
  }

  updateItem(item: RoleModel): Observable<ResponseModel> {
    let url = `${apiUrl}api/Admin/Role/UpdateItem`;
    let result = this.httpClient.post<ResponseModel>(url, item, httpOptions);
    return result;
  }

  createItem(item: RoleModel): Observable<ResponseModel> {
    let url = `${apiUrl}api/Admin/Role/AddNewItem`;
    let result = this.httpClient.post<ResponseModel>(url, item, httpOptions);
    return result;
  }
}
