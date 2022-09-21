import {  HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class TenderBateraService {
    private url = 'http://env-6573880.jh-beon.cloud/tender';
    constructor (private httpClient : HttpClient){}

    getDataTender(){
        let queryParams = new HttpParams();
        queryParams = queryParams.append("per_page", "")
                                .append("status", "all")
        return this.httpClient.get(this.url,  {params  : queryParams})
    }
    
}