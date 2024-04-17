import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { FormioAppConfig } from '@formio/angular';
import { Observable } from 'rxjs';
import { formMauModel, formMauModelFilter } from '../../models/form-mau';
import { httpOptions, apiUrl } from 'src/app/config';
import { ResponseModel } from '../../models/Commons/ResponseModel';
import { FormFilter } from '../../models/cau-hinh/FormModel';
import { DeleteModel } from '../../models/Commons/DeleteModel';

@Injectable({
  providedIn: 'root',
})
export class FormMauService {
  constructor(private httpClient: HttpClient) {}

  getFormsPaging(filter: formMauModelFilter): Observable<ResponseModel> {
    console.log(filter);
    return this.httpClient.post<ResponseModel>(
      `${apiUrl}api/Config/SysForm/GetPagingItem`,
      filter,
      httpOptions
    );
  }

  GetListForm(): Observable<ResponseModel> {
    let params: FormFilter = {
      Name: '',
      IsActive: true,
    };
    let url = `${apiUrl}api/Config/SysForm/GetListItem`;
    let result = this.httpClient.post<ResponseModel>(url, params, httpOptions);

    return result;
  }

  getSysFormById(id: number): Observable<ResponseModel> {
    return this.httpClient.get<ResponseModel>(
      `${apiUrl}api/Config/SysForm/GetItemByID?id=${id}`,
      httpOptions
    );
  }

  getSysFormEditById(id: number): Observable<ResponseModel> {
    return this.httpClient.get<ResponseModel>(
      `${apiUrl}api/Config/SysForm/GetItemEditByID?id=${id}`,
      httpOptions
    );
  }

  createSysForm(formObj: any): Observable<any> {
    return this.httpClient.post<ResponseModel>(
      `${apiUrl}api/Config/SysForm/AddNewItem`,
      formObj,
      httpOptions
    );
  }

  updateSysForm(formObj: any): Observable<any> {
    return this.httpClient.post<ResponseModel>(
      `${apiUrl}api/Config/SysForm/UpdateItem`,
      formObj,
      httpOptions
    );
  }

  deleteSysForm(formObj: DeleteModel): Observable<any> {
    return this.httpClient.post<ResponseModel>(
      `${apiUrl}api/Config/SysForm/DeleteItem`,
      formObj,
      httpOptions
    );
  }
}
