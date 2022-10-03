import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ReportBateraService {
    constructor(
        private httpClient : HttpClient
    ){}

    httpOptions : any
    private url = 'http://env-6573880.jh-beon.cloud/home/kapal';
    private projectUrl = 'http://env-6573880.jh-beon.cloud/proyek';

    getDataReport(){
        const httpHeaders = new HttpHeaders();
        httpHeaders.append('content-type', 'application/json')
        return this.httpClient.get(this.url, this.httpOptions)
    }

    createStatus(createStat){
        return this.httpClient.post(this.url, createStat )
    }

    getProjectData(id){
        let queryParams = new HttpParams();
        queryParams = queryParams.append("per_page", "10")
                                .append("q", "")
        const endPoint = this.projectUrl + '/' + id
        return this.httpClient.get(endPoint)
    }
}