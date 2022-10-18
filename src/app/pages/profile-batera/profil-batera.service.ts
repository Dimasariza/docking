import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from "../../../environments/environment"
  
@Injectable({
  providedIn: 'root'
})
export class ProfileBateraService {
  constructor(private httpClient: HttpClient) { }
  private apiUrl = environment.apiUrl

  getUserData(page, per_page, q, role, status) {
    const url = this.apiUrl + "/user"
    let queryParams = new HttpParams();
    queryParams = queryParams.append("page", page)
                            .append("per_page", per_page)
                            .append("q", q)
                            .append("role", role)
                            .append("status", status)
    return this.httpClient.get(url,  {
      params  : queryParams
    })
  }

  getUserPerId(id){
    const url = this.apiUrl + "/user/" + id
    return this.httpClient.get(url)
  }

  updateUser(postData){
    const url = this.apiUrl + "/user/" + postData.id_user
    const httpHeaders = new HttpHeaders();
    httpHeaders.append('content-type', 'application/json')
    return this.httpClient.put(url , postData, {
      headers : httpHeaders
    })
  }

  addUser(postBody) {
    const url = this.apiUrl + "/user"
    const httpHeaders = new HttpHeaders();
    httpHeaders.append('content-type', 'application/json')
    return this.httpClient.post(url, postBody, {
      headers : httpHeaders
    })
  }

  deleteUser(id){
    const url = this.apiUrl + "/user/" + id
    return this.httpClient.delete(url)
  }

  getCompanyProfile(){
    const url = environment.apiUrl + '/pengaturan/profile_perusahaan'
    let queryParams = new HttpParams();
    queryParams = queryParams.append("per_page", 10)
                            .append("q", "")
    return this.httpClient.get(url, {params  : queryParams})
  }

  updateCompanyProfile(body){
    const url = environment.apiUrl + '/pengaturan/profile_perusahaan'
    const httpHeaders = new HttpHeaders();
    httpHeaders.append('content-type', 'application/json')
    return this.httpClient.put(url, body , {headers : httpHeaders})
  }
}