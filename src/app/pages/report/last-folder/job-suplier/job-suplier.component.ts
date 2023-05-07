import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReportService } from '../../report.service';

@Component({
  selector: 'ngx-job-suplier',
  templateUrl: './job-suplier.component.html',
  styles: [
  ]
})
export class JobSuplierComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<JobSuplierComponent>,
              private reportService : ReportService,
              @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
  onSuccess : EventEmitter<any> = new EventEmitter<any>()
  modelData : any
  ngOnInit(): void {
  }

  onSubmit(data){
    switch(data.dial) {
      case 'Add' :
        this.reportService.addSuplier(data.value)
        .subscribe(() => {
          this.onSuccess.emit()
          this.close()
        })
      break;
      case 'Update' :
      this.reportService.updateSuplier(data.value)
      .subscribe(() => {
        this.onSuccess.emit()
        this.close()
      })
      break;
    }
  }

  close(){this.dialogRef.close();}

}
