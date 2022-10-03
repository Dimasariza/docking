import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
  
@Injectable({
  providedIn: 'root'
})
export class ProjectBateraService {
  private url = 'http://env-6573880.jh-beon.cloud/proyek';
  private shipUrl = 'http://env-6573880.jh-beon.cloud/home/kapal'
  private profilePerusahaan = 'http://env-6573880.jh-beon.cloud/pengaturan/profile_perusahaan'

  private testUrl = 'http://localhost:3002/testPutData'

  constructor(private httpClient: HttpClient) { }
  
  public getProjects() {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("per_page", "")
                            .append("q", "")
    return this.httpClient.get(this.url,  {params  : queryParams})
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
    return this.httpClient.post(this.url, body, {headers : httpHeaders})
  }

  public getSubProjectData(id){
    const getSubUrl = this.url + "/" + id
    return this.httpClient.get(getSubUrl)
  }

  public deleteProject(id_proyek){
    let endPoint = this.url + '/' + id_proyek
    return this.httpClient.delete(endPoint)
  }

  addProjectJob(postbody, id_proyek){
    const httpHeaders = new HttpHeaders();
    httpHeaders.append('content-type', 'application/json')
    const url = this.url + '/' + id_proyek + '/' + "work_area"
    return this.httpClient.put(url, postbody, {headers : httpHeaders})
  }

  updateWorkArea(body){
    const endPoint = this.url + "/" + 1 + "/" + "work_area"
    return this.httpClient.put(endPoint, body)
  }
}