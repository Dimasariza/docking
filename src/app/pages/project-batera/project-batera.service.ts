import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
  
@Injectable({
  providedIn: 'root'
})
export class ProjectBateraService {
  private url = 'http://env-6573880.jh-beon.cloud/proyek';
  private shipUrl = 'http://env-6573880.jh-beon.cloud/home/kapal'

  constructor(private httpClient: HttpClient) { }
  
  public getProjects() {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("per_page", "")
                            .append("q", "mt")
    return this.httpClient.get(this.url,  {params  : queryParams})
  }

  public getShip(){
    return this.httpClient.get(this.shipUrl)
  }

  public addDataProject(postBody){
    return this.httpClient.post(this.url, postBody)
  }

  public getSubProjectData(id){
    const getSubUrl = this.url + "/" + id
    return this.httpClient.get(getSubUrl)
  }
  
}