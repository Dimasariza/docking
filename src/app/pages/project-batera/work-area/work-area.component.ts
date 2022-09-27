import { Component, Inject, OnInit } from '@angular/core';  
import { HttpEventType } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectBateraService } from '../project-batera.service';

@Component({
  selector: 'ngx-work-area',
  templateUrl: './work-area.component.html',
  styleUrls: ['./work-area.component.scss']
})
export class WorkAreaComponent implements OnInit {

  ngOnInit(): void {
    // console.log(this.userData)
  }
  constructor(
    private service:ProjectBateraService,
    public dialog : MatDialog,
    private dialogRef: MatDialogRef<WorkAreaComponent>,
    // @Inject(MAT_DIALOG_DATA) public userData: any
  ) {}

  updateUserForm = new FormGroup({
    userName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    // file: new FormControl('', [Validators.required]),
    // fileSource: new FormControl('', [Validators.required])
  });

  public avatarUrlConds : boolean = false
  public avatarUrl : any
  private uploadLink : any

  onImageLoad(){
    const formData = new FormData();
    formData.append('dokumen', this.updateUserForm.get('fileSource').value);
    // this.service.loadImage(formData)
    //   .subscribe(res => {
    //     if (res.type === HttpEventType.UploadProgress) {
    //       console.log("Upload Progress: " + Math.round(res.loaded / res.total ) * 100 + ' %')
    //     } else if ( res.type === HttpEventType.Response){
    //       console.log("final Response uploading image")
    //       console.log(res)
    //     }
    //     this.uploadLink = res
    //     this.uploadLink = this.uploadLink.body
    // })
  }

  public updateUserData : any
  onSubmit(data){
    this.updateUserData = {
      username: data.userName,
      // nama_lengkap : data.fullName,
      // nama_kapal : data.shipName,
      // title : data.title,
      // departemen : data.department,
      // user_id : this.userData.user_id,
      // jabatan : data.position,
      // no_hp : data.mobileNo,
      // email : data.email,
      // password : data.password,
      // status : data.status,
      // avatar_url : this.uploadLink.data.file
    }
    console.log(this.updateUserData)
    // this.service.updateUser()
    //   .subscribe(res => {console.log(res)},
    //   err => {console.log('HTTP Error', err)},
    //   () => console.log('HTTP request completed.')
    // )
    // this.userData.avatar_url = this.uploadLink.data.file
    // this.avatarUrlConds = false
  }
  
  close(){ this.dialogRef.close();}
  
  // public userData : any = {
  //   name : "roganda"
  // }
  

}
