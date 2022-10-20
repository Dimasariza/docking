import { HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HomeBateraService } from '../home-batera.service';

@Component({
  selector: 'ngx-ship-action',
  templateUrl: './ship-action.component.html',
  styleUrls : ['./ship-action.component.scss']
})
export class ShipActionComponent implements OnInit {
  onSuccess : EventEmitter<any> = new EventEmitter<any>()
  constructor(
    private homeservice: HomeBateraService,
    private dialogRef: MatDialogRef<ShipActionComponent>,
    @Inject(MAT_DIALOG_DATA) public shipData: any
    ){ 
  }

  ngOnInit(): void {
  }

  addShipForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
  });
      
  public formIsValid : boolean = true
     
  public viewImageLink : any
  onFileChange(res) {
    const file = res.target.files[0];
    if (res.target.files.length > 0) {
      this.addShipForm.patchValue({
        fileSource: file
      });
      var reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        this.viewImageLink = event.target.result
      }
    }
  }

  private uploadImageUrl
  onImageLoad(event){
    const formData = new FormData();
    formData.append('dokumen', this.addShipForm.get('fileSource').value);
    this.homeservice.uploadFile(formData)
      .subscribe((res) => {
      if (res.type === HttpEventType.UploadProgress) {
        console.log("Upload Progress: " + Math.round(res.loaded / res.total ) * 100 + ' %')
      } else if ( res.type === HttpEventType.Response){
        console.log("final Response uploading image")
        this.formIsValid = false
        this.uploadImageUrl = res
        this.uploadImageUrl = this.uploadImageUrl.body.data.file
      }
    })
  }

  public uploadSuccess = false
  submit(data, dial){
    let postBody = {
      nama_kapal: data.value.name,
      foto: this.uploadImageUrl,
    }
    if(dial == "Add"){
      this.homeservice.addShipData(postBody)
      .subscribe(() => {
        this.uploadSuccess = !this.uploadSuccess
        this.onSuccess.emit()
        this.close()
      })
    } else if (dial == "Update") {
      this.homeservice.updateShip(this.shipData.id, postBody)
      .subscribe( (res) => {
        this.onSuccess.emit()
        this.close()
      })
    }
  }

  close(){this.dialogRef.close()}
}
