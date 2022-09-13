import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class TenderBateraService {
    constructor(
        private httpClient : HttpClient
    ){}

    httpOptions : any
    url = 'http://localhost:3002/test'

    getDataTender(){
        return this.httpClient.get(this.url, this.httpOptions)
    }
    
}