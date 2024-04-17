import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl, httpOptions } from 'src/app/config';
import { FileModel } from '../../models/quan-tri/FileModel';
import { DirectoryNodeModel } from '../../models/quan-tri/DirectoryNodeModel';

@Injectable({
  providedIn: 'root',
})
export class DownloadFileServerService {
  public baseURL = apiUrl;
  constructor(private httpClient: HttpClient) {}

  getFolderSeriLogTree(): Observable<DirectoryNodeModel[]> {
    return this.httpClient.get<DirectoryNodeModel[]>(
      `${apiUrl}api/Admin/SerilogFiles/GetFolderTree`,
      httpOptions
    );
  }

  getLogFiles(): Observable<FileModel[]> {
    let url = `${apiUrl}api/Admin/SerilogFiles/GetListFileLog`;
    let result = this.httpClient.get<FileModel[]>(url, httpOptions);
    return result;
  }

  downloadFile(file: FileModel): Observable<Blob> {
    const url = `${apiUrl}api/Admin/SerilogFiles/DownloadFile/${file.Name}`;
    return this.httpClient.get(url, { responseType: 'blob' });
  }

  getDirectoryTree(): Observable<any> {
    const url = `${apiUrl}api/Admin/SerilogFiles/GetDirectoryTree`;
    return this.httpClient.get<any>(url, httpOptions);
  }

  downloadFileOrZip(file: FileModel): Observable<Blob> {
    const url = `${apiUrl}api/Admin/SerilogFiles/DownloadFileAll`;
    const options = {
      responseType: 'blob' as 'json',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // Authorization: 'Bearer ' + yourAuthToken,
      }),
      params: new HttpParams().set('filePath', `${file.Path}`),
    };
    return this.httpClient.get<any>(url, options);
  }
}
