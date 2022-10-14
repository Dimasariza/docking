import { Component, EventEmitter, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ReportBateraService } from '../report-batera.service';

@Component({
  selector: 'ngx-job-suplier',
  templateUrl: './job-suplier.component.html',
  styles: [
  ]
})
export class JobSuplierComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<JobSuplierComponent>,
              private reportService : ReportBateraService
  ) { }
  onSuccess : EventEmitter<any> = new EventEmitter<any>()

  ngOnInit(): void {
  }

  onSubmit(data){
    console.log(data)
    this.reportService.addSuplier(data.value)
    .subscribe(res => console.log(res))
    this.onSuccess.emit()
    this.close()
  }

  close(){this.dialogRef.close();}

}
