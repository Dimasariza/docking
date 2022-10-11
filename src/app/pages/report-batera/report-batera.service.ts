import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment"

@Injectable({
    providedIn: 'root'
})
export class ReportBateraService {
    constructor(private httpClient : HttpClient){}
    private apiUrl = environment.apiUrl

    getProjectData(id){
        const url = this.apiUrl + "/proyek/" + id
        let queryParams = new HttpParams();
        queryParams = queryParams.append("per_page", "10")
                                .append("q", "")
        return this.httpClient.get(url)
    }

    addDocument(body){
        const url = this.apiUrl + "/report/detail"
        return this.httpClient.post(url, body)
    }

    getDocument(id, page, type){
        const url = this.apiUrl + "/report/proyek/" + id + "/detail"
        let queryParams = new HttpParams();
        queryParams = queryParams.append("per_page", page)
                                .append("type", type)
        return this.httpClient.get(url, {params : queryParams})
    }
}