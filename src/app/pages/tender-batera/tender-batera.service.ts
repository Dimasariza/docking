import {  HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class TenderBateraService {
    private dataTenderURL = 'http://env-6573880.jh-beon.cloud/tender/2';
    constructor (private httpClient : HttpClient){}

    getDataTender(){
        let queryParams = new HttpParams();
        queryParams = queryParams.append("per_page", "10")
                                .append("status", "all")
        return this.httpClient.get(this.dataTenderURL,  {params  : queryParams})
    }
    
}