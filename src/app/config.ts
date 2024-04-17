import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Utility } from './e-diary/utils/Utility';
import { ESConst } from './e-diary/utils/Const';
import { environment } from 'src/environments/environment';

export const apiUrl = environment.apiUrl;
export const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json;',
    // https://stackoverflow.com/questions/74861255/api-request-with-bearer-token-in-angular
    Authorization: `Bearer ${Utility.getLocalStorageWithExpiry(
      ESConst.LocalStorage.Key.Token
    )}`,
    // Authorization: 'my-auth-token',
    // Authorization: 'Basic ' + btoa('username:password'),
  }),
};
