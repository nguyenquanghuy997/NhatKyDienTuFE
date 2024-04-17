import { Injectable } from '@angular/core';
import {
  FunctionFilter,
  FunctionModel,
} from '../../models/quan-tri/FunctionModel';
import { HttpClient } from '@angular/common/http';
import { ResponseModel } from '../../models/Commons/ResponseModel';
import { Observable } from 'rxjs';
import { apiUrl, httpOptions } from 'src/app/config';
import { DeleteModel } from '../../models/Commons/DeleteModel';

@Injectable({
  providedIn: 'root',
})
export class FunctionService {
  constructor(private httpClient: HttpClient) {}

  deleteItem(item: DeleteModel): Observable<ResponseModel> {
    let url = `${apiUrl}api/Admin/Function/DeleteItem`;
    let result = this.httpClient.post<ResponseModel>(url, item, httpOptions);
    return result;
  }
  updateItem(item: FunctionModel): Observable<ResponseModel> {
    let url = `${apiUrl}api/Admin/Function/UpdateItem`;
    let result = this.httpClient.post<ResponseModel>(url, item, httpOptions);
    return result;
  }
  createItem(item: FunctionModel): Observable<ResponseModel> {
    let url = `${apiUrl}api/Admin/Function/AddNewItem`;
    let result = this.httpClient.post<ResponseModel>(url, item, httpOptions);
    return result;
  }
  getItemById(id: number): Observable<ResponseModel> {
    let url = `${apiUrl}api/Admin/Function/GetItemById?id=${id}`;
    let result = this.httpClient.get<ResponseModel>(url, httpOptions);
    return result;
  }
  getItemEditById(id: number): Observable<ResponseModel> {
    let url = `${apiUrl}api/Admin/Function/GetItemEditById?id=${id}`;
    let result = this.httpClient.get<ResponseModel>(url, httpOptions);
    return result;
  }
  getPagingItem(filter: FunctionFilter): Observable<ResponseModel> {
    let url = `${apiUrl}api/Admin/Function/GetPagingItem`;
    let result = this.httpClient.post<ResponseModel>(url, filter, httpOptions);
    return result;
  }
}
