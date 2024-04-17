import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ShiftFilter, ShiftModel } from '../../models/danh-muc/ShiftModel';

import { httpOptions, apiUrl } from 'src/app/config';
import { ResponseModel } from '../../models/Commons/ResponseModel';

@Injectable({
  providedIn: 'root',
})
export class ShiftService {
  constructor(private httpClient: HttpClient) {}

  GetItemBySeverDate(): Observable<ShiftModel> {
    return this.httpClient.get<ShiftModel>(
      `${apiUrl}api/Param/Shift/GetItemBySeverDate`,
      httpOptions
    );
  }

  getShiftPaging(filter: ShiftFilter): Observable<ResponseModel> {
    let url = `${apiUrl}api/Param/Shift/GetPagingItem`;
    return this.httpClient.post<ResponseModel>(url, filter, httpOptions);
  }

  getShiftById(id: number) {
    let url = `${apiUrl}api/Param/Shift/GetItemById?id=${id}`;
    return this.httpClient.get<ResponseModel>(url, httpOptions);
  }

  createShift(item: ShiftModel) {
    let url = `${apiUrl}api/Param/Shift/AddNewItem`;
    return this.httpClient.post<ResponseModel>(url, item, httpOptions);
  }

  updateShift(item: ShiftModel): Observable<ResponseModel> {
    let url = `${apiUrl}api/Param/Shift/UpdateItem`;
    return this.httpClient.post<ResponseModel>(url, item, httpOptions);
  }

  deleteShift(item: ShiftModel): Observable<ResponseModel> {
    let url = `${apiUrl}api/Param/Shift/DeleteItem`;
    return this.httpClient.post<ResponseModel>(url, item, httpOptions);
  }

  getListShift(filter: ShiftFilter): Observable<ResponseModel> {
    let url = `${apiUrl}api/Param/Shift/GetListItem`;
    return this.httpClient.post<ResponseModel>(url, filter, httpOptions);
  }
  GetListItemByShiftEffectivePeriodId(
    shiftEffectivePeriodId: number
  ): Observable<ResponseModel> {
    let url = `${apiUrl}api/Param/Shift/GetListItemByShiftEffectivePeriodId?shiftEffectivePeriodId=${shiftEffectivePeriodId}`;
    return this.httpClient.get<ResponseModel>(url, httpOptions);
  }

  getListShiftByDateAndRefTypeId(
    refTypeId: number,
    startDTG: Date
  ): Observable<ResponseModel> {
    let url = `${apiUrl}api/Param/Shift/GetListItemByRefTypeIdAndDate?refTypeId=${refTypeId}&date=${startDTG.toJSON()}`;
    return this.httpClient.get<ResponseModel>(url, httpOptions);
  }
}
