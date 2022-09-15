import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ReportBateraService {
    constructor(
        private httpClient : HttpClient
    ){}

    httpOptions : any
    url = ''

    getDataReport(){
        const httpHeaders = new HttpHeaders();
        httpHeaders.append('content-type', 'application/json')
        return this.httpClient.get(this.url, this.httpOptions)
    }

    createStatus(createStat){
        return this.httpClient.post(this.url, createStat )
    }
}