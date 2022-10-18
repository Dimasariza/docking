import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddUserComponent } from './add-user/add-user.component';
import { ChangeLogoComponent } from './change-logo/change-logo.component';
import { ProfileBateraService } from './profil-batera.service';

@Component({
  selector: 'ngx-profil-batera',
  templateUrl: './profil-batera.component.html',
  styleUrls: ['./profil-batera.component.scss']
})
export class ProfilBateraComponent implements OnInit {
  constructor(
    private pofileService : ProfileBateraService,
    public dialog : MatDialog,
  ) {}

  userData : any;
  companyData : any
  changeText : string  = 'CHANGE PROFILE'
  formCondition = true

  ngOnInit(){
    this.pofileService.getUserData(1, 10, '', '', '')
      .subscribe(({data} : any) => {
        this.userData = data
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
    .subscribe(res => {
      console.log(res)
    })
  }

  changeLogoDial(){
    const dialogRef = this.dialog.open(ChangeLogoComponent)
    dialogRef.componentInstance.onSuccess.asObservable().subscribe(()=> {
      this.ngOnInit()
    });
  }

  addNewUserDial(){
    const dialogRef = this.dialog.open(AddUserComponent, {
      disableClose : true, autoFocus:true, 
      data : {
        dial : "Add"
      }
    })
    dialogRef.componentInstance.onSuccess.asObservable().subscribe(()=> {
      this.ngOnInit()
    });
  }

  updateUserDial(row){
    const dialogRef = this.dialog.open(AddUserComponent, {
      data : {
        dial : "Update",
        data : row
      }
    })

    dialogRef.componentInstance.onSuccess.asObservable().subscribe(()=> {
      this.ngOnInit()
    });
  }
}

