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
    private homeURL = 'http://env-6573880.jh-beon.cloud/home/kapal';
    private projectUrl = 'http://env-6573880.jh-beon.cloud/proyek';

    createStatus(createStat){
        return this.httpClient.post(this.homeURL, createStat )
    }

    getProjectData(id){
        let queryParams = new HttpParams();
        queryParams = queryParams.append("per_page", "10")
                                .append("q", "")
        const endPoint = this.projectUrl + '/' + id
        return this.httpClient.get(endPoint)
    }
}