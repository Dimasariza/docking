import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
  
@Injectable({
  providedIn: 'root'
})
export class ProjectBateraService {
  private url = 'http://env-6573880.jh-beon.cloud/proyek';
   
  constructor(private httpClient: HttpClient) { }
  
  public getPosts() {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("per_page", "")
                            .append("q", "mt")
    return this.httpClient.get(this.url,  {params  : queryParams})
    }

    public addDataProject(){
      const postBody = {
        "id_kapal": 2,
        "tahun": "2022",
        "proyek_start": "2022-08-12",
        "proyek_end": "2022-09-07",
        "tipe_proyek": "docking",
        "perusahaan_penanggung_jawab":"Batera",
        "estimasi_biaya":"19000000",
        "master_plan":"-",
        "negara":"Indonesia",
        "prioritas":"high",
        "nama_proyek":"MT Salmon-dd-2022",
        "mata_uang":"IDR",
        "off_hire_start":"2022-08-13",
        "off_hire_end":"2022-08-29",
        "off_hire_deviasi":"3",
        "off_hire_rate_per_day":"1500000",
        "off_hire_bunker_per_day":"1250000",
        "repair_start":"2022-08-15",
        "repair_end":"2022-08-25",
        "repair_in_dock_start":"2022-08-16",
        "repair_in_dock_end":"2022-08-24",
        "repair_additional_day":"0",
        "owner_supplies":"5000000",
        "owner_services":"6000000",
        "owner_class":"1500000",
        "owner_other":"0",
        "owner_cancel_job":"0",
        "yard_cost":"13000000",
        "yard_cancel_job":"0",
        "deskripsi":""
      }
      return this.httpClient.post(this.url, postBody)
    }

    public getSubProjectData(id){
      const getSubUrl = this.url + "/" + id
      return this.httpClient.get(getSubUrl)
    }
  
}