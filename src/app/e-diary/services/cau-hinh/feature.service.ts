import { Injectable, OnInit } from '@angular/core';
import {
  FeatureFilter,
  FeatureModel,
} from '../../models/cau-hinh/FeatureModel';
import { Observable } from 'rxjs';
import { ResponseModel } from '../../models/Commons/ResponseModel';
import { HttpClient } from '@angular/common/http';
import { apiUrl, httpOptions } from 'src/app/config';
import { ESConst } from '../../utils/Const';
import { DeleteModel } from '../../models/Commons/DeleteModel';

@Injectable({
  providedIn: 'root',
})
export class FeatureService {
  constructor(private httpClient: HttpClient) {}

  getDataSetupFormView() {
    let url = `${apiUrl}api/Config/SysFeature/GetDataSetupFormView`;
    return this.httpClient.get<ResponseModel>(url, httpOptions);
  }

  getFeaturePaging(filter: FeatureFilter): Observable<ResponseModel> {
    let url = `${apiUrl}api/Config/SysFeature/GetPagingItem`;
    return this.httpClient.post<ResponseModel>(url, filter, httpOptions);
  }

  getListFeature(filter: FeatureFilter): Observable<ResponseModel> {
    let url = `${apiUrl}api/Config/SysFeature/GetListItem`;
    return this.httpClient.post<ResponseModel>(url, filter, httpOptions);
  }

  getFeatureById(id: number): Observable<ResponseModel> {
    let url = `${apiUrl}api/Config/SysFeature/GetItemById?id=${id}`;
    return this.httpClient.get<ResponseModel>(url, httpOptions);
  }

  getFeatureEditById(id: number): Observable<ResponseModel> {
    let url = `${apiUrl}api/Config/SysFeature/GetItemEditByID?id=${id}`;
    return this.httpClient.get<ResponseModel>(url, httpOptions);
  }

  getListFeatureFunction2CreateFeature() {
    let url = `${apiUrl}api/Config/SysFeature/GetListFeatureFunction2CreateFeature`;
    return this.httpClient.get<ResponseModel>(url, httpOptions);
  }

  getAllListItemBuildTree(): Observable<any> {
    let url = `${apiUrl}api/Config/SysFeature/GetAllListItemBuildTree`;
    return this.httpClient.get<ResponseModel>(url, httpOptions);
  }

  getAllListItemBuildMenu(): Observable<any> {
    let url = `${apiUrl}api/Config/SysFeature/GetAllListItemBuildMenu`;
    return this.httpClient.get<ResponseModel>(url, httpOptions);
  }

  createSysRefType(item: FeatureModel): Observable<ResponseModel> {
    let url = `${apiUrl}api/Config/SysFeature/AddNewItem`;
    return this.httpClient.post<ResponseModel>(url, item, httpOptions);
  }

  updateSysRefType(item: FeatureModel) {
    let url = `${apiUrl}api/Config/SysFeature/UpdateItem`;
    return this.httpClient.post<ResponseModel>(url, item, httpOptions);
  }

  deleteSysRefType(item: DeleteModel): Observable<ResponseModel> {
    let url = `${apiUrl}api/Config/SysFeature/DeleteItem`;
    return this.httpClient.post<ResponseModel>(url, item, httpOptions);
  }
}
