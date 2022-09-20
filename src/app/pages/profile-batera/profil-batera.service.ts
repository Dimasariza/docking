import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
  
@Injectable({
  providedIn: 'root'
})
export class ProfileBateraService {
    private url = 'http://env-6573880.jh-beon.cloud/user';

    constructor(private httpClient: HttpClient) { }
  
    headers = new HttpHeaders().append('header', 'value');
    params = new HttpParams().append('param', "value");

    public getPosts() {
        let queryParams = new HttpParams();
        queryParams = queryParams.append("per_page", 10)
                                .append("q", "")
                                .append("role", "all")
                                .append("status", "active")
        return this.httpClient.get(this.url,  {params  : queryParams})
    }

    public addUser() {
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
      return this.httpClient.post(this.url, body, {headers : httpHeaders})
  }

  public deleteUser(){
    let delelteUrl = 'http://env-6573880.jh-beon.cloud/user/6'
    const httpHeaders = new HttpHeaders();
    return this.httpClient.delete(delelteUrl)
  }

  public updateUser(){
    const httpHeaders = new HttpHeaders();
    httpHeaders.append('content-type', 'application/json')
    
    const postData = {
        "username":"SA_MA",
        "nama_lengkap":"Super Admin boy",
        "jabatan":"admin",
        "no_hp":"",
        "email":"admin@gmail.com",
        "password":"",
        "status":"active"
    }

    let id: number = 1;
    let endPoints = "/" + id
    return this.httpClient.put(this.url + endPoints, postData, {headers : httpHeaders})
  }
}