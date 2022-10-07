import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.prod"

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
}