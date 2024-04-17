import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TenantFilter, TenantModel } from '../../models/quan-tri/TenantModel';
import { Observable } from 'rxjs';
import { apiUrl, httpOptions } from 'src/app/config';
import { ResponseModel } from '../../models/Commons/ResponseModel';
import { DeleteModel } from '../../models/Commons/DeleteModel';

@Injectable({
  providedIn: 'root',
})
export class TenantService {
  constructor(private httpClient: HttpClient) {}

  getTenantPaging(filter: TenantFilter): Observable<ResponseModel> {
    let url = `${apiUrl}api/Admin/Tenant/GetPagingItem`;
    return this.httpClient.post<ResponseModel>(url, filter, httpOptions);
  }

  getTenantdById(id: number) {
    let url = `${apiUrl}api/Admin/Tenant/GetItemById?id=${id}`;
    return this.httpClient.get<ResponseModel>(url, httpOptions);
  }

  createTenant(item: TenantModel) {
    let url = `${apiUrl}api/Admin/Tenant/AddNewItem`;
    return this.httpClient.post<ResponseModel>(url, item, httpOptions);
  }

  updateTenant(item: TenantModel): Observable<ResponseModel> {
    let url = `${apiUrl}api/Admin/Tenant/UpdateItem`;
    return this.httpClient.post<ResponseModel>(url, item, httpOptions);
  }

  deleteTenant(item: DeleteModel): Observable<ResponseModel> {
    let url = `${apiUrl}api/Admin/Tenant/DeleteItem`;
    return this.httpClient.post<ResponseModel>(url, item, httpOptions);
  }
}
