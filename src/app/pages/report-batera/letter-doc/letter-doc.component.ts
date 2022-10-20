import { DatePipe } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ReportBateraService } from '../report-batera.service';

@Component({
  selector: 'ngx-letter-doc',
  templateUrl: './letter-doc.component.html',
  styles: [
  ]
})
export class LetterDocComponent implements OnInit, OnDestroy {
  constructor(private dialogRef: MatDialogRef<LetterDocComponent>,
              private reportService : ReportBateraService,
              private datepipe: DatePipe,
              @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
  onSuccess : EventEmitter<any> = new EventEmitter<any>()
  subscription : Subscription []  = []

  triggerSelectFile(fileInput: HTMLInputElement) {
    fileInput.click()
  }

  ngOnInit(): void {}

  addLetter(data){
    switch (this.data.dial) {
      case 'bast' :
        this.addBastDoc(data)
      break;
      case 'surat_teguran' :
        this.addSuratTeguran(data)
      break;
      case 'close_out_report' :
        this.addCorDoc(data)
      break;
    }
  }

  public fileName : any = ""
  onFileChange(res){
    const formData = new FormData();
    const file = res.target?.files[0];
    file?.name ? this.fileName = file.name : null
    formData.append('dokumen', file);
    const _subs = this.reportService.addAttachment(formData)
    .subscribe((res) => {
      if (res.type === HttpEventType.UploadProgress) {
        console.log("Upload Progress: " + Math.round(res.loaded / res.total ) * 100 + ' %')
      } else if ( res.type === HttpEventType.Response){
        console.log("final Response uploading image")
      }
    })
    this.subscription.push(_subs)
  }

  addBastDoc(data){
    const postBody = {
      ...data.value,
      tgl : this.datepipe.transform(data.value?.tgl , 'yyyy-MM-dd'),
      type : this.data.dial,
      id_proyek : this.data.id,
      dokumen : this.fileName
    }
    this.submitLetter(postBody)
  }

  addCorDoc(data){
    const postBody = {
      ...data.value,
      tgl : this.datepipe.transform(data.value?.tgl , 'yyyy-MM-dd'),
      type : this.data.dial,
      id_proyek : this.data.id,
      dokumen : this.fileName
    }
    this.submitLetter(postBody)
  }

  addSuratTeguran(data){
    const postBody = {
      ...data.value,
      tgl : this.datepipe.transform(data.value?.tgl , 'yyyy-MM-dd'),
      type : this.data.dial,
      id_proyek : this.data.id,
      dokumen : this.fileName
    }
    this.submitLetter(postBody)
  }

  submitLetter(postBody){
    const _subs = this.reportService.addDocument(postBody)
    .subscribe(() => {
    this.onSuccess.emit()
    this.subscription.push(_subs)
    this.close()
    })
  }

  close(){this.dialogRef.close();}

  ngOnDestroy(): void {
    this.subscription.forEach(subs => subs.unsubscribe())
  }
}
