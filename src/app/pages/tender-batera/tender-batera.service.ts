import {  HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from"../../../environments/environment"

@Injectable({
    providedIn: 'root'
})
export class TenderBateraService {
    constructor (private httpClient : HttpClient,){}
    public apiUrl = environment.apiUrl
    
    getDataTender(page, status){    
        const url = this.apiUrl + "/tender"
        let queryParams = new HttpParams();
        queryParams = queryParams.append("per_page", page)
                                .append("status", status)
        return this.httpClient.get(url, {params  : queryParams})
    }

    getTenderBasedProject(id){
        const url = this.apiUrl + "/tender/proyek/" + id
        return this.httpClient.get(url)
    }

    updateWorkArea(body, id){
        const url = this.apiUrl + "/tender/" + id + "/work_area"
        return this.httpClient.put(url, body)
    }

    addDataTender(body){
        const url = this.apiUrl + "/tender"
        return this.httpClient.post(url, body)
    }

    selectTender(id){
        const url = this.apiUrl + "/tender/" + id + "/select_tender"
        return this.httpClient.post(url, "")
    }

    unselectTender(id){
        const url = this.apiUrl + "/tender/" + id + "/unselect_tender"
        return this.httpClient.delete(url)
    }
}