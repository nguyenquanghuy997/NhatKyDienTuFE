import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl, httpOptions } from 'src/app/config';
import { ResponseModel } from '../../models/Commons/ResponseModel';
import {
  ProcessFlowFilter,
  ProcessFlowModel,
} from '../../models/nhat-ky-van-hanh/ProcessFlowModel';

@Injectable({
  providedIn: 'root',
})
export class ProcessFlowService {
  constructor(private httpClient: HttpClient) {}

  GetListItem(filter?: ProcessFlowFilter): Observable<ResponseModel> {
    let url = `${apiUrl}api/dynamic/ProcessFlow/GetListItem`;
    let result = this.httpClient.post<ResponseModel>(url, filter, httpOptions);
    return result;
  }

  GetItemForProcessView(
    refId: number,
    refTypeId: number
  ): Observable<ResponseModel> {
    let url = `${apiUrl}api/dynamic/ProcessFlow/GetItemForProcessView?refId=${refId}&refTypeId=${refTypeId}`;
    let result = this.httpClient.get<ResponseModel>(url, httpOptions);
    return result;
  }

  SubmitProcess(item: ProcessFlowModel): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(
      `${apiUrl}api/dynamic/ProcessFlow/SubmitProcessFlow`,
      item,
      httpOptions
    );
  }

  ApproveProcess(item: ProcessFlowModel): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(
      `${apiUrl}api/dynamic/ProcessFlow/ApproveProcessFlow`,
      item,
      httpOptions
    );
  }

  RejectedProcess(item: ProcessFlowModel): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(
      `${apiUrl}api/dynamic/ProcessFlow/RejectedProcessFlow`,
      item,
      httpOptions
    );
  }
}
