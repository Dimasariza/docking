import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'ngx-change-logo',
  templateUrl: './change-logo.component.html',
  styles: [
  ]
})
export class ChangeLogoComponent implements OnInit {
  enabledImgButton : boolean = true
  constructor(
    private dialogRef: MatDialogRef<ChangeLogoComponent>
  ) { }

  ngOnInit(): void {
  }

  getFile(val){}
  close(){
    this.dialogRef.close(); 
  }
  testData(val){
    console.log(val)
    console.log(
      val.form.valid
    )
  }
  getImage(value){
    if(value.returnValue){
      this.enabledImgButton = !this.enabledImgButton
    } else {
      this.enabledImgButton = true
    }
  }
}
