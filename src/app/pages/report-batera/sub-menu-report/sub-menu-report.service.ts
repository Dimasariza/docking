import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class SubMenuReportBateraService {
    constructor(
        private httpClient : HttpClient
    ){}

    httpOptions : any
    url = 'http://localhost:3002/homeData'

    getDataSubMenuReport(){
        const httpHeaders = new HttpHeaders();
        httpHeaders.append('content-type', 'application/json')
        return this.httpClient.get(this.url, this.httpOptions)
    }
}