import { HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HomeBateraService } from '../../home-batera/home-batera.service';
import { ProfileBateraService } from '../profil-batera.service';

@Component({
  selector: 'ngx-add-user',
  templateUrl: './add-user.component.html',
  styleUrls : ['./add-user.component.scss']
})
export class AddUserComponent {
  constructor(  private profileService :ProfileBateraService,
                private homeService : HomeBateraService,
                public dialog : MatDialog,
                private dialogRef: MatDialogRef<AddUserComponent>,
                @Inject( MAT_DIALOG_DATA) public users : any
  ) {}
  onSuccess : EventEmitter<any> = new EventEmitter<any>()

  userData
  urlLink
  avatar_url = null
  passwordFieldType: boolean = true;
  vessels : any
  userRole = ["Director", "Ship Manager", "Ship Yard", "Super Admin"]
  dataRole = ["director", "shipmanager", "shipyard", "admin"]
  roleSymbol = ["MD", "SM", "FM", "SA"]

  ngOnInit(){
    this.userData = this.users.data
    if(this.users.dial == "Update") {
      this.homeService.getAllShip()
      .subscribe(({data} : any) => {
        this.vessels = data.map(ship => ({
          nama_kapal : ship.nama_kapal,
          id_kapal : ship.id_kapal
        }))
      });
    }
  }

  addUserForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
  });

  onFileChange(res){
    const file = res.target.files[0];
    if (res.target.files.length > 0) {
      this.addUserForm.patchValue({
        fileSource: file
      });
      var reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event ) => {
        this.urlLink = event.target.result
        this.avatar_url = this.urlLink
      }
    }
  }
  
  private uploadAvatarUrl : any = null
  onImageLoad(event){
    const formData = new FormData();
    formData.append('dokumen', this.addUserForm.get('fileSource').value);
    this.homeService.uploadFile(formData)
      .subscribe((res) => {
        if (res.type === HttpEventType.UploadProgress) {
          console.log("Upload Progress: " + Math.round(res.loaded / res.total ) * 100 + ' %')
        } else if ( res.type === HttpEventType.Response){
          console.log("final Response uploading image")
        }
        this.uploadAvatarUrl = res
        this.uploadAvatarUrl = this.uploadAvatarUrl.body
    })
  }

  passwordField(){
    this.passwordFieldType = !this.passwordFieldType
  }

  onSubmit(data){
    const postBody = data.value
    switch(this.users.dial){
      case 'Add' :
      this.addNewUserData(postBody)
      break;
      case 'Update' :
      this.updateUserData(postBody)
      break;
    }
  }

  addNewUserData(postBody){
    this.uploadAvatarUrl ? 
    postBody.avatar_url = this.uploadAvatarUrl.data.file : 
    postBody.avatar_url = ""
    postBody['nama_kapal'] = ""
    postBody['departemen_id'] = ""
    postBody['title'] = postBody.username + '_' + this.roleSymbol[postBody.role]
    postBody['role'] = this.dataRole[postBody.role]
    console.log(postBody)
    this.profileService.addUser(postBody)
      .subscribe(res => {console.log(res)},
      err => {console.log('HTTP Error', err)},
      () => console.log('HTTP request completed.'),
    )
    this.onSuccess.emit()
    this.close()
  }

  updateUserData(postBody){
    this.uploadAvatarUrl ? null : postBody.avatar_url = this.uploadAvatarUrl
    postBody.id_user = this.users.id_user
    this.profileService.updateUser(postBody)
    .subscribe(() => {},
      err => {console.log('HTTP Error', err)},
      () => console.log('HTTP request completed.'))
    this.onSuccess.emit()
    this.close()
  }
  
  close(){ this.dialogRef.close();}
}
