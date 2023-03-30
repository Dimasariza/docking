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

    getSuplier(page = '', per_page = '', q = ''){
        const url = this.apiUrl + "/supplier"
        let queryParams = new HttpParams();
        queryParams = queryParams.append("page", page)
                                .append("per_page", per_page)
                                .append("q", q)
        return this.httpClient.get(url, {params : queryParams})
    }

    updateSuplier(body) {
        const url = this.apiUrl + "/supplier" + body.id_supplier
        return this.httpClient.get(url)
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

    sendWorkProgressEmail(body) {
        const url = this.apiUrl + "/email/work_progress"
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.httpClient.post(url, body)
    }
    
    sendWorkVariantEmail(body) {
        const url = this.apiUrl + "/email/work_variant"
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.httpClient.post(url, body)
    }

    sendLetterEmail(body, typeMenu) {
        const url = this.apiUrl + "/email/" + typeMenu
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.httpClient.post(url, body, {headers : headers})
    }

    addWorkProgress(body){
        const url = this.apiUrl + '/report/progress'
        return this.httpClient.post(url, body)
    }


}