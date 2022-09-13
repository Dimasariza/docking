import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class HomeBateraService {
    constructor(
        private httpClient : HttpClient
    ){}

    httpOptions : any
    url = 'http://localhost:3002/homeData'

    getDataHome(){
        return this.httpClient.get(this.url, this.httpOptions)
    }
    
}