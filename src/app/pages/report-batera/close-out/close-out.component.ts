import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NbIconLibraries, NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { LetterDocComponent } from '../letter-doc/letter-doc.component';
import { ReportBateraService } from '../report-batera.service';

@Component({
  selector: 'ngx-close-out',
  templateUrl: './close-out.component.html',
})
export class CloseOutComponent implements OnInit {
  constructor(private activatedRoute : ActivatedRoute,
              private reportService : ReportBateraService,
              private dialog : MatDialog,
    ) {
  }

  corData : any = []
  ngOnInit(){
    const id = this.activatedRoute.snapshot.paramMap.get('id')
    this.reportService.getDocument(id, "", "close_out_report")
    .subscribe(({data} : any) => {
      data.length ? 
      this.corData = data.map(data => {
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
        this.addLetterDial()
        break
      case 'Refresh' :
        break
    }
  }

  addLetterDial(){
    const dialog = this.dialog.open(LetterDocComponent, { 
      // disableClose : true,
      autoFocus : true,
    })

    // dialog.componentInstance.onSuccess.asObservable().subscribe(() => {
    //   this.ngOnInit()
    // })
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

