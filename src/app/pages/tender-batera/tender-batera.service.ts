import {  HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from"../../../environments/environment"

@Injectable({
    providedIn: 'root'
})
export class TenderBateraService {
    constructor (private httpClient : HttpClient,){}
    public apiUrl = environment.apiUrl
    
    getDataTender(page, status){    
        const url = this.apiUrl + "/tender"
        let queryParams = new HttpParams();
        queryParams = queryParams.append("per_page", page)
                                .append("status", status)
        return this.httpClient.get(url, {params  : queryParams})
    }

    addDataTender(body){
        const url = this.apiUrl + "/tender"
        return this.httpClient.post(url, body)
    }
}