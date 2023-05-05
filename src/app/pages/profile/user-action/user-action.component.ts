import { HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { HomeService } from '../../home/home.service';
import { ProfileService } from '../profile.service';
import { environment } from "../../../../environments/environment"


@Component({
  selector: 'ngx-user-action',
  templateUrl: './user-action.component.html',
  styleUrls : ['./user-action.component.scss']
})
export class UserActionComponent implements OnInit, OnDestroy{
  constructor(  private profileService :ProfileService,
                private homeService : HomeService,
                public dialog : MatDialog,
                private dialogRef: MatDialogRef<UserActionComponent>,
                @Inject( MAT_DIALOG_DATA) public users : any
  ) {}
  onSuccess : EventEmitter<any> = new EventEmitter<any>()
  subscription : Subscription [] = []
  userData
  avatar_url : any = ""
  passwordFieldType: boolean = true;
  vessels : any
  userRole = ["Director", "Ship Manager", "Ship Yard", "Super Admin"]
  dataRole = ["director", "shipmanager", "shipyard", "admin"]
  roleSymbol = ["MD", "SM", "FM", "SA"]

  ngOnInit(){
    this.userData = this.users.data
    if(this.users.dial == "Update") {
      if(this.userData.avatar_url) this.avatar_url = environment.apiUrl + "/file/show/" + this.userData.avatar_url
      const _subs = this.homeService.getAllShip()
      .subscribe(({data} : any) => {
        this.vessels = data.map(ship => ({
          nama_kapal : ship.nama_kapal,
          id_kapal : ship.id_kapal
        }));
        this.subscription.push(_subs)
      });
      this.subscription.push(_subs)
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
        this.avatar_url = event.target.result
      }
    }
    this.onImageLoad()
  }
  
  private uploadAvatarUrl : any = ""
  onImageLoad(){
    const formData = new FormData();
    formData.append('dokumen', this.addUserForm.get('fileSource').value);
    const _subs = this.homeService.uploadFile(formData)
      .subscribe((res) => {
        if (res.type === HttpEventType.UploadProgress) {
          console.log("Upload Progress: " + Math.round(res.loaded / res.total ) * 100 + ' %')
        } else if ( res.type === HttpEventType.Response){
          console.log("final Response uploading image")
          this.uploadAvatarUrl = res.body
          this.uploadAvatarUrl = this.uploadAvatarUrl.data.file
        }
    })
    // this.subscription.push(_subs)
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
    const {nama_kapal = '', departemen_id = '', role, title = ''} = postBody
    const username = postBody.username + '_' + this.roleSymbol[postBody.role]
    const roles = this.dataRole[role]
    postBody = {...postBody, avatar_url : this.uploadAvatarUrl, nama_kapal, departemen_id, username, role : roles, title}
    const _subs = this.profileService.addUser(postBody)
      .subscribe(res => {
        this.onSuccess.emit()
        this.close()
      },
      err => {console.log('HTTP Error', err)},
      () => console.log('HTTP request completed.'),
    )
    // this.subscription.push(_subs)
  }

  updateUserData(postBody){
    postBody.avatar_url = this.uploadAvatarUrl ? 
    this.uploadAvatarUrl : this.userData.avatar_url
    this.dataRole.find((i, id)=> {
      if(i === this.dataRole[id]) {
        postBody['title'] = postBody.username + '_' + this.roleSymbol[id]
      }
    })
    postBody['departemen_id'] = ""
    const _subs =  this.profileService.updateUser(postBody, this.userData.id_user)
    .subscribe(() => {},
      err => {console.log('HTTP Error', err)},
      () => console.log('HTTP request completed.'))
    this.onSuccess.emit()
    // this.subscription.push(_subs) 
    this.close()
  }
  
  ngOnDestroy(): void {
    this.subscription.forEach(subs => subs.unsubscribe())
  }


  close(){ this.dialogRef.close();}
}
