import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment'

@Injectable({
    providedIn: 'root'
})
export class PDFService {
    constructor(private httpClient : HttpClient){}
    apiUrl = environment.apiUrl

    getProjectSummary(page, per_page, q, status){
        const url = this.apiUrl + "/report/proyek"
        let queryParams = new HttpParams();
        queryParams = queryParams.append("page", page)
                                .append("per_page", per_page)
                                .append("q", q)
                                .append("status", status)
        return this.httpClient.get(url, {params : queryParams})
    }

    getSummarryPerProject(id){
        const url = this.apiUrl + "/report/proyek" + id
        return this.httpClient.get(url)
    }
}