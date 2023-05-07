import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { ReportService } from '../../report.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'ngx-letter-menu',
  templateUrl: './report-letter-menu.component.html',
})
export class LetterMenuComponent implements OnInit, OnDestroy {
  constructor(
    private reportService : ReportService,
  ) { }

  buttons = [
    { name: 'Refresh', icon: 'refresh' },
    { name: 'Add Document', icon: 'file-text-outline' }
  ]

  private destroy$: Subject<void> = new Subject<void>();

  @Output() refresh : EventEmitter<any> = new EventEmitter<string>();
  @Input() typeMenu : any;
  @Input() summaryData : any;
  @Input() responsible : any;
  @Input() companyProfile : any;

  letterDatas : any = [];

  ngOnInit() : void {
    this.reportService.getDocumentLetter({id : this.summaryData.id_proyek, type : this.typeMenu})
    .pipe(takeUntil(this.destroy$))
    .subscribe(({data} : any) => data.length ? this.letterDatas = data : [] );
  }

  columns = [
    { name: 'No', type : 'index', prop : '', width : 70 },
    { name: 'Date', type : 'date', prop : 'tgl', width : 300 },
    { name: 'Title', type : 'text', prop : 'perihal', width : 200 },
    { name: 'Sender / Maker', type : 'text', prop : 'nama_pengirim', width : 300 },
    { name: 'Last View', type : 'date', prop : 'updated_at', width : 300 },
    { name: 'Remarks', type : 'text', prop : 'keterangan', width : 300 },
    { name: 'Send', type : 'button', width : 300, unSort : true,
      button :  [ 
        {icon : 'paper-plane-outline', menu : 'Send Notification', status : 'success'},
      ], 
    },
  ];

  handleClickButton(button, data){
    if(button == 'Add Document') this.addLetterDialog()
    if(button == 'Refresh') this.refresh.emit()
    // if(button == 'Send Notification') this.sendNotification(data)
  }

  addLetterDialog(){

    // const dialog = this.dialog.open(LetterDocComponent, { 
    //   disableClose : true,
    //   autoFocus : true,
    //   data : {
    //     dial : this.typeMenu,
    //     id :  this.summaryData.id_proyek
    //   }
    // })
    // dialog.componentInstance.onSuccess.asObservable()
    // .pipe(take(1))
    // .subscribe(() => {
    //   this.ngOnInit()
    // })
  }

  sendNotification(row) {
    const { kapal : {nama_kapal}, tahun, status } = this.summaryData.proyek;
    const postBody = this.responsible.map(resp => ({
      shipyard : {
        nama_user : resp.nama_lengkap,
        nama_perusahaan : this.companyProfile.profile_nama_perusahaan,
        email : resp.email
      },
      no_docking : `${nama_kapal} -DD- ${tahun} ${status.toUpperCase()}`,
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
    this.destroy$.next();
    this.destroy$.complete();
  }
}


