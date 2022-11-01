import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment"

@Injectable({
    providedIn: 'root'
})
export class ReportBateraService {
    constructor(private httpClient : HttpClient){}
    private apiUrl = environment.apiUrl

    getWorkPerProject(id){
        const url = this.apiUrl + "/report/proyek/" + id
        return this.httpClient.get(url)
    }

    updateWorkProgress(postBody, id){
        const url = this.apiUrl + "/report/proyek/" + id + "/work_area"
        return this.httpClient.put(url, postBody)
    }

    updateVarianWork(postBody, id){
        const url = this.apiUrl + "/report/proyek/" + id + "/variant_work"
        const httpHeaders = new HttpHeaders();
        httpHeaders.append('content-type', 'application/json')
        return this.httpClient.put(url, postBody, {headers : httpHeaders})
    }

    addSuplier(body){
        const url = this.apiUrl + "/supplier"
        return this.httpClient.post(url, body)
    }

    addDocument(body){
        const url = this.apiUrl + "/report/detail"
        return this.httpClient.post(url, body)
    }

    addAttachment(body){
        const url = this.apiUrl + "/file/attachment"
        return this.httpClient.post(url, body, {
            reportProgress : true, observe : 'events'
        })
    }

    getDocument(id, page, type){
        const url = this.apiUrl + "/report/proyek/" + id + "/detail"
        let queryParams = new HttpParams();
        queryParams = queryParams.append("per_page", page)
                                .append("type", type)
        return this.httpClient.get(url, {params : queryParams})
    }

    sendNotification(body) {
        const url = "https://formspree.io/f/xvoywpnp"
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.httpClient.post(url, 
            {name : body.sender, replyto : body.receiver, message : body.message}, 
            {headers : headers}
        )
    }

    addWorkProgress(body){
        const url = this.apiUrl + '/report/progress'
        return this.httpClient.post(url, body)
    }
}