import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { apiUrl, httpOptions } from 'src/app/config';
import { ResponseModel } from '../../models/Commons/ResponseModel';
import {
  ShiftCategoryFilter,
  ShiftCategoryModel,
} from '../../models/danh-muc/ShiftCategoryModel';
import { DeleteModel } from '../../models/Commons/DeleteModel';

@Injectable({
  providedIn: 'root',
})
export class ShiftCategoryService {
  constructor(private httpClient: HttpClient) {}

  getShiftCategoryPaging(
    filter: ShiftCategoryFilter
  ): Observable<ResponseModel> {
    let url = `${apiUrl}api/Param/ShiftCategory/GetPagingItem`;
    return this.httpClient.post<ResponseModel>(url, filter, httpOptions);
  }

  getShiftCategoryById(id: number) {
    let url = `${apiUrl}api/Param/ShiftCategory/GetItemById?id=${id}`;
    return this.httpClient.get<ResponseModel>(url, httpOptions);
  }

  getShiftCategoryEditById(id: number) {
    let url = `${apiUrl}api/Param/ShiftCategory/GetItemEditById?id=${id}`;
    return this.httpClient.get<ResponseModel>(url, httpOptions);
  }

  createShiftCategory(item: ShiftCategoryModel) {
    let url = `${apiUrl}api/Param/ShiftCategory/AddNewItem`;
    return this.httpClient.post<ResponseModel>(url, item, httpOptions);
  }

  updateShiftCategory(item: ShiftCategoryModel): Observable<ResponseModel> {
    let url = `${apiUrl}api/Param/ShiftCategory/UpdateItem`;
    return this.httpClient.post<ResponseModel>(url, item, httpOptions);
  }

  deleteShiftCategory(item: DeleteModel): Observable<ResponseModel> {
    let url = `${apiUrl}api/Param/ShiftCategory/DeleteItem`;
    return this.httpClient.post<ResponseModel>(url, item, httpOptions);
  }

  getListShiftCategory(filter: ShiftCategoryFilter): Observable<ResponseModel> {
    let url = `${apiUrl}api/Param/ShiftCategory/GetListItem`;
    return this.httpClient.post<ResponseModel>(url, filter, httpOptions);
  }
}
