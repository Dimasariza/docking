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
    const postBody = {
      ...data.value,
      tgl : this.datepipe.transform(data.value?.tgl , 'yyyy-MM-dd'),
      type : this.data.dial,
      id_proyek : this.data.id,
      id_attachment : this.document.id_attachment
    }
    this.submitLetter(postBody)
  }

  public document : any = ""
  onFileChange(res){
    const formData = new FormData();
    const file = res.target?.files[0];
    const ext = file.type.split("/")[1]
    formData.append('dokumen', file);
    const _subs = this.reportService.addAttachment(formData)
    .subscribe((res) => {
      if (res.type === HttpEventType.UploadProgress) {
        console.log("Upload Progress: " + Math.round(res.loaded / res.total ) * 100 + ' %');
      } else if ( res.type === HttpEventType.Response){
        console.log("final Response uploading image")
        this.document = res.body
        this.document = this.document.data
      }
    })
    this.subscription.push(_subs)
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
