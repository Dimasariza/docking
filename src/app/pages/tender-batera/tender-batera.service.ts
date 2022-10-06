import {  HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class TenderBateraService {
    constructor (private httpClient : HttpClient){}
    public dataTenderURL = 'http://env-6573880.jh-beon.cloud/tender';
    public dataProjectURL = 'http://env-6573880.jh-beon.cloud/proyek';
    public dataUserURL = 'http://env-6573880.jh-beon.cloud/user'

    getDataTender(){    
        let queryParams = new HttpParams();
        queryParams = queryParams.append("per_page", "10")
                                .append("status", "all")
        return this.httpClient.get(this.dataTenderURL,  {params  : queryParams})
    }

    getDataProject(){
        let queryParams = new HttpParams();
        queryParams = queryParams.append("per_page", "10")
                                .append("q", "")
        return this.httpClient.get(this.dataProjectURL, {params : queryParams})
    }

    getDataUser(){
        let queryParams = new HttpParams();
        queryParams = queryParams.append("per_page", "10")
                                .append("q", "")
                                .append("role", "all")
                                .append("status", "all")
        return this.httpClient.get(this.dataUserURL, {params : queryParams})
    }

    getProjectWorkArea(id=1){
        let endPoint = this.dataProjectURL + '/' + id
        return this.httpClient.get(endPoint)
    }
}