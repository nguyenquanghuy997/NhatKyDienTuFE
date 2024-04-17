import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { httpOptions, apiUrl } from 'src/app/config';
import { ResponseModel } from '../../models/Commons/ResponseModel';

@Injectable({
  providedIn: 'root',
})
export class DutyShiftService {
  constructor(private httpClient: HttpClient) {}

  getItemByID(id: number): Observable<ResponseModel> {
    return this.httpClient.get<ResponseModel>(
      `${apiUrl}api/dynamic/DutyShift/GetItemByID?id=${id}`,
      httpOptions
    );
  }

  GetDutyShiftInfoByID(shiftId: number): Observable<ResponseModel> {
    return this.httpClient.get<ResponseModel>(
      `${apiUrl}api/dynamic/DutyShift/GetDutyShiftInfoByID?shiftId=${shiftId}`,
      httpOptions
    );
  }

  confirmDutyShift(item: any): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(
      `${apiUrl}api/dynamic/DutyShift/ComfirmDutyShift`,
      item,
      httpOptions
    );
  }

  createNewItem(item: any): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(
      `${apiUrl}api/dynamic/DutyShift/AddNewItem`,
      item,
      httpOptions
    );
  }

  updateItem(item: any, id: number): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(
      `${apiUrl}api/dynamic/DutyShift/UpdateItem`,
      item,
      httpOptions
    );
  }
}
