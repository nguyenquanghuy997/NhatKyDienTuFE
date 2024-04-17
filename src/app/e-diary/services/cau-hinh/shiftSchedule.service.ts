import { HttpClient } from '@angular/common/http';
import { apiUrl, httpOptions } from 'src/app/config';
import {
  ShiftScheduleFilter,
  ShiftScheduleModel,
} from '../../models/cau-hinh/ShiftScheduleModel';
import { ResponseModel } from '../../models/Commons/ResponseModel';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ShiftScheduleService {
  constructor(private httpClient: HttpClient) {}

  getShiftSchedulePaging(
    filter: ShiftScheduleFilter
  ): Observable<ResponseModel> {
    let url = `${apiUrl}api/Config/ShiftSchedule/GetPagingItem`;
    return this.httpClient.post<ResponseModel>(url, filter, httpOptions);
  }

  getShiftScheduleById(id: number) {
    let url = `${apiUrl}api/Config/ShiftSchedule/GetItemById?id=${id}`;
    return this.httpClient.get<ResponseModel>(url, httpOptions);
  }
  getShiftScheduleByShiftEffectivePeriodId(item: ShiftScheduleFilter) {
    let url = `${apiUrl}api/Config/ShiftSchedule/GetItemByShiftEffectivePeriodId`;
    return this.httpClient.post<ResponseModel>(url, item, httpOptions);
  }

  createShiftSchedule(item: ShiftScheduleModel) {
    let url = `${apiUrl}api/Config/ShiftSchedule/AddNewItem`;
    return this.httpClient.post<ResponseModel>(url, item, httpOptions);
  }

  updateShiftSchedule(item: ShiftScheduleModel): Observable<ResponseModel> {
    let url = `${apiUrl}api/Config/ShiftSchedule/UpdateItem`;
    return this.httpClient.post<ResponseModel>(url, item, httpOptions);
  }

  deleteShiftSchedule(item: ShiftScheduleModel): Observable<ResponseModel> {
    let url = `${apiUrl}api/Config/ShiftSchedule/DeleteItemSchedule`;
    return this.httpClient.post<ResponseModel>(url, item, httpOptions);
  }

  getListShiftSchedule(filter: ShiftScheduleFilter): Observable<ResponseModel> {
    let url = `${apiUrl}api/Config/ShiftSchedule/GetListItem`;
    return this.httpClient.post<ResponseModel>(url, filter, httpOptions);
  }
}
