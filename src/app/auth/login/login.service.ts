import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class LoginBateraService {
    constructor(
        private httpClient : HttpClient
    ){}

    httpOptions : any
    url = 'http://env-6573880.jh-beon.cloud'

    getVerifyLogin(){
        const httpHeaders = new HttpHeaders();
        httpHeaders.append('content-type', 'application/json')
        return this.httpClient.get(this.url, this.httpOptions)
    }
}