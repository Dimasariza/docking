import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { HomeService } from '../home-batera.service';

@Component({
  selector: 'ngx-add-ship',
  templateUrl: './add-ship.component.html',
})
export class AddShipComponent {

  file : File = null;
  constructor(
     private homeservice: HomeService,
     private dialogRef: MatDialogRef<AddShipComponent>
     ) { }

  getFile(event){
    this.file = <File>event.target.files[0]
    console.log(this.file)
  }

  onUpload(){
    const dataFile : FormData = new FormData()
    dataFile.append('image', this.file, this.file.name )
    this.homeservice.addShip(dataFile).subscribe((res) => {
      console.log(res)
      if (res.type === HttpEventType.UploadProgress) {
        console.log("Upload Progress: " + Math.round(res.loaded / res.total ) * 100 + ' %')
      } else if ( res.type === HttpEventType.Response){
        console.log(res)
      }
    })
  }

  close(){
    this.dialogRef.close(); 
  }

  save(){
    const postBody = {
      "id_user":"4",
      "nama_kapal":"MT Slahung 1",
      "foto":"1__630d957c854ac_NoLznGBOsRFLdibJU7Rc_medical-5459661_640.png",
      "nama_perusahaan":"Batera",
      "merk_perusahaan":"PT",
      "alamat_perusahaan_1":"",
      "alamat_perusahaan_2":"",
      "telepon":"081234567",
      "faximile":"00979879",
      "npwp":"1",
      "email":"bs@gmail.com"
    }
    this.dialogRef.close(); 
    this.homeservice.addShip(postBody).subscribe( (res) => {
      console.log(res)
    })
  }

  addShipForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
  });
    
      
  get f(){
    return this.addShipForm.controls;
  }
     
  onFileChange(event) {
  
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.addShipForm.patchValue({
        fileSource: file
      });
    }
  }
     
  submit(){
    const formData = new FormData();
    formData.append('dokumen', this.addShipForm.get('fileSource').value);
   
    this.homeservice.addShip(formData)
      .subscribe(res => {
        console.log(res);
        alert('Uploaded Successfully.');
      })
  }
}
