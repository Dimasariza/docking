import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { ReportService } from '../../report.service';
import { Subject } from 'rxjs';
import { CommonFunction } from '../../../../component/common-function/common-function';
import { LetterDialogComponent } from './letter-dialog/letter-dialog.component';
import { ToastrComponent } from '../../../../component/toastr-component/toastr.component';

@Component({
  selector: 'ngx-letter-menu',
  templateUrl: './report-letter-menu.component.html',
})
export class LetterMenuComponent implements OnInit, OnDestroy {
  constructor(
    private reportService : ReportService,
    private commonFunction : CommonFunction,
    private toastr : ToastrComponent
  ) { }

  buttons = [
    { name: 'Refresh', icon: 'refresh' },
    { name: 'Add Document', icon: 'file-text-outline' }
  ]

  private destroy$: Subject<void> = new Subject<void>();

  @Output('refresh') refreshPage : EventEmitter<any> = new EventEmitter<string>();
  @Input() typeMenu : any;
  @Input() summaryData : any;
  @Input() responsible : any;

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
    { name: 'Send', type : 'button', width : 100, unSort : true,
      button :  [ 
        {icon : 'paper-plane-outline', menu : 'Send Notification', status : 'success'},
        {icon : 'file-outline', menu : 'See Document', status : 'info'},
      ], 
    },
  ];

  handleClickButton(button, data){
    if(button == 'Add Document') this.addLetterDialog();
    if(button == 'See Document') this.seeDocument(data);
    if(button == 'Refresh') {
      this.ngOnInit();
      this.refreshPage.emit();
      this.sendEmailProgress = false;
    }
    if(button == 'Send Notification') this.sendNotification(data);
  }

  addLetterDialog(){
    const title = 'Add Document';
    this.commonFunction.openDialog({
      dialogData : { 
        title,
        data : this.typeMenu
      },
      component : LetterDialogComponent
    })
    .onClose
    .pipe(takeUntil(this.destroy$))
    .subscribe(newData => newData 
      ? this.onUploadData(title, newData)
      : null );
  }

  seeDocument({id_attachment}) {
    if(id_attachment == null) return this.toastr.onInfo({infomsg : 'There is no document.'})
    this.reportService.getAttachment(id_attachment)
    .subscribe(data => {
      this.toastr.onInfo({infomsg : 'Getting your document. Please wait...'})
      const file = new Blob([data], { type: 'application/pdf' });            
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    })
  }

  onUploadData(title, data) {
    if(title == 'Add Document') {
      data.id_proyek = this.summaryData.id_proyek;
      this.reportService.addDocument(data)
      .subscribe(
        () => this.toastr.onUpload(),
        () => this.toastr.onError(),
        () => {
          this.toastr.onSuccess(`Your ${this.typeMenu} document has been added`)
          this.refreshPage.emit();
          this.ngOnInit();
        }
      )
    }
  }

  public sendEmailProgress;
  sendNotification(row) {
    this.sendEmailProgress = true; 
    const { kapal : {nama_kapal}, tahun, status } = this.summaryData.proyek;
    const postBody = this.responsible.map(resp => ({
      shipyard : {
        nama_user : resp.nama_lengkap,
        nama_perusahaan : this.summaryData.perusahaan.profile_nama_perusahaan ,
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
      .subscribe(
        () => this.sendEmailProgress = true,
        () => {
          this.sendEmailProgress = false;
          this.toastr.onError()
        },
        () => {
          this.sendEmailProgress = false;
          this.toastr.onSuccess('Your email has been send.');
        } 
      )
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}


