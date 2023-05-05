import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from "../../../environments/environment"
  
@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor(private httpClient: HttpClient) { }
  private apiUrl = environment.apiUrl;

  public getDataProjects(){
    const url = this.apiUrl + "/proyek";
    let queryParams = new HttpParams();
    queryParams = queryParams.append("per_page", "")
                             .append("q", "");
    return this.httpClient.get(url,  {params  : queryParams});
  }

  addDataProject(body){
    const url = this.apiUrl + "/proyek";
    const httpHeaders = new HttpHeaders();
    httpHeaders.append('content-type', 'application/json');
    return this.httpClient.post(url, body, {headers : httpHeaders});
  }

  getSubProjectData(id){
    const url = this.apiUrl + "/proyek/" + id;
    return this.httpClient.get(url);
  }

  updateProject(postBody){
    const url = this.apiUrl + "/proyek/" + postBody.id_proyek;
    return this.httpClient.put(url, postBody);
  }
  
  deleteProject(id){
    const url = this.apiUrl + "/proyek/" + id;
    return this.httpClient.delete(url);
  }

  workArea(postbody, id){
    const url = this.apiUrl + "/proyek/" + id + "/work_area";
    const httpHeaders = new HttpHeaders();
    httpHeaders.append('content-type', 'application/json')
    return this.httpClient.put(url, postbody, {headers : httpHeaders});
  }

  addJobProgress(body) {
    const url = this.apiUrl + "/report/progress";
    return this.httpClient.post(url, body);
  }

  updateProgress(body){
    const url = this.apiUrl + "/report/progress";
    return this.httpClient.post(url, body);
  }
}