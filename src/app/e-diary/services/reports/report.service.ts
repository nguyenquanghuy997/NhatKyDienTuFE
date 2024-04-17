import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseModel } from '../../models/Commons/ResponseModel';
import { Observable } from 'rxjs';
import { apiUrl, httpOptions } from 'src/app/config';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private httpClient: HttpClient) { }

  getPageFunctionCodePermission(): Observable<ResponseModel> {
    let url = `${apiUrl}api/Commons/Report/GetPageFunctionCodePermission`;
    let result = this.httpClient.get<ResponseModel>(
      url, httpOptions
    );
    return result;
  }

  downloadTempBcsxSmov(reportDate?: any): Observable<ResponseModel> {
    let url = `${apiUrl}api/Commons/Report/DownloadTempBcsxSmov?date=${reportDate}`;
    let result = this.httpClient.get<ResponseModel>(
      url, httpOptions
    );
    return result;
  }

  submitBcsxSmov(current_file_data: any): Observable<ResponseModel> {
    let url = `${apiUrl}api/Commons/Report/SubmitBcsxSmov`;
    let result = this.httpClient.post<ResponseModel>(
      url, current_file_data, httpOptions
    );
    return result;
  }

}
