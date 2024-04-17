import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { httpOptions, apiUrl } from 'src/app/config';

@Injectable()
export class SideNavService {
    constructor(private httpClient: HttpClient) {}

    // public GetAllListItemBuildMenu(): Observable<any> {
    //     return this.httpClient.post(
    //         `${apiUrl}api/Config/SysFeature/GetAllListItemBuildMenu`, null, httpOptions
    //     );
    // }
}