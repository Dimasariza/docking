import { DatePipe } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReportBateraService } from '../report-batera.service';

@Component({
  selector: 'ngx-letter-doc',
  templateUrl: './letter-doc.component.html',
  styles: [
  ]
})
export class LetterDocComponent implements OnInit {
  constructor(private dialogRef: MatDialogRef<LetterDocComponent>,
              private reportService : ReportBateraService,
              private datepipe: DatePipe,
              @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
  onSuccess : EventEmitter<any> = new EventEmitter<any>()

  triggerSelectFile(fileInput: HTMLInputElement) {
    fileInput.click()
  }

  ngOnInit(): void {
  }

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

  public fileName : any;
  public uploadFile : any
  onFileChange(res){
    const file = res.target?.files[0];
    file?.name ? (() => {
      this.fileName = file.name
      this.uploadFile = file
    })() : null
    const formData = new FormData();
    formData.append('dokumen', file);
    this.reportService.addAttachment(formData)
    .subscribe((res) => {
      console.log(res)
      if (res.type === HttpEventType.UploadProgress) {
        console.log("Upload Progress: " + Math.round(res.loaded / res.total ) * 100 + ' %')
      } else if ( res.type === HttpEventType.Response){
        console.log("final Response uploading image")
      }
    })
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
    this.reportService.addDocument(postBody)
    .subscribe(() => {
    this.close()
  })
  }

  close(){this.dialogRef.close();}

}
