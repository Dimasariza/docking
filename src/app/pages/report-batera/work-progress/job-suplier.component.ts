import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'ngx-job-suplier',
  templateUrl: './job-suplier.component.html',
  styles: [
  ]
})
export class JobSuplierComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<JobSuplierComponent>,
  ) { }

  ngOnInit(): void {
  }

  onSubmit(data){
    console.log(data)
  }

  close(){this.dialogRef.close();}

}
