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
        private url = 'http://env-6573880.jh-beon.cloud/tender/proyek/';

    getDataTender(){
        return this.httpClient.get(this.url, this.httpOptions)
    }
    
}