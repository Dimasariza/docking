import { HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { emit } from 'process';
import { HomeService } from '../home-batera.service';

interface userData {
  id_user : any;
  nama_kapal : any
  foto : string
  nama_perusahaan : string
  merk_perusahaan : string
  alamat_perusahaan_1 : string
  alamat_perusahaan_2 : string
  telepon : number
  faximile : string
  npwp : string
  email : string
}

@Component({
  selector: 'ngx-add-ship',
  templateUrl: './add-ship.component.html',
  styleUrls : ['./add-ship.component.scss']
})
export class AddShipComponent implements OnInit {
  file : File = null;
  onSuccess : EventEmitter<any> = new EventEmitter<any>()
  
  public formIsValid : boolean = true
  public uploadSuccess = false
  constructor(
    private homeservice: HomeService,
    private dialogRef: MatDialogRef<AddShipComponent>
    ){ 
  }

  public companyId : any
  ngOnInit(): void {
    this.homeservice.getIdPerusahaan()
      .subscribe(res => {
        this.companyId = res
        this.companyId = this.companyId.data[0].id_perusahaan
        console.log(this.companyId)
    })
  }

  addShipForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
  });
      
  get f(){
    let validators = this.addShipForm.controls
    if ( validators.name.status === "VALID" &&  validators.file.status === "VALID") {
      this.formIsValid = false
    } else {
      this.formIsValid = true
    }
    return this.addShipForm.controls;
  }
     
  public urlLink : any
  onFileChange(res) {
    const file = res.target.files[0];
    if (res.target.files.length > 0) {
      this.addShipForm.patchValue({
        fileSource: file
      });
      var reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event ) => {
        this.urlLink = event.target.result
      }
    }
  }

  private imageShipUrl
  onImageLoad(event){
    const formData = new FormData();
    formData.append('dokumen', this.addShipForm.get('fileSource').value);
    this.homeservice.uploadShipimg(formData)
      .subscribe(res => {
      console.log(res);
      if (res.type === HttpEventType.UploadProgress) {
        console.log("Upload Progress: " + Math.round(res.loaded / res.total ) * 100 + ' %')
      } else if ( res.type === HttpEventType.Response){
        console.log("final Response uploading image")
        this.imageShipUrl = res
        this.imageShipUrl = this.imageShipUrl.body.data.file
      }
    })
  }

  submit(data){
    const postBody = {
      "id_user": 4,
      "id_perusahaan": this.companyId,
      "nama_kapal": data.value.name,
      "foto": this.imageShipUrl,
    }
    this.homeservice.addShipData(postBody)
    .subscribe(res => {
      this.uploadSuccess = !this.uploadSuccess
      this.onSuccess.emit()
      this.close()
    })
  }

  close(){this.dialogRef.close(); }
}
