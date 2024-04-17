import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl, httpOptions } from 'src/app/config';
import { ResponseModel } from '../../models/Commons/ResponseModel';
import { ConfigModel } from '../../models/cau-hinh/ConfigModel';
import { UserLogFilterModel } from '../../models/quan-tri/UserLogModel';
import { DeleteModel } from '../../models/Commons/DeleteModel';
@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  public baseURL = apiUrl;

  constructor(private httpClient: HttpClient) {}

  getPagingItem(filter: UserLogFilterModel): Observable<any> {
    return this.httpClient.post(
      `${apiUrl}api/Config/SysConfig/GetPagingItem`,
      filter,
      httpOptions
    );
  }

  getItemById(id: number): Observable<ConfigModel> {
    return this.httpClient.get<ConfigModel>(
      `${apiUrl}api/Config/SysConfig/GetItemByID?id=${id}`,
      httpOptions
    );
  }

  getItemEditById(id: number): Observable<ConfigModel> {
    return this.httpClient.get<ConfigModel>(
      `${apiUrl}api/Config/SysConfig/GetItemEditByID?id=${id}`,
      httpOptions
    );
  }

  deleteItem(item: DeleteModel): Observable<ResponseModel> {
    let url = `${apiUrl}api/Config/SysConfig/DeleteItem`;
    let result = this.httpClient.post<ResponseModel>(url, item, httpOptions);
    return result;
  }

  updateItem(item: ConfigModel): Observable<ResponseModel> {
    let url = `${apiUrl}api/Config/SysConfig/UpdateItem`;
    let result = this.httpClient.post<ResponseModel>(url, item, httpOptions);
    return result;
  }

  createItem(item: ConfigModel): Observable<ResponseModel> {
    let url = `${apiUrl}api/Config/SysConfig/AddNewItem`;
    let result = this.httpClient.post<ResponseModel>(url, item, httpOptions);
    return result;
  }

  getListConfigCode(): Observable<ResponseModel> {
    let url = `${apiUrl}api/Config/SysConfig/GetListConfigCode`;
    let result = this.httpClient.get<ResponseModel>(url, httpOptions);
    return result;
  }
}
