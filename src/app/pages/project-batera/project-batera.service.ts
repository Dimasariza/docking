import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
  
@Injectable({
  providedIn: 'root'
})
export class PostService {
  private url = 'http://env-6573880.jh-beon.cloud/proyek';
   
  constructor(private httpClient: HttpClient) { }
  
  public getPosts() {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("per_page", "")
                            .append("q", "mt")
    return this.httpClient.get(this.url,  {params  : queryParams})
    }
  
}