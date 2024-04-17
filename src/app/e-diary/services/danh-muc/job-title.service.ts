import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl, httpOptions } from 'src/app/config';
import {
  JobTitleFilter,
  JobTitleModel,
} from '../../models/danh-muc/JobTitleModel';
import { Observable } from 'rxjs';
import { ResponseModel } from '../../models/Commons/ResponseModel';
import { DeleteModel } from '../../models/Commons/DeleteModel';

@Injectable({
  providedIn: 'root',
})
export class JobTitleService {
  constructor(private httpClient: HttpClient) {}

  getJobTitlePaging(filter: JobTitleFilter): Observable<ResponseModel> {
    let url = `${apiUrl}api/Param/JobTitle/GetPagingItem`;
    return this.httpClient.post<ResponseModel>(url, filter, httpOptions);
  }

  getJobTitleById(id: number) {
    let url = `${apiUrl}api/Param/JobTitle/GetItemById?id=${id}`;
    return this.httpClient.get<ResponseModel>(url, httpOptions);
  }

  createJobTitle(item: JobTitleModel) {
    let url = `${apiUrl}api/Param/JobTitle/AddNewItem`;
    return this.httpClient.post<ResponseModel>(url, item, httpOptions);
  }

  updateJobTitle(item: JobTitleModel): Observable<ResponseModel> {
    let url = `${apiUrl}api/Param/JobTitle/UpdateItem`;
    return this.httpClient.post<ResponseModel>(url, item, httpOptions);
  }

  deleteJobTitle(item: DeleteModel): Observable<ResponseModel> {
    let url = `${apiUrl}api/Param/JobTitle/DeleteItem`;
    return this.httpClient.post<ResponseModel>(url, item, httpOptions);
  }

  getListJobTitle(filter: JobTitleFilter): Observable<ResponseModel> {
    let url = `${apiUrl}api/Param/JobTitle/GetListItem`;
    return this.httpClient.post<ResponseModel>(url, filter, httpOptions);
  }
  GetListJobTitleByShiftEffectivePeriodId(
    shiftEffectivePeriodId: number
  ): Observable<ResponseModel> {
    let url = `${apiUrl}api/Param/JobTitle/GetListJobTitleByShiftEffectivePeriodId?shiftEffectivePeriodId=${shiftEffectivePeriodId}`;
    return this.httpClient.get<ResponseModel>(url, httpOptions);
  }
}
