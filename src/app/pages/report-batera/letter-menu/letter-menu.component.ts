import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
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
export class LetterMenuComponent implements OnInit, OnDestroy {
  constructor(private activatedRoute : ActivatedRoute,
              private reportService : ReportBateraService,
              private dialog : MatDialog,
  ) { }

  @Input() typeMenu : any
  @Output() reloadPage = new EventEmitter<string>();
  buttons = buttons
  menuData : any = []
  pojectId : any
  subscription : Subscription [] = []

  ngOnInit() : void {
    const id = this.activatedRoute.snapshot.paramMap.get('id')
    this.pojectId = id
    const _subs = this.reportService.getDocument(id, "", this.typeMenu)
    .pipe(take(1))
    .subscribe(({data} : any) => {
      if(!data.length) return; 
      this.menuData = data.map(data => {
        const {perihal, tgl, nama_pengirim, created_by, keterangan} = data
        return { 
          perihal ,tgl, nama_pengirim, created_by, keterangan
        }
      })
    })

    this.subscription.push(_subs)
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
    const _subs = dialog.componentInstance.onSuccess.asObservable()
    .pipe(take(1))
    .subscribe(() => {
      this.ngOnInit()
    })
    this.subscription.push(_subs)
  }

  sendEmail(row) {
    console.log(row)
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subs => subs.unsubscribe())
  }
}


