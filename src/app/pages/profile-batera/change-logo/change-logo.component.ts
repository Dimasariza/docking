import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'ngx-change-logo',
  templateUrl: './change-logo.component.html',
  styleUrls: ['./change-logo.component.scss']
})
export class ChangeLogoComponent {
  enabledImgButton : boolean = true
  constructor(
    private dialogRef: MatDialogRef<ChangeLogoComponent>
  ) { }

  getFile(val){}
  close(){this.dialogRef.close();}
  
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
