import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
  
@Injectable({
  providedIn: 'root'
})
export class ProfileBateraService {
  private userUrl = 'http://env-6573880.jh-beon.cloud/user';
  private companyUrl = 'http://env-6573880.jh-beon.cloud/pengaturan/profile_perusahaan'
  private uploadUrl = 'http://env-6573880.jh-beon.cloud/file/upload';

  private testUrl = 'http://localhost:3002/testPutData'

  constructor(private httpClient: HttpClient) { }

  public getUserData() {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("per_page", 10)
                            .append("q", "")
                            .append("role", "all")
                            .append("status", "all")
    return this.httpClient.get(this.userUrl,  {params  : queryParams})
  }

  public updateUser(postData){
    const httpHeaders = new HttpHeaders();
    httpHeaders.append('content-type', 'application/json')
    let endPoints = this.userUrl + "/" + postData.id_user
    return this.httpClient.put(endPoints , postData, {headers : httpHeaders})
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
    return this.httpClient.post(this.userUrl, body, {headers : httpHeaders})
  }

  public deleteUser(id){
    let endPoints = "/" + id
    return this.httpClient.delete(this.userUrl + endPoints)
  }

  public getCompanyProfile(){
    let queryParams = new HttpParams();
    queryParams = queryParams.append("per_page", 1)
                            .append("q", "")
    return this.httpClient.get(this.companyUrl, {params  : queryParams})
  }

  public updateCompanyProfile(body){
    const httpHeaders = new HttpHeaders();
    httpHeaders.append('content-type', 'application/json')
    return this.httpClient.put(this.companyUrl, body , {headers : httpHeaders})
  }

  public loadImage(body){
    return this.httpClient.post(this.uploadUrl, body, {
      reportProgress : true, observe : 'events'
    })
  }
}