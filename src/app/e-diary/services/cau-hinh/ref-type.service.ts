import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { FormioAppConfig } from '@formio/angular';
import { Observable } from 'rxjs';
import { formMauModel } from '../../models/form-mau';
import { httpOptions, apiUrl } from 'src/app/config';
import {
  RefTypeFilter,
  RefTypeModel,
} from '../../models/cau-hinh/RefTypeModel';
import { ResponseModel } from '../../models/Commons/ResponseModel';
import { DeleteModel } from '../../models/Commons/DeleteModel';

@Injectable({
  providedIn: 'root',
})
export class RefTypeService {
  constructor(
    private httpClient: HttpClient // public config_: FormioAppConfig
  ) {}

  GetDataSetupFormView(): Observable<ResponseModel> {
    return this.httpClient.get<ResponseModel>(
      `${apiUrl}api/Config/SysRefType/GetDataSetupFormView`,
      httpOptions
    );
  }

  getRefTypePaging(
    //   filter: sysRefTypeModelFilter
    // ): Observable<any> {
    //   return this.httpClient.post(
    //     `${apiUrl}api/Config/SysRefType/GetPagingItem`, filter, httpOptions

    filter: RefTypeFilter
  ): Observable<ResponseModel> {
    let url = `${apiUrl}api/Config/SysRefType/GetPagingItem`;
    return this.httpClient.post<ResponseModel>(url, filter, httpOptions);
  }

  getListRefType(filter: RefTypeFilter): Observable<any> {
    return this.httpClient.post(
      `${apiUrl}api/Config/SysRefType/GetListItem`,
      filter,
      httpOptions
    );
  }

  getSysRefTypeById(id: number): Observable<ResponseModel> {
    return this.httpClient.get<ResponseModel>(
      `${apiUrl}api/Config/SysRefType/GetItemByID?id=${id}`,
      httpOptions
    );
  }

  getSysRefTypeEditById(id: number): Observable<ResponseModel> {
    return this.httpClient.get<ResponseModel>(
      `${apiUrl}api/Config/SysRefType/GetItemEditByID?id=${id}`,
      httpOptions
    );
  }

  createSysRefType(item: any): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(
      `${apiUrl}api/Config/SysRefType/AddNewItem`,
      item,
      httpOptions
    );
  }

  updateSysRefType(item: any): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(
      `${apiUrl}api/Config/SysRefType/UpdateItem`,
      item,
      httpOptions
    );
  }

  deleteSysRefType(item: DeleteModel): Observable<ResponseModel> {
    let url = `${apiUrl}api/Config/SysRefType/DeleteItem`;
    return this.httpClient.post<ResponseModel>(url, item, httpOptions);
  }
}
