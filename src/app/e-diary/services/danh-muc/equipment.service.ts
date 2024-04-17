import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl, httpOptions } from 'src/app/config';
import { ResponseModel } from '../../models/Commons/ResponseModel';
import {
  EquipmentModel,
  EquipmentModelFilter,
} from '../../models/cau-hinh/EquipmentModel';
import { DeleteModel } from '../../models/Commons/DeleteModel';

@Injectable({
  providedIn: 'root',
})
export class EquipmentService {
  constructor(private httpClient: HttpClient) {}

  getDataSetupFormView(): Observable<ResponseModel> {
    return this.httpClient.get<ResponseModel>(
      `${apiUrl}api/Param/Equipment/GetDataSetupFormView`,
      httpOptions
    );
  }

  getEquipmentPaging(filter: EquipmentModelFilter): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(
      `${apiUrl}api/Param/Equipment/GetPagingItem`,
      filter,
      httpOptions
    );
  }

  getListEquipmentWithTag(
    filter: EquipmentModelFilter
  ): Observable<ResponseModel> {
    let url = `${apiUrl}api/Param/Equipment/GetListItemWithTag`;
    return this.httpClient.post<ResponseModel>(url, filter, httpOptions);
  }
  getListEquipment(filter: EquipmentModelFilter): Observable<ResponseModel> {
    let url = `${apiUrl}api/Param/Equipment/GetListItem`;
    return this.httpClient.post<ResponseModel>(url, filter, httpOptions);
  }
  getEquipmentById(id: number): Observable<EquipmentModel> {
    return this.httpClient.get<EquipmentModel>(
      `${apiUrl}api/Param/Equipment/GetItemById?id=${id}`,
      httpOptions
    );
  }
  getEquipmentEditById(id: number): Observable<EquipmentModel> {
    return this.httpClient.get<EquipmentModel>(
      `${apiUrl}api/Param/Equipment/GetItemEditById?id=${id}`,
      httpOptions
    );
  }

  createEquipment(item: EquipmentModel): Observable<any> {
    return this.httpClient.post(
      `${apiUrl}api/Param/Equipment/AddNewItem`,
      item,
      httpOptions
    );
  }

  updateEquipment(item: EquipmentModel): Observable<any> {
    return this.httpClient.post(
      `${apiUrl}api/Param/Equipment/UpdateItem`,
      item,
      httpOptions
    );
  }

  deleteEquipment(item: DeleteModel): Observable<any> {
    return this.httpClient.post(
      `${apiUrl}api/Param/Equipment/DeleteItem`,
      item,
      httpOptions
    );
  }
}
