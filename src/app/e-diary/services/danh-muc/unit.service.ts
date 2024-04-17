import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { UnitFilter, UnitModel } from '../../models/danh-muc/UnitModel';

import { catchError, map, retry, tap, delay, delayWhen } from 'rxjs/operators';
// import { FormioAppConfig } from '@formio/angular';
import { httpOptions, apiUrl } from 'src/app/config';
import { ResponseModel } from '../../models/Commons/ResponseModel';
import { DeleteModel } from '../../models/Commons/DeleteModel';

@Injectable({
  providedIn: 'root',
})
export class UnitService {
  constructor(private httpClient: HttpClient) {}

  public getUnitList(filter: UnitFilter): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(
      `${apiUrl}api/Param/Unit/GetListItem`,
      filter,
      httpOptions
    );
  }
  getUnitPaging(filter: UnitFilter): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(
      `${apiUrl}api/Param/Unit/GetPagingItem`,
      filter,
      httpOptions
    );
  }

  getUnitById(id: number): Observable<UnitModel> {
    return this.httpClient.get<UnitModel>(
      `${apiUrl}api/Param/Unit/GetItemByID?id=${id}`,
      httpOptions
    );
  }

  getUnitEditById(id: number): Observable<UnitModel> {
    return this.httpClient.get<UnitModel>(
      `${apiUrl}api/Param/Unit/GetItemEditByID?id=${id}`,
      httpOptions
    );
  }

  createUnit(unitObj: UnitModel): Observable<any> {
    return this.httpClient.post(
      `${apiUrl}api/Param/Unit/AddNewItem`,
      unitObj,
      httpOptions
    );
  }

  updateUnit(unitObj: UnitModel): Observable<any> {
    return this.httpClient.post(
      `${apiUrl}api/Param/Unit/UpdateItem`,
      unitObj,
      httpOptions
    );
  }

  deleteUnit(unitObj: DeleteModel): Observable<any> {
    return this.httpClient.post(
      `${apiUrl}api/Param/Unit/DeleteItem`,
      unitObj,
      httpOptions
    );
  }
}
