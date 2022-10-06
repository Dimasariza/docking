import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
  
@Injectable({
  providedIn: 'root'
})
export class ProjectBateraService {
  private getProjectURL = 'http://env-6573880.jh-beon.cloud/proyek';
  private shipUrl = 'http://env-6573880.jh-beon.cloud/home/kapal'
  private profilePerusahaan = 'http://env-6573880.jh-beon.cloud/pengaturan/profile_perusahaan'

  private testUrl = 'http://localhost:3002/testPutData'

  constructor(private httpClient: HttpClient) { }
  
  public getProjects() {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("per_page", "")
                            .append("q", "")
    return this.httpClient.get(this.getProjectURL,  {params  : queryParams})
  }

  public getShip(){
    return this.httpClient.get(this.shipUrl)
  }

  public getProfilePerusahaan () {
    return this.httpClient.get(this.profilePerusahaan)
  }

  public addDataProject(body){
    const httpHeaders = new HttpHeaders();
    httpHeaders.append('content-type', 'application/json')
    return this.httpClient.post(this.getProjectURL, body, {headers : httpHeaders})
  }

  public getSubProjectData(id){
    const endPoint = this.getProjectURL + "/" + id
    return this.httpClient.get(endPoint)
  }

  public deleteProject(id_proyek){
    let endPoint = this.getProjectURL + '/' + id_proyek
    return this.httpClient.delete(endPoint)
  }

  addProjectJob(postbody, id_proyek){
    const httpHeaders = new HttpHeaders();
    httpHeaders.append('content-type', 'application/json')
    const url = this.getProjectURL + '/' + id_proyek + '/' + "work_area"
    return this.httpClient.put(url, postbody, {headers : httpHeaders})
  }

  updateWorkArea(body){
    const endPoint = this.getProjectURL + "/" + 1 + "/" + "work_area"
    return this.httpClient.put(endPoint, body)
  }

  publishProject(id){
    const endPoint = this.getProjectURL + "/" + id + "/publish"
    return this.httpClient.put(endPoint, "")
  }
}