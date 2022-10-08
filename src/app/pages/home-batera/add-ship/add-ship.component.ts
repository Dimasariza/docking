import { HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { HomeBateraService } from '../home-batera.service';

@Component({
  selector: 'ngx-add-ship',
  templateUrl: './add-ship.component.html',
  styleUrls : ['./add-ship.component.scss']
})
export class AddShipComponent implements OnInit {
  onSuccess : EventEmitter<any> = new EventEmitter<any>()
  constructor(
    private homeservice: HomeBateraService,
    private dialogRef: MatDialogRef<AddShipComponent>
    ){ 
  }

  ngOnInit(): void {
    this.homeservice.getUserLogin()
    .subscribe(({data} : any) => {
    })
  }

  addShipForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
  });
      
  public formIsValid : boolean = true
  get f(){
    let validators = this.addShipForm.controls
    if ( validators.name.status === "VALID" &&  validators.file.status === "VALID") {
      this.formIsValid = false
    } else {
      this.formIsValid = true
    }
    return this.addShipForm.controls;
  }
     
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
        this.uploadImageUrl = res
        this.uploadImageUrl = this.uploadImageUrl.body.data.file
      }
    })
  }

  public uploadSuccess = false
  submit(data){
    const postBody = {
      nama_kapal: data.value.name,
      foto: this.uploadImageUrl,
    }

    this.homeservice.addShipData(postBody)
    .subscribe(() => {
      this.uploadSuccess = !this.uploadSuccess
      this.onSuccess.emit()
      this.close()
    })
  }

  close(){this.dialogRef.close(); }
}
