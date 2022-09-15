import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserInfo } from 'os';
  
@Injectable({
  providedIn: 'root'
})
export class ProfileBateraService {
    private url = 'http://env-6573880.jh-beon.cloud/user';

    constructor(private httpClient: HttpClient) { }
  
    headers = new HttpHeaders().append('header', 'value');
    params = new HttpParams().append('param', "value");

    public getPosts() {
        let queryParams = new HttpParams();
        queryParams = queryParams.append("per_page", 10)
                                .append("q", "")
                                .append("role", "all")
                                .append("status", "active")
        return this.httpClient.get(this.url,  {params  : queryParams})
    }
}