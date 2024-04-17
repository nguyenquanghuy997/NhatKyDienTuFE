import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { httpOptions, apiUrl } from 'src/app/config';
import {
  ProcessFormFilter,
  ProcessFormModel,
} from '../../models/nhat-ky-van-hanh/ProcessFormModel';
import { ResponseModel } from '../../models/Commons/ResponseModel';
import { UserLogFilterModel } from '../../models/quan-tri/UserLogModel';
import { DeleteModel } from '../../models/Commons/DeleteModel';

@Injectable({
  providedIn: 'root',
})
export class ProcessFormService {
  constructor(private httpClient: HttpClient) {}

  //#region Get
  getSysRefTypeSetupProcessFormByRefTypeId(refTypeId: number) {
    return this.httpClient.get<ResponseModel>(
      `${apiUrl}api/dynamic/SysProcessForm/Reftype/${refTypeId}/GetSysRefTypeSetupProcessFormByRefTypeId`,
      httpOptions
    );
  }

  getPageFunctionCodePermission(refTypeId: number, id: number) {
    return this.httpClient.get<ResponseModel>(
      `${apiUrl}api/dynamic/SysProcessForm/Reftype/${refTypeId}/GetPageFunctionCodePermission?id=${id}`,
      httpOptions
    );
  }

  getDiaryPaging(filter: ProcessFormFilter): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(
      `${apiUrl}api/dynamic/SysProcessForm/Reftype/${filter.RefTypeId}/GetPagingItem`,
      filter,
      httpOptions
    );
  }

  getItemById(id: number, refTypeId: number): Observable<ResponseModel> {
    return this.httpClient.get<ResponseModel>(
      `${apiUrl}api/dynamic/SysProcessForm/Reftype/${refTypeId}/GetItemByID?id=${id}`,
      httpOptions
    );
  }
  getItemEditById(id: number, refTypeId: number): Observable<ResponseModel> {
    return this.httpClient.get<ResponseModel>(
      `${apiUrl}api/dynamic/SysProcessForm/Reftype/${refTypeId}/GetItemEditByID?id=${id}`,
      httpOptions
    );
  }

  getDefaultAddnewItem(refTypeId: number): Observable<ResponseModel> {
    return this.httpClient.get<ResponseModel>(
      `${apiUrl}api/dynamic/SysProcessForm/Reftype/${refTypeId}/GetDefaultAddNewItem`,
      httpOptions
    );
  }

  getDiaryByRefTypeId(id: number): Observable<ResponseModel> {
    return this.httpClient.get<ResponseModel>(
      `${apiUrl}api/Config/SysForm/GetItemByRefTypeID?refTypeId=${id}`,
      httpOptions
    );
  }

  getSysProcessInfoUserLogById(
    id: number,
    refTypeId: number
  ): Observable<ResponseModel> {
    return this.httpClient.get<ResponseModel>(
      `${apiUrl}api/dynamic/SysProcessForm/Reftype/${refTypeId}/GetSysProcessFormEditedUserLogId?id=${id}`,
      httpOptions
    );
  }

  // Lấy thông tin ca hiện tại, tiếp theo
  GetInfoShiftDelivery(
    id: number,
    refTypeId: number
  ): Observable<ResponseModel> {
    return this.httpClient.get<ResponseModel>(
      `${apiUrl}api/dynamic/SysProcessForm/Reftype/${refTypeId}/GetInfoShiftDelivery?id=${id}`,
      httpOptions
    );
  }

  GetDataSetupFormGiaoNhanCa(
    id: number,
    refTypeId: number
  ): Observable<ResponseModel> {
    return this.httpClient.get<ResponseModel>(
      `${apiUrl}api/dynamic/SysProcessForm/Reftype/${refTypeId}/GetDataSetupFormGiaoNhanCa?id=${id}`,
      httpOptions
    );
  }

  //#endregion

  //#region UserLog
  getPagingUserLog(filter: UserLogFilterModel): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(
      `${apiUrl}api/dynamic/SysProcessForm/Reftype/${filter.RefTypeId}/GetPagingUserLog`,
      filter,
      httpOptions
    );
  }
  getUserLogById(id: number, refTypeId: number): Observable<ResponseModel> {
    return this.httpClient.get<ResponseModel>(
      `${apiUrl}api/dynamic/SysProcessForm/Reftype/${refTypeId}/GetUserLogByUserLogID?id=${id}`,
      httpOptions
    );
  }
  //#endregion

  //#region create
  createNewDiary_PhieuLenh(
    nhatkyObj: ProcessFormModel
  ): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(
      `${apiUrl}api/dynamic/SysProcessForm/Reftype/${nhatkyObj.RefTypeId}/AddNewItem_NotShiftDuty`,
      nhatkyObj,
      httpOptions
    );
  }

  createQuicklyDiary_CaTrucParent(
    nhatkyObj: ProcessFormModel
  ): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(
      `${apiUrl}api/dynamic/SysProcessForm/Reftype/${nhatkyObj.RefTypeId}/AddNewItemQuickly_ShiftDutyParent`,
      nhatkyObj,
      httpOptions
    );
  }

  createQuicklyDiary_CaTruc(
    nhatkyObj: ProcessFormModel
  ): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(
      `${apiUrl}api/dynamic/SysProcessForm/Reftype/${nhatkyObj.RefTypeId}/AddNewItemQuickly_ShiftDuty`,
      nhatkyObj,
      httpOptions
    );
  }

  createQuicklyDiaryForNow_CaTruc(
    refTypeId: number
  ): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(
      `${apiUrl}api/dynamic/SysProcessForm/Reftype/${refTypeId}/AddNewItemQuicklyForNow_ShiftDuty`,
      refTypeId,
      httpOptions
    );
  }
  //#endregion

  //#region update
  updateDiary(nhatkyObj: any, id: number): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(
      `${apiUrl}api/dynamic/SysProcessForm/Reftype/${nhatkyObj.RefTypeId}/UpdateItem`,
      nhatkyObj,
      httpOptions
    );
  }

  updateStatusGiaoNhanCaItem(
    nhatkyObj: ProcessFormModel
  ): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(
      `${apiUrl}api/dynamic/SysProcessForm/Reftype/${nhatkyObj.RefTypeId}/UpdateStatusGiaoNhanCaItem`,
      nhatkyObj,
      httpOptions
    );
  }

  //#endregion

  deleteProcessForm(item: ProcessFormModel): Observable<ResponseModel> {
    let { Id, Version } = item;
    let itemDel: DeleteModel = { Id, Version };
    return this.httpClient.post<ResponseModel>(
      `${apiUrl}api/dynamic/SysProcessForm/Reftype/${item.RefTypeId}/DeleteItem`,
      itemDel,
      httpOptions
    );
  }

  deleteProcessFormParent(item: ProcessFormModel): Observable<ResponseModel> {
    let { Id, Version } = item;
    let itemDel: DeleteModel = { Id, Version };
    return this.httpClient.post<ResponseModel>(
      `${apiUrl}api/dynamic/SysProcessForm/Reftype/${item.RefTypeId}/DeleteItemParent`,
      itemDel,
      httpOptions
    );
  }

  submitProcessForm(item: ProcessFormModel): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(
      `${apiUrl}api/dynamic/SysProcessForm/Reftype/${item.RefTypeId}/SubmitProcessForm`,
      item,
      httpOptions
    );
  }

  approveProcessForm(item: ProcessFormModel): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(
      `${apiUrl}api/dynamic/SysProcessForm/Reftype/${item.RefTypeId}/ApproveProcessForm`,
      item,
      httpOptions
    );
  }

  rejectProcessForm(item: ProcessFormModel): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(
      `${apiUrl}api/dynamic/SysProcessForm/Reftype/${item.RefTypeId}/RejectProcessForm`,
      item,
      httpOptions
    );
  }

  // giao nhận ca parent
  updateStatusGiaoNhanCaItemParent(
    nhatkyObj: ProcessFormModel
  ): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(
      `${apiUrl}api/dynamic/SysProcessForm/Reftype/${nhatkyObj.RefTypeId}/UpdateStatusGiaoNhanCaItemParent`,
      nhatkyObj,
      httpOptions
    );
  }
  // xem chi tiết nk ở mh tra cứu
  getItemSearchById(id: number, refTypeId: number): Observable<ResponseModel> {
    return this.httpClient.get<ResponseModel>(
      `${apiUrl}api/Commons/Search/GetSysProcessFormSearchById?id=${id}`,
      httpOptions
    );
  }
}
