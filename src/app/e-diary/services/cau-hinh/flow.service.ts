import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl, httpOptions } from 'src/app/config';
import { ResponseModel } from '../../models/Commons/ResponseModel';
import { FlowFilter, FlowModel } from '../../models/cau-hinh/FlowModel';
import { DeleteModel } from '../../models/Commons/DeleteModel';

@Injectable({
  providedIn: 'root',
})
export class FlowService {
  constructor(private httpClient: HttpClient) {}

  GetListFlow(): Observable<ResponseModel> {
    let params: FlowFilter = {
      IsActive: true,
    };
    let url = `${apiUrl}api/Config/Flow/GetListItem`;
    let result = this.httpClient.post<ResponseModel>(url, params, httpOptions);

    return result;
  }

  deleteItem(item: DeleteModel): Observable<ResponseModel> {
    let url = `${apiUrl}api/Config/Flow/DeleteItem`;
    let result = this.httpClient.post<ResponseModel>(url, item, httpOptions);
    return result;
  }
  updateItem(item: FlowModel): Observable<ResponseModel> {
    let url = `${apiUrl}api/Config/Flow/UpdateItem`;
    let result = this.httpClient.post<ResponseModel>(url, item, httpOptions);
    return result;
  }
  createItem(item: FlowModel): Observable<ResponseModel> {
    let url = `${apiUrl}api/Config/Flow/AddNewItem`;
    let result = this.httpClient.post<ResponseModel>(url, item, httpOptions);
    return result;
  }
  getItemById(id: number): Observable<ResponseModel> {
    let url = `${apiUrl}api/Config/Flow/GetItemById?id=${id}`;
    let result = this.httpClient.get<ResponseModel>(url, httpOptions);
    return result;
  }
  getItemEditById(id: number): Observable<ResponseModel> {
    let url = `${apiUrl}api/Config/Flow/GetItemEditById?id=${id}`;
    let result = this.httpClient.get<ResponseModel>(url, httpOptions);
    return result;
  }

  GetPagingItem(filter: FlowFilter): Observable<ResponseModel> {
    let url = `${apiUrl}api/Config/Flow/GetPagingItem`;
    let result = this.httpClient.post<ResponseModel>(url, filter, httpOptions);
    return result;
  }
}
