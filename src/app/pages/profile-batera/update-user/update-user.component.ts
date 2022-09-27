import { Component, Inject, OnInit } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProfileBateraService } from '../profil-batera.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({      
  selector: 'ngx-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss']
})
export class UpdateUserComponent implements OnInit {
  ngOnInit(): void {
    this.userData.username = this.passUserData.username
    this.userData.nama_lengkap = this.passUserData.nama_lengkap
    this.userData.nama_kapal = this.passUserData.nama_kapal
    this.userData.title = this.passUserData.title
    this.userData.departemen = this.passUserData.departemen
    this.userData.user_id = this.passUserData.user_id
    this.userData.jabatan = this.passUserData.jabatan
    this.userData.no_hp = this.passUserData.no_hp
    this.userData.email = this.passUserData.email
    this.userData.password = this.passUserData.password
    this.userData.status = this.passUserData.status
    this.userData.avatar_url = this.passUserData.avatar_url
  }

  public userData = {
    username: 'user name',
    nama_lengkap : 'full name',
    nama_kapal : 'ship name',
    title : 'title',
    departemen : 'departement',
    user_id : 'user id',
    jabatan : 'position',
    no_hp : 'mobile number',
    email : 'email',
    password : 'password',
    status : 'status',
    avatar_url : 'avatar url'
  }

  constructor(
    private service:ProfileBateraService,
    public dialog : MatDialog,
    private dialogRef: MatDialogRef<UpdateUserComponent>,
    @Inject(MAT_DIALOG_DATA) public passUserData: any
  ) {}

  updateUserForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
  });

  public formCondition : boolean = false
  public avatarUrlConds : boolean = false
  public avatarUrl : any
  onFileChange(res){
    this.avatarUrlConds = res.isTrusted
    const file = res.target.files[0];
    if (res.target.files.length > 0) {
      this.updateUserForm.patchValue({
        fileSource: file
      });
      var reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event ) => {
        this.avatarUrl = event.target.result
      }
    }
  }

  private uploadLink : any
  onImageLoad(){
    const formData = new FormData();
    formData.append('dokumen', this.updateUserForm.get('fileSource').value);
    this.service.loadImage(formData)
      .subscribe(res => {
        if (res.type === HttpEventType.UploadProgress) {
          console.log("Upload Progress: " + Math.round(res.loaded / res.total ) * 100 + ' %')
        } else if ( res.type === HttpEventType.Response){
          console.log("final Response uploading image")
          console.log(res)
        }
        this.uploadLink = res
        this.uploadLink = this.uploadLink.body
    })
  }

  updateUserProfile(data){
    if(this.uploadLink !== undefined) {
      this.userData.avatar_url = this.uploadLink.data.file
    }
    this.service.updateUser(this.userData)
      .subscribe(res => {console.log(res)}

      // err => {console.log('HTTP Error', err)},
      // () => console.log('HTTP request completed.')
    )
    this.avatarUrlConds = false
    console.log(this.userData)
  }
  
  close(){ this.dialogRef.close();}
}

