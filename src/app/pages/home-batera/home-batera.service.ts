import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
  
@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private url = 'http://env-6573880.jh-beon.cloud/home/kapal';
   
  constructor(private httpClient: HttpClient) { }
  
  getPosts(){
    return this.httpClient.get(this.url);
  }
  
  addShip(body){
    const postBody = {
      "id_user":"4",
      "nama_kapal":"MT Slahung 1",
      "foto":"1__630d957c854ac_NoLznGBOsRFLdibJU7Rc_medical-5459661_640.png",
      "nama_perusahaan":"Batera",
      "merk_perusahaan":"PT",
      "alamat_perusahaan_1":"",
      "alamat_perusahaan_2":"",
      "telepon":"081234567",
      "faximile":"00979879",
      "npwp":"1",
      "email":"bs@gmail.com"
    }
    this.httpClient.post(this.url, postBody)
  }

}