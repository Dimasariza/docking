import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { HomeBateraService } from '../home-batera.service';

@Component({
  selector: 'ngx-update-ship',
  templateUrl: './update-ship.component.html',
  styleUrls: ['./update-ship.component.scss']
})
export class UpdateShipComponent implements OnInit {
  ngOnInit(): void {}
  
  file : File = null;
  public formIsValid : boolean = true
  public uploadSuccess = false
  constructor(
     private homeservice: HomeBateraService,
     private dialogRef: MatDialogRef<UpdateShipComponent>
     ) { }

  getFile(event){
    this.file = <File>event.target.files[0]
    console.log(this.file)
  }

  close(){
    this.dialogRef.close(); 
  }

  onUpload(){
    const dataFile : FormData = new FormData()
    dataFile.append('image', this.file, this.file.name )
    this.homeservice.uploadFile(dataFile).subscribe((res) => {
      console.log(res)
      if (res.type === HttpEventType.UploadProgress) {
        console.log("Upload Progress: " + Math.round(res.loaded / res.total ) * 100 + ' %')
      } else if ( res.type === HttpEventType.Response){
        console.log(res)
      }
    })
  }

  submit(){
    const formData = new FormData();
    formData.append('dokumen', this.addShipForm.get('fileSource').value);
    this.homeservice.uploadFile(formData)
      .subscribe(res => {
        console.log(res);
        if (res.type === HttpEventType.UploadProgress) {
          console.log("Upload Progress: " + Math.round(res.loaded / res.total ) * 100 + ' %')
        } else if ( res.type === HttpEventType.Response){
          console.log("final Response uploading image")
          this.uploadSuccess = !this.uploadSuccess
          setTimeout(()=>{
            this.dialogRef.close(); 
          },2000);
        }
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

  save(){
    const postBody = {
      "id_user":"4",
      "nama_kapal":"MT Slahung 1",
      "foto":"1__20092022__6329e7566267f_WCPDzOL7F0bVvGoeaI0L_ship.jpg",
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
    this.homeservice.uploadFile(postBody).subscribe( (res) => {
      console.log(res)
    })
  }
}
