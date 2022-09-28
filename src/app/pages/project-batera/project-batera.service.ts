import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
  
@Injectable({
  providedIn: 'root'
})
export class ProjectBateraService {
  private url = 'http://env-6573880.jh-beon.cloud/proyek';
  private shipUrl = 'http://env-6573880.jh-beon.cloud/home/kapal'

  private testUrl = 'http://localhost:3002/testPutData'

  constructor(private httpClient: HttpClient) { }
  
  public getProjects() {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("per_page", "")
                            .append("q", "mt")
    return this.httpClient.get(this.url,  {params  : queryParams})
  }

  public getShip(){
    return this.httpClient.get(this.shipUrl)
  }

  public addDataProject(body){
    const httpHeaders = new HttpHeaders();
    httpHeaders.append('content-type', 'application/json')
    console.log(body)
    
    let postBody = {
      "id_kapal": body.id_kapal,
      "tahun": body.tahun,
      "nama_proyek": body.nama_proyek,
      "mata_uang": body.mata_uang,
      "off_hire_start": body.off_hire_start,
      "off_hire_end": body.off_hire_end,
      "off_hire_deviasi": body.off_hire_deviasi,
      "off_hire_rate_per_day": body.off_hire_rate_per_day,
      "off_hire_bunker_per_day": body.off_hire_bunker_per_day,
      "repair_start": body.repair_start,
      "repair_end": body.repair_end,
      "repair_in_dock_start": body.repair_in_dock_start,
      "repair_in_dock_end": body.repair_in_dock_end,
      "repair_additional_day": body.repair_additional_day,
      
      "owner_supplies":"5000000",
      "owner_services":"6000000",
      "owner_class":"1500000",
      "owner_other":"0",
      "owner_cancel_job":"0",
      
      "yard_cost":"13000000",
      "yard_cancel_job":"0"
      // "repair_in_dock_start": body.repair_in_dock_start,
      // "repair_in_dock_end":"2022-08-24",
      // "repair_additional_day":"0",
      // "owner_supplies":"5000000",
      // "owner_services":"6000000",
      // "owner_class":"1500000",
      // "owner_other":"0",
      // "owner_cancel_job":"0",
      // "yard_cost":"13000000",
      // "yard_cancel_job":"0"
    }
    return this.httpClient.post(this.url, postBody, {headers : httpHeaders})
  }

  public getSubProjectData(id){
    const getSubUrl = this.url + "/" + id
    return this.httpClient.get(getSubUrl)
  }

  public deleteProject(id_proyek){
    let endPoint = this.url + '/' + id_proyek
    return this.httpClient.delete(endPoint)
  }
  
}