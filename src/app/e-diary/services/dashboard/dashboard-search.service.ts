import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl, httpOptions } from 'src/app/config';
import { DiaryModelFilter } from '../../models/tim-kiem/tim-kiem';

@Injectable({
  providedIn: 'root',
})
export class DashboardSearchService {
  constructor(private httpClient: HttpClient) {}

  getDiaryPaging(filter: DiaryModelFilter): Observable<any> {
    return this.httpClient.post(
      `${apiUrl}api/Commons/Search/GetPagingItem`,
      filter,
      httpOptions
    );
  }
}
