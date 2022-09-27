import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
  
@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private url = 'http://env-6573880.jh-beon.cloud/home/kapal';
  private uploadImage = 'http://env-6573880.jh-beon.cloud/file/upload';
  private idPerusahaan = 'http://env-6573880.jh-beon.cloud/perusahaan';

   
  constructor(private httpClient: HttpClient) { }
  
  getPosts(){
    return this.httpClient.get(this.url);
  }

  getIdPerusahaan(){
    const httpHeaders = new HttpHeaders();
    httpHeaders.append('content-type', 'application/json')
    let queryParams = new HttpParams();
    queryParams = queryParams.append("per_page", 1)
                            .append("q", "")
    return this.httpClient.get(this.idPerusahaan,  {headers : httpHeaders, params  : queryParams})
  }
  
  uploadShipimg(postBody){
    return this.httpClient.post(this.uploadImage, postBody, {reportProgress : true, observe : 'events'})
  }

  addShipData(postBody){
    const httpHeaders = new HttpHeaders();
    httpHeaders.append('content-type', 'application/json')
    return this.httpClient.post(this.url, postBody, {headers : httpHeaders})
  }

  deleteShip(id){
    const deleteUrl = this.url + "/" + id
    return this.httpClient.delete(deleteUrl)
  }

}