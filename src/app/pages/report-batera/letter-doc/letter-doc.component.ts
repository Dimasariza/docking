import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
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
    console.log(this.data.dial)
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

  addBastDoc(data){
    const postBody = {
      ...data.value,
      tgl : this.datepipe.transform(data.value?.tgl , 'yyyy-MM-dd'),
      type : this.data.dial,
      id_proyek : this.data.id
    }
    console.log(postBody)
    this.submitLetter(postBody)
  }

  addCorDoc(data){
    const postBody = {
      ...data.value,
      tgl : this.datepipe.transform(data.value?.tgl , 'yyyy-MM-dd'),
      type : this.data.dial,
      id_proyek : this.data.id,
    }
    this.submitLetter(postBody)
  }

  addSuratTeguran(data){
    const postBody = {
      ...data.value,
      tgl : this.datepipe.transform(data.value?.tgl , 'yyyy-MM-dd'),
      type : this.data.dial,
      id_proyek : this.data.id,
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
