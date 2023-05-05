import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HomeService } from '../home/home.service';
import { ProfileService } from './profile.service';
import { UserActionComponent } from './user-action/user-action.component';

@Component({
  selector: 'ngx-profile-component',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfilComponent implements OnInit {
  constructor(
    private pofileService : ProfileService,
    private dialog : MatDialog,
    private homeService : HomeService
  ) {}

  userData : any;
  unSortUserData : any;
  companyData : any;
  changeText : string  = 'CHANGE PROFILE'
  formCondition = true

  ngOnInit(){
    this.pofileService.getUserData(1, 10)
      .subscribe(({data} : any) => {
        this.unSortUserData = data;
        this.userData = data;
    }); 

    this.pofileService.getCompanyProfile()
    .subscribe(({data} : any) => {
      this.companyData = data 
    })
  }

  changeProfile(){
    this.formCondition = !this.formCondition
    this.changeText = this.formCondition ? 'CHANGE PROFILE' : 'CLOSE'
  }

  updateCompanyProfile(formValue){
    this.changeProfile()
    this.pofileService.updateCompanyProfile(formValue.value)
    .subscribe(() => {
    })
  }

  sortUserActivated(user) {
    console.log(this.unSortUserData)
    if(user == 'All') 
      this.userData = this.unSortUserData
    else if (user == 'Active') 
      this.userData = this.unSortUserData.filter(user => user.status === 'active')
    else if (user == 'Suspend') 
      this.userData = this.unSortUserData.filter(user => user.status === 'suspend')
  }

  triggerSelectFile(fileInput: HTMLInputElement) {
    fileInput.click()
  }

  onFileChange(res){
    const formData = new FormData();
    const file = res.target?.files[0];
    formData.append('dokumen', file);
    const _subs = this.homeService.uploadFile(formData)
    .subscribe((res) => {
      if (res.type === HttpEventType.UploadProgress) {
        console.log("Upload Progress: " + Math.round(res.loaded / res.total ) * 100 + ' %')
      } else if ( res.type === HttpEventType.Response){
        console.log("final Response uploading image")
      }
    })
    // this.subscription.push(_subs)
  }

  addNewUserDial(){
    const dialogRef = this.dialog.open(UserActionComponent, {
      disableClose : true, autoFocus:true, 
      data : {
        dial : "Add"
      }
    })
    dialogRef.componentInstance.onSuccess.asObservable()
    .subscribe(()=> {
      this.ngOnInit()
    });
  }

  updateUserDial(row){
    const dialogRef = this.dialog.open(UserActionComponent, {
      data : {
        dial : "Update",
        data : row
      }
    })

    dialogRef.componentInstance.onSuccess.asObservable()
    .subscribe(()=> {
      this.ngOnInit()
    });
  }
}

