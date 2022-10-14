import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { LetterDocComponent } from '../letter-doc/letter-doc.component';
import { ReportBateraService } from '../report-batera.service';

const buttons = [
  {
    icon: 'refresh',
    desc: 'Refresh'
  },
  {
    icon : 'file-text-outline',
    desc : 'Add Document'
  }
]

@Component({
  selector: 'ngx-bast',
  templateUrl: './letter-menu.component.html',
})
export class LetterMenuComponent  {
  constructor(private activatedRoute : ActivatedRoute,
              private reportService : ReportBateraService,
              private dialog : MatDialog,
  ) { }

  @Input() typeMenu : any
  @Output() reloadPage = new EventEmitter<string>();
  buttons = buttons
  menuData : any = []
  pojectId : any

  ngOnInit(){
    const id = this.activatedRoute.snapshot.paramMap.get('id')
    this.pojectId = id
    this.reportService.getDocument(id, "", this.typeMenu)
    .subscribe(({data} : any) => {
      data.length ? 
      this.menuData = data.map(data => {
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
        this.reloadPage.emit()
        break
    }
  }

  triggerSelectFile(fileInput: HTMLInputElement) {
    fileInput.click()
  }

  addLetterDial(){
    const dialog = this.dialog.open(LetterDocComponent, { 
      disableClose : true,
      autoFocus : true,
      data : {
        dial : this.typeMenu,
        id : this.pojectId
      }
    })
    dialog.componentInstance.onSuccess.asObservable().subscribe(() => {
      this.ngOnInit()
    })
  }

}


