import { HttpEventType } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HomeBateraService } from '../../home-batera/home-batera.service';
import { ProfileBateraService } from '../profil-batera.service';

@Component({
  selector: 'ngx-add-user',
  templateUrl: './add-user.component.html',
  styleUrls : ['./add-user.component.scss']
})
export class AddUserComponent {
  constructor(
    private profileService:ProfileBateraService,
    private homeService : HomeBateraService,
    public dialog : MatDialog,
    public route : Router,
    private dialogRef: MatDialogRef<AddUserComponent>
  ) {}

  public userData = {
    username : 'User Name',
    nama_lengkap : 'Full Name',
    nama_kapal : 'Ship Name',
    title : 'Title',
    departemen : 'Department',
    user_id : 'User Id',
    jabatan : 'Position',
    no_hp : 'Mobile Number',
    email : 'Email',
    password : 'Password',
    role : 'Role',
    avatar_url: {
      url : '',
      exist : false
    },
  }

  passwordFieldType: boolean = true;
  addUserForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
  });

  public urlLink
  public userRole = ["Super Intendent", "Director", "Fleet Manager", "Yard Manager", "Ship Yard", "Super Admin"]
  public dataRole = ["superintendent", "director", "shipmanager", "yardmanager", "shipyard", "admin"]
  onFileChange(res){
    this.userData.avatar_url.exist = res.isTrusted
    const file = res.target.files[0];
    if (res.target.files.length > 0) {
      this.addUserForm.patchValue({
        fileSource: file
      });
      var reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event ) => {
        this.urlLink = event.target.result
        this.userData.avatar_url.url = this.urlLink
      }
    }
  }

  private avatarUrl
  onImageLoad(event){
    this.userData.avatar_url.exist = event.isTrusted
    const formData = new FormData();
    formData.append('dokumen', this.addUserForm.get('fileSource').value);
    this.homeService.uploadFile(formData)
      .subscribe((res) => {
        if (res.type === HttpEventType.UploadProgress) {
          console.log("Upload Progress: " + Math.round(res.loaded / res.total ) * 100 + ' %')
        } else if ( res.type === HttpEventType.Response){
          console.log("final Response uploading image")
        }
        this.avatarUrl = res
        this.avatarUrl = this.avatarUrl.body
    })
  }

  passwordField(){
    this.passwordFieldType = !this.passwordFieldType
  }

  onSubmit(data){
    console.log(data)
    let postBody = data.value
    postBody.avatar_url = ""

    postBody['departemen_id'] = "SM"
    this.profileService.addUser(postBody)
      .subscribe(res => {console.log(res)},
      err => {console.log('HTTP Error', err)},
      () => console.log('HTTP request completed.')
    )

    if(this.avatarUrl !== undefined) {
      console.log('avatar not available')
      console.log(this.avatarUrl.data.file)
    }
  }
  
  close(){ this.dialogRef.close();}
}
