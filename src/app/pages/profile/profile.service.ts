import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from "../../../environments/environment"
  
@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(private httpClient: HttpClient) { }
  private apiUrl = environment.apiUrl

  getAllUsers({page = 1, per_page = 10, q = '', role = '', status = ''}) {
    const url = this.apiUrl + "/user";
    let queryParams = new HttpParams();
    queryParams = queryParams .append("page", page)
                              .append("per_page", per_page)
                              .append("q", q)
                              .append("role", role)
                              .append("status", status)
    return this.httpClient.get(url,  {
      params  : queryParams
    })
  }

  getUserById(id){
    const url = this.apiUrl + "/user/" + id;
    return this.httpClient.get(url)
  }

  updateUser(postData, id){
    const url = this.apiUrl + "/user/" + id;
    const httpHeaders = new HttpHeaders();
    httpHeaders.append('content-type', 'application/json');
    return this.httpClient.put(url , postData, {
      headers : httpHeaders
    })
  }

  addUser(postBody) {
    const url = this.apiUrl + "/user";
    const httpHeaders = new HttpHeaders();
    httpHeaders.append('content-type', 'application/json');
    return this.httpClient.post(url, postBody, {
      headers : httpHeaders
    })
  }

  deleteUser(id){
    const url = this.apiUrl + "/user/" + id;
    return this.httpClient.delete(url);
  }

  getCompanyProfile({per_page = 10, q = ''}){
    const url = environment.apiUrl + '/pengaturan/profile_perusahaan';
    let queryParams = new HttpParams();
    queryParams = queryParams .append("per_page", per_page)
                              .append("q", q)
    return this.httpClient.get(url, {params  : queryParams});
  }

  updateCompanyProfile(body){
    const url = environment.apiUrl + '/pengaturan/profile_perusahaan'
    const httpHeaders = new HttpHeaders();
    httpHeaders.append('content-type', 'application/json')
    return this.httpClient.put(url, body , {headers : httpHeaders})
  }
}