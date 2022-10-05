import {  HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class TrackingBateraService {
    private dataTrackingURL = 'http://env-6573880.jh-beon.cloud/tracking';
    constructor (private httpClient : HttpClient){}

    getDataTracking(){
        let queryParams = new HttpParams();
        queryParams = queryParams.append("per_page", "")
                                .append("q", "")
        return this.httpClient.get(this.dataTrackingURL,  {params  : queryParams})
    }
    
    getPDF(id){
        let endPoint = this.dataTrackingURL + '/proyek/' + id + '/export_pdf'
        return this.httpClient.get(endPoint)
    }
}