import { Injectable } from '@angular/core';
import { ResponseModel } from '../../models/Commons/ResponseModel';
import { Observable } from 'rxjs';
import { VerifyTOTPModel } from '../../models/Commons/VerifyTOTPModel';
import { apiUrl, httpOptions } from 'src/app/config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TotpService {
  constructor(private httpClient: HttpClient) {}

  VerifyTotp(model?: VerifyTOTPModel): Observable<ResponseModel> {
    let url = `${apiUrl}api/Commons/CA/VerifyTotp`;
    let result = this.httpClient.post<ResponseModel>(url, model, httpOptions);
    return result;
  }

  VerifyTotps(model?: VerifyTOTPModel[]): Observable<ResponseModel> {
    let url = `${apiUrl}api/Commons/CA/VerifyTotps`;
    let result = this.httpClient.post<ResponseModel>(url, model, httpOptions);
    return result;
  }
}
