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
    console.log(this.userData)
  }

  constructor(
    private service:ProfileBateraService,
    public dialog : MatDialog,
    private dialogRef: MatDialogRef<UpdateUserComponent>,
    @Inject(MAT_DIALOG_DATA) public userData: any
  ) {}

  updateUserForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
  });

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
        console.log(event)
      }
    }
  }

  private uploadLink 
  onImageLoad(){
    const formData = new FormData();
    formData.append('dokumen', this.updateUserForm.get('fileSource').value);
    this.service.loadImage(formData)
      .subscribe(({res} : any) => {
        if (res.type === HttpEventType.UploadProgress) {
          console.log("Upload Progress: " + Math.round(res.loaded / res.total ) * 100 + ' %')
        } else if ( res.type === HttpEventType.Response){
          console.log("final Response uploading image")
        }
        let link = res.body
        console.log(link)

    })
  }

  addElement (ElementList, element) {
    let newList = Object.assign(ElementList, element)
    return newList
  }

  updateUserProfile(data){
    this.uploadLink === 'undefined' ? 
    this.userData.avatar_url = this.uploadLink.data.file :
    this.uploadLink = " "
    this.addElement(data.value , {avatar_url : this.uploadLink})
    this.addElement(data.value , {id_user : this.userData.id_user })
    console.log(data.value)
    this.service.updateUser(data.value)
      .subscribe(res =>console.log(res),
      err => {console.log('HTTP Error', err)},
      () => console.log('HTTP request completed.')
    )
    this.avatarUrlConds = false
    this.close()
  }
  
  close(){ this.dialogRef.close();}
}

