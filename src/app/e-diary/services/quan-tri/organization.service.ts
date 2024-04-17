import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl, httpOptions } from 'src/app/config';
import {
  OrganizationModel,
  OrganizationModelFilter,
} from '../../models/quan-tri/OrganizationModel';
import { ResponseModel } from '../../models/Commons/ResponseModel';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  constructor(private httpClient: HttpClient) {}

  getListItem(filter: OrganizationModelFilter): Observable<ResponseModel> {
    let url = `${apiUrl}api/Admin/Organization/GetListItem`;
    let result = this.httpClient.post<ResponseModel>(url, filter, httpOptions);
    return result;
  }
  GetListItemBuildTree(
    filter: OrganizationModelFilter
  ): Observable<ResponseModel> {
    let url = `${apiUrl}api/Admin/Organization/GetAllListItemBuildTree`;
    let result = this.httpClient.post<ResponseModel>(url, filter, httpOptions);
    return result;
  }
  createItem(item: OrganizationModel): Observable<ResponseModel> {
    let url = `${apiUrl}api/Admin/Organization/AddNewItem`;
    let result = this.httpClient.post<ResponseModel>(url, item, httpOptions);
    return result;
  }
  updateItem(item: OrganizationModel): Observable<ResponseModel> {
    let url = `${apiUrl}api/Admin/Organization/UpdateItem`;
    let result = this.httpClient.post<ResponseModel>(url, item, httpOptions);
    return result;
  }
  deleteItem(item: OrganizationModel): Observable<ResponseModel> {
    let url = `${apiUrl}api/Admin/Organization/DeleteItem`;
    let result = this.httpClient.post<ResponseModel>(url, item, httpOptions);
    return result;
  }
  getItemById(id: number): Observable<ResponseModel> {
    let url = `${apiUrl}api/Admin/Organization/GetItemById?id=${id}`;
    let result = this.httpClient.get<ResponseModel>(url, httpOptions);
    return result;
  }
  getItemEditById(id: number): Observable<ResponseModel> {
    let url = `${apiUrl}api/Admin/Organization/GetItemEditById?id=${id}`;
    let result = this.httpClient.get<ResponseModel>(url, httpOptions);
    return result;
  }
}
