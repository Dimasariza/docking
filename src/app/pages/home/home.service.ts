import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from "../../../environments/environment"
  
@Injectable({
  providedIn: 'root'
}) 
export class HomeService {
  constructor(private httpClient: HttpClient) { }
  private apiUrl = environment.apiUrl;
  
  getUserLogin(){
    const url = this.apiUrl + "/auth/profile";
    return this.httpClient.get(url);
  }

  getFile(img) {
    const url = this.apiUrl + '/file/show/' + img;
    const httpHeaders = new HttpHeaders();
    httpHeaders.append("Access-Control-Allow-Methods","GET, POST");
    httpHeaders.append("Access-Control-Allow-Origin","*");
    return this.httpClient.get(url, {headers : httpHeaders, responseType : 'arraybuffer'})
  }
  
  getAllShips({ page = 1, per_page = 10, q = "" }){
    const url = this.apiUrl + "/home/kapal";
    const httpHeaders = new HttpHeaders();
    httpHeaders.append('content-type', 'application/json')
    let queryParams = new HttpParams();
    queryParams = queryParams .append("page", page)
                              .append("per_page", per_page)
                              .append("q", q)
    return this.httpClient.get(url, {
      headers : httpHeaders, 
      params  : queryParams
    });
  }

  uploadFile(postBody){
    const url = this.apiUrl + "/file/upload";
    return this.httpClient.post(url, postBody, {
      reportProgress : true, observe : 'events'
    })
  }

  addShip(postBody){
    const url = this.apiUrl + "/home/kapal"; 
    const httpHeaders = new HttpHeaders();
    httpHeaders.append('content-type', 'application/json')
    return this.httpClient.post(url, postBody, {
      headers : httpHeaders, 
    })
  }

  updateShip(postBody){
    const url = this.apiUrl + "/home/kapal/" + postBody.id_kapal;
    const httpHeaders = new HttpHeaders();
    httpHeaders.append('content-type', 'application/json');
    return this.httpClient.put(url, postBody, {
      headers : httpHeaders
    })
  }

  deleteShip(id){
    const url = this.apiUrl + "/home/kapal/" + id;
    const httpHeaders = new HttpHeaders();
    httpHeaders.append('content-type', 'application/json');
    return this.httpClient.delete(url, {
      headers : httpHeaders
    })
  }
}