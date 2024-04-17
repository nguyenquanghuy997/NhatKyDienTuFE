import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthModel } from '../models/authentication/AuthModel';
import { apiUrl, httpOptions } from 'src/app/config';
import { Observable } from 'rxjs';
import { ResponseModel } from '../models/Commons/ResponseModel';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  Login(model: AuthModel): Observable<ResponseModel> {
    let url = `${apiUrl}Token/Login`;
    return this.http.post<ResponseModel>(url, model, httpOptions);
  }

  Logout(model: AuthModel): Observable<ResponseModel> {
    let url = `${apiUrl}Token/Logout`;
    return this.http.post<ResponseModel>(url, model, httpOptions);
  }
}
