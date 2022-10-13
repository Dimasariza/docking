import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NbIconLibraries, NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { LetterDocComponent } from '../letter-doc/letter-doc.component';
import { ReportBateraService } from '../report-batera.service';


@Component({
  selector: 'ngx-bast',
  templateUrl: './bast.component.html',
})
export class BastComponent  {
  constructor(
    public activatedRoute : ActivatedRoute,
    private reportService : ReportBateraService,
    public dialog : MatDialog,
    ) {
  }

  bastData : any = []
  ngOnInit(){
    const id = this.activatedRoute.snapshot.paramMap.get('id')
    this.reportService.getDocument(id, "", "bast")
    .subscribe(({data} : any) => {
      data.length ? 
      this.bastData = data.map(data => {
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
        // this.triggerSelectFile(data)
        this.addLetterDial()
        break
      case 'Refresh' :
        break
    }
  }

  triggerSelectFile(fileInput: HTMLInputElement) {
    fileInput.click()
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


