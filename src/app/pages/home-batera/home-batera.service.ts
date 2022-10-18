import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from "../../../environments/environment"
  
@Injectable({
  providedIn: 'root'
}) 
export class HomeBateraService {
  constructor(private httpClient: HttpClient) { }
  private apiUrl = environment.apiUrl
  
  getUserLogin(){
    const url = this.apiUrl + "/auth/profile"
    return this.httpClient.get(url)
  }

  getAllShip(){
    const url = this.apiUrl + "/home/kapal"
    const httpHeaders = new HttpHeaders();
    let queryParams = new HttpParams();
    queryParams = queryParams.append("page", 1)
                            .append("per_page", "10")
                            .append("q", "")
    return this.httpClient.get(url, {
      headers : httpHeaders, 
      params  : queryParams
    });
  }

  uploadFile(postBody){
    const url = this.apiUrl + "/file/upload"
    return this.httpClient.post(url, postBody, {
      reportProgress : true, observe : 'events'
    })
  }

  addShipData(postBody){
    const url = this.apiUrl + "/home/kapal"
    const httpHeaders = new HttpHeaders();
    httpHeaders.append('content-type', 'application/json')
    return this.httpClient.post(url, postBody, {
      headers : httpHeaders
    })
  }

  updateShip(id, postBody){
    const url = this.apiUrl + "/home/kapal/" + id
    const httpHeaders = new HttpHeaders();
    httpHeaders.append('content-type', 'application/json')
    return this.httpClient.put(url, postBody, {
      headers : httpHeaders
    })
  }

  deleteShip(id){
    const url = this.apiUrl + "/home/kapal/" + id
    return this.httpClient.delete(url)
  }
}