import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbIconLibraries, NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { ReportBateraService } from '../report-batera.service';

@Component({
  selector: 'ngx-surat-teguran',
  templateUrl: './surat-teguran.component.html',
})
export class SuratTeguranComponent implements OnInit {

  constructor(
    public activatedRoute : ActivatedRoute,
    private reportService : ReportBateraService
    ) {
  }

  suratTeguranData : any = []
  ngOnInit(){
    const id = this.activatedRoute.snapshot.paramMap.get('id')
    this.reportService.getDocument(id, "", "surat_teguran")
    .subscribe(({data} : any) => {
      data.length ? 
      this.suratTeguranData = data.map(data => {
        console.log(data)
        const {perihal, tgl, nama_pengirim, created_by, keterangan} = data
        return {
          perihal : perihal,
          tgl : tgl,
          nama_pengirim : nama_pengirim,
          created_by : created_by,
          keterangan : keterangan
        }
      }) : null
    })
  }

  onClickBtn(desc, data){
    switch(desc){
      case 'Add Document':
        this.triggerSelectFile(data)
        break
      case 'Refresh' :
        break
    }
  }

  triggerSelectFile(fileInput: HTMLInputElement) {
    fileInput.click()
  }


  buttons = [
    {
      icon: 'refresh',
      desc: 'Refresh'
    },
    {
      icon : 'file-text-outline',
      desc : 'Add Document'
    }
  ]
}

