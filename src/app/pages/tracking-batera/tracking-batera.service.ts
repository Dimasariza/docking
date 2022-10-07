import {  HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment"

@Injectable({
    providedIn: 'root'
})
export class TrackingBateraService {
    constructor (private httpClient : HttpClient){}
    private apiUrl = environment.apiUrl

    getDataTracking(){
        const url = this.apiUrl + "/tracking"
        let queryParams = new HttpParams();
        queryParams = queryParams.append("per_page", "")
                                .append("q", "")
        return this.httpClient.get(url,  {params  : queryParams})
    }
    
    getPDF(id){
        const url = this.apiUrl + '/proyek/' + id + '/export_pdf'
        return this.httpClient.get(url)
    }
}