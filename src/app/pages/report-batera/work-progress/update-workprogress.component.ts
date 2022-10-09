import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'ngx-update-workprogress',
  templateUrl: './update-workprogress.component.html',
  styles: [
  ]
})
export class UpdateWorkprogressComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<UpdateWorkprogressComponent>,
  ) { }

  ngOnInit(): void {
  }

  updateWorkProgress(){
  }

  close(){ this.dialogRef.close();}


}
