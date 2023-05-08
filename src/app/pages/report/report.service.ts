import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment"

@Injectable({
    providedIn: 'root'
})
export class ReportService {
    constructor(private httpClient : HttpClient){}
    private apiUrl = environment.apiUrl

    getProjectSummary({page = 1, per_page = '', q = '', status = ''}) {
        const url = this.apiUrl + "/report/proyek";
        let httpHeaders = new HttpHeaders();
        httpHeaders = httpHeaders.append('content-type', 'application/json')
        let queryParams = new HttpParams();
        queryParams = queryParams.append("page", page)
                                 .append("per_page", per_page)
                                 .append("q", q)
                                 .append("status", status)
        return this.httpClient.get(url, {headers : httpHeaders, params : queryParams})
    }

    getWorkPerProject(id){
        const url = this.apiUrl + "/report/proyek/" + id;
        return this.httpClient.get(url)
    }

    updateProjectSummary(body) {
        const url = this.apiUrl + "/report/proyek/" + body.id_proyek;
        return this.httpClient.put(url, body)
    }

    updateReportWorkArea(postBody, id_proyek){
        const url = this.apiUrl + "/report/proyek/" + id_proyek + "/work_area";
        const httpHeaders = new HttpHeaders();
        httpHeaders.append('content-type', 'application/json');
        return this.httpClient.put(url, postBody, {headers : httpHeaders});
    }

    updateReportVarianWork(postBody, id){
        const url = this.apiUrl + "/report/proyek/" + id + "/variant_work";
        const httpHeaders = new HttpHeaders();
        httpHeaders.append('content-type', 'application/json');
        return this.httpClient.put(url, postBody, {headers : httpHeaders});
    }
    
    getAllSupliers({page = '', per_page = '', q = ''}){
        const url = this.apiUrl + "/supplier"
        let queryParams = new HttpParams();
        queryParams = queryParams.append("page", page)
                                 .append("per_page", per_page)
                                 .append("q", q)
        return this.httpClient.get(url, {params : queryParams})
    }

    addSuplier(body){
        const url = this.apiUrl + "/supplier";
        return this.httpClient.post(url, body);
    }

    updateSuplier(body) {
        const url = this.apiUrl + "/supplier/" + body.id_supplier;
        return this.httpClient.put(url, body);
    }

    deleteSupplier(id_supplier) {
        const url = this.apiUrl + "/supplier" + id_supplier;
        return this.httpClient.delete(url);
    }

    addDocument(body){
        const url = this.apiUrl + "/report/detail";
        return this.httpClient.post(url, body);
    }

    addAttachment(body){
        const url = this.apiUrl + "/file/attachment";
        return this.httpClient.post(url, body, {
            reportProgress : true, observe : 'events'
        })
    }

    getAttachment(id) {
        const url = this.apiUrl + "/file/attachment/" + id;
        const httpHeaders = new HttpHeaders();
        httpHeaders.append("Access-Control-Allow-Methods","GET, POST");
        httpHeaders.append("Access-Control-Allow-Origin","*");
        return this.httpClient.get(url, {headers : httpHeaders, responseType : 'arraybuffer'});
    }

    getDocumentLetter({id, page = '', type}){
        const url = this.apiUrl + "/report/proyek/" + id + "/detail";
        let queryParams = new HttpParams();
        queryParams = queryParams.append("per_page", page)
                                 .append("type", type)
        return this.httpClient.get(url, {params : queryParams})
    }

    sendWorkProgressEmail(body) {
        const url = this.apiUrl + "/email/work_progress";
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.httpClient.post(url, body);
    }
    
    sendWorkVariantEmail(body) {
        const url = this.apiUrl + "/email/work_variant";
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.httpClient.post(url, body);
    }

    sendLetterEmail(body, typeMenu) {
        const url = this.apiUrl + "/email/" + typeMenu;
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.httpClient.post(url, body, {headers : headers});
    }

    addWorkProgress(body){
        const url = this.apiUrl + '/report/progress'
        return this.httpClient.post(url, body)
    }
}