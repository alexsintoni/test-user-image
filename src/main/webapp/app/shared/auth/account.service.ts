import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

@Injectable()
export class AccountService  {
    constructor(private http: HttpClient) { }

    get(): Observable<HttpResponse<Account>> {
        return this.http.get<Account>(SERVER_API_URL + 'api/account', {observe : 'response'});
    }

    save(account: any): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + 'api/account', account, {observe: 'response'});
    }

    uploadPiture(picture: any): Observable<HttpResponse<any>> {
        const data = new FormData();
        data.append('picture', picture);
        return this.http.post(SERVER_API_URL + 'api/account/picture', data, {observe: 'response'});
    }

    getPictureUrl(pictureName: String): string {
        return SERVER_API_URL + 'api/account/picture/' + pictureName;
    }

}
