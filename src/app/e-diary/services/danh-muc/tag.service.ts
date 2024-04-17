import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
// import { FormioAppConfig } from '@formio/angular';
import { apiUrl, httpOptions } from 'src/app/config';

import { TagFilter, TagModel } from '../../models/danh-muc/TagModel';
import { ResponseModel } from '../../models/Commons/ResponseModel';
import { DeleteModel } from '../../models/Commons/DeleteModel';
@Injectable({
  providedIn: 'root',
})
export class TagService {
  constructor(private httpClient: HttpClient) {}

  getThongTinPaging(filter: TagFilter): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(
      `${apiUrl}api/Param/Tag/GetPagingItem`,
      filter,
      httpOptions
    );
  }

  getItemById(id: number): Observable<ResponseModel> {
    return this.httpClient.get<ResponseModel>(
      `${apiUrl}api/Param/Tag/GetItemByID?id=${id}`,
      httpOptions
    );
  }
  getItemEditById(id: number): Observable<ResponseModel> {
    return this.httpClient.get<ResponseModel>(
      `${apiUrl}api/Param/Tag/GetItemEditByID?id=${id}`,
      httpOptions
    );
  }

  createThongTin(item: TagModel): Observable<any> {
    return this.httpClient.post(
      `${apiUrl}api/Param/Tag/AddNewItem`,
      item,
      httpOptions
    );
  }

  updateThongTin(item: TagModel): Observable<any> {
    return this.httpClient.post(
      `${apiUrl}api/Param/Tag/UpdateItem`,
      item,
      httpOptions
    );
  }

  deleteThongTin(item: DeleteModel): Observable<any> {
    return this.httpClient.post(
      `${apiUrl}api/Param/Tag/DeleteItem`,
      item,
      httpOptions
    );
  }

  GetListTag(): Observable<ResponseModel> {
    let params: any = {
      Name: '',
      Code: '',
      IsActive: true,
    };
    let url = `${apiUrl}api/Param/Tag/GetListItem`;
    let result = this.httpClient.post<ResponseModel>(url, params, httpOptions);

    return result;
  }
}
