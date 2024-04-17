import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseModel } from '../../models/Commons/ResponseModel';
import { RuleFilter, RuleModel } from '../../models/quan-tri/RuleModel';
import { apiUrl, httpOptions } from 'src/app/config';
import { Observable } from 'rxjs';
import { DeleteModel } from '../../models/Commons/DeleteModel';

@Injectable({
  providedIn: 'root',
})
export class RuleService {
  constructor(private httpClient: HttpClient) {}

  getListItem(filter: RuleFilter): Observable<ResponseModel> {
    let url = `${apiUrl}api/Admin/Rule/GetListItem`;
    let result = this.httpClient.post<ResponseModel>(url, filter, httpOptions);
    return result;
  }

  getPagingItem(filter: RuleFilter): Observable<ResponseModel> {
    let url = `${apiUrl}api/Admin/Rule/GetPagingItem`;
    return this.httpClient.post<ResponseModel>(url, filter, httpOptions);
  }

  getItemById(id: number): Observable<ResponseModel> {
    let url = `${apiUrl}api/Admin/Rule/GetItemById?id=${id}`;
    return this.httpClient.get<ResponseModel>(url, httpOptions);
  }

  getItemEditById(id: number): Observable<ResponseModel> {
    let url = `${apiUrl}api/Admin/Rule/GetItemEditById?id=${id}`;
    return this.httpClient.get<ResponseModel>(url, httpOptions);
  }

  createItem(item: RuleModel): Observable<ResponseModel> {
    let url = `${apiUrl}api/Admin/Rule/AddNewItem`;
    return this.httpClient.post<ResponseModel>(url, item, httpOptions);
  }

  updateItem(item: RuleModel): Observable<ResponseModel> {
    let url = `${apiUrl}api/Admin/Rule/UpdateItem`;
    return this.httpClient.post<ResponseModel>(url, item, httpOptions);
  }

  deleteItem(item: DeleteModel): Observable<ResponseModel> {
    let url = `${apiUrl}api/Admin/Rule/DeleteItem`;
    return this.httpClient.post<ResponseModel>(url, item, httpOptions);
  }

  checkFormula(item: RuleModel) {
    let url = `${apiUrl}api/Admin/Rule/CheckFormula`;
    return this.httpClient.post<ResponseModel>(url, item, httpOptions);
  }
}
