import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
  
@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private url = 'http://env-6573880.jh-beon.cloud/home/kapal';
  private uploadImage = 'http://env-6573880.jh-beon.cloud/file/upload';
  private testUrl = "http://localhost:3002/homedata"
   
  constructor(private httpClient: HttpClient) { }
  
  getPosts(){
    return this.httpClient.get(this.url);
  }
  
  addShip(body){
    console.log(body)
    return this.httpClient.post(this.uploadImage, body, {reportProgress : true, observe : 'events'})
  }

}