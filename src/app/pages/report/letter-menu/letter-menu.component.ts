import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { LetterDocComponent } from '../letter-doc/letter-doc.component';
import { ReportService } from '../report.service';

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
              private reportService : ReportService,
              private dialog : MatDialog,
  ) { }

  @Input() typeMenu : any
  @Output() reloadPage = new EventEmitter<string>();
  @Input() projectData : any
  @Input() workProgressData
  @Input() picData
  @Input() companyProfile
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
      this.menuData = data
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
    const {kapal, tahun} = this.workProgressData
    const postBody = this.picData.map(resp => ({
      shipyard : {
        nama_user : resp.nama_lengkap,
        nama_perusahaan : this.companyProfile.profile_nama_perusahaan,
        email : resp.email
      },
      no_docking : kapal.nama_kapal + ' -DD- ' + tahun,
      [this.typeMenu] : [
        {
          title : row.perihal,
          sender : row.nama_pengirim,
          date : row.tgl,
          remarks : row.keterangan
        }
      ]
    }))

    postBody.forEach(body => {
      this.reportService.sendLetterEmail(body, this.typeMenu)
      .subscribe(res => console.log(res), err => console.log(err))
    })
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subs => subs.unsubscribe())
  }
}


