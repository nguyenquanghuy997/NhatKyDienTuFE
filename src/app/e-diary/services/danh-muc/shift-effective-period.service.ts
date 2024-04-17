import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl, httpOptions } from 'src/app/config';
import { ResponseModel } from '../../models/Commons/ResponseModel';
import {
  ShiftEffectivePeriodFilter,
  ShiftEffectivePeriodModel,
} from '../../models/danh-muc/ShiftEffectivePeriodModel';
import { Observable } from 'rxjs';
import { DeleteModel } from '../../models/Commons/DeleteModel';

@Injectable({
  providedIn: 'root',
})
export class ShiftEffectivePeriodService {
  constructor(private httpClient: HttpClient) {}

  getShiftEffectivePeriodPaging(
    filter: ShiftEffectivePeriodFilter
  ): Observable<ResponseModel> {
    let url = `${apiUrl}api/Param/ShiftEffectivePeriod/GetPagingItem`;
    return this.httpClient.post<ResponseModel>(url, filter, httpOptions);
  }

  getShiftEffectivePeriodById(id: number) {
    let url = `${apiUrl}api/Param/ShiftEffectivePeriod/GetItemById?id=${id}`;
    return this.httpClient.get<ResponseModel>(url, httpOptions);
  }

  getShiftEffectivePeriodEditById(id: number) {
    let url = `${apiUrl}api/Param/ShiftEffectivePeriod/GetItemEditById?id=${id}`;
    return this.httpClient.get<ResponseModel>(url, httpOptions);
  }

  createShiftEffectivePeriod(item: ShiftEffectivePeriodModel) {
    let url = `${apiUrl}api/Param/ShiftEffectivePeriod/AddNewItem`;
    return this.httpClient.post<ResponseModel>(url, item, httpOptions);
  }

  updateConfigShiftEffectivePeriod(
    item: ShiftEffectivePeriodModel
  ): Observable<ResponseModel> {
    let url = `${apiUrl}api/Param/ShiftEffectivePeriod/UpdateItem`;
    return this.httpClient.post<ResponseModel>(url, item, httpOptions);
  }

  updateEditShiftEffectivePeriod(
    item: ShiftEffectivePeriodModel
  ): Observable<ResponseModel> {
    let url = `${apiUrl}api/Param/ShiftEffectivePeriod/UpdateEditItem`;
    return this.httpClient.post<ResponseModel>(url, item, httpOptions);
  }

  deleteShiftEffectivePeriod(item: DeleteModel): Observable<ResponseModel> {
    let url = `${apiUrl}api/Param/ShiftEffectivePeriod/DeleteItem`;
    return this.httpClient.post<ResponseModel>(url, item, httpOptions);
  }

  updateColorShiftEffectivePeriod(
    item: ShiftEffectivePeriodModel
  ): Observable<ResponseModel> {
    let url = `${apiUrl}api/Param/ShiftEffectivePeriod/UpdateColor`;
    return this.httpClient.post<ResponseModel>(url, item, httpOptions);
  }

  getListShiftEffectivePeriod(
    filter: ShiftEffectivePeriodFilter
  ): Observable<ResponseModel> {
    let url = `${apiUrl}api/Param/ShiftEffectivePeriod/GetListItem`;
    return this.httpClient.post<ResponseModel>(url, filter, httpOptions);
  }
}
