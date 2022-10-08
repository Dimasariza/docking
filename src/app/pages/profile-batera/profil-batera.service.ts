import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from "../../../environments/environment"
  
@Injectable({
  providedIn: 'root'
})
export class ProfileBateraService {
  constructor(private httpClient: HttpClient) { }
  private apiUrl = environment.apiUrl

  getUserData(page, q, role, status) {
    const url = this.apiUrl + "/user"
    let queryParams = new HttpParams();
    queryParams = queryParams.append("per_page", page)
                            .append("q", q)
                            .append("role", role)
                            .append("status", status)
    return this.httpClient.get(url,  {
      params  : queryParams
    })
  }

  updateUser(postData){
    const url = this.apiUrl + "/user/" + postData.id_user
    const httpHeaders = new HttpHeaders();
    httpHeaders.append('content-type', 'application/json')
    return this.httpClient.put(url , postData, {
      headers : httpHeaders
    })
  }

  addUser() {
    const url = this.apiUrl + "/user"
    const httpHeaders = new HttpHeaders();
    httpHeaders.append('content-type', 'application/json')
    const body = { 
      username : "K18_PD",
      nama_lengkap : "Kiseki Provider",
      jabatan : "provider",
      no_hp : "",
      email : "kzenkipasdflk25@gmail.com",
      password : "kiseki",
      role : "admin"
    };
    return this.httpClient.post(url, body, {
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