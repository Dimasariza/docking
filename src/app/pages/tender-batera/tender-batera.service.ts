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

    getDataTenderPerId(id){
        const url = this.apiUrl + "/tender/" + id
        return this.httpClient.get(url)
    }

    getTenderBasedProject(id){
        const url = this.apiUrl + "/tender/proyek/" + id
        return this.httpClient.get(url)
    }

    getProjectSummary(page, per_page, q, status){
        const url = this.apiUrl + "/report/proyek"
        let queryParams = new HttpParams();
        queryParams = queryParams.append("per_page", page)
                                .append("status", per_page)
                                .append("q", q)
                                .append("status", status)
        return this.httpClient.get(url, {params : queryParams})
    }

    updateWorkArea(body, id){
        const url = this.apiUrl + "/tender/" + id + "/work_area"
        return this.httpClient.put(url, body)
    }

    addTenderContract(body){
        const url = this.apiUrl + "/tender"
        return this.httpClient.post(url, body)
    }

    updateTenderContract(body, id){
        const url = this.apiUrl + "/tender" + id
        return this.httpClient.put(url, body)
    }

    selectTender(id_proyek, id_tender){
        const url = this.apiUrl + "/tender/" + id_tender + "/select_tender"
        return this.httpClient.post(url, {id_proyek})
    }

    unselectTender(id){
        const url = this.apiUrl + "/tender/" + id + "/unselect_tender"
        return this.httpClient.delete(url)
    }

    deleteTender(id){
        const url = this.apiUrl + "/tender/" + id 
        return this.httpClient.delete(url)
    }
}