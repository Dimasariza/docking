import {  HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from"../../../environments/environment.prod"

@Injectable({
    providedIn: 'root'
})
export class TenderBateraService {
    constructor (private httpClient : HttpClient,){}
    public apiUrl = environment.apiUrl
    
    public dataProjectURL = 'http://env-6573880.jh-beon.cloud/proyek';

    getDataTender(){    
        const url = this.apiUrl + "/tender"
        let queryParams = new HttpParams();
        queryParams = queryParams.append("per_page", "10")
                                .append("status", "all")
        return this.httpClient.get(url, {params  : queryParams})
    }

    getProjectWorkArea(id=1){
        const url = this.apiUrl + '/proyek/' + id
        return this.httpClient.get(url)
    }
}