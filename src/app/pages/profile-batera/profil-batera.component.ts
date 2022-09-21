import { Component, OnInit, ViewChild } from '@angular/core';
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
  posts:any;
  data : any;
  changeButtonStatus : string = 'primary'
  changeText : string  = 'CHANGE PROFILE'
  companyProfile : boolean = true

  profileData = {
    companyName : 'Company Name',
    companyAddress1 : 'Company Address',
    mobileNo : '',
    npwp : '',
    companyBrand : '',
    companyAddress2 : 'Company Address',
    fax : '',
    email : ''
  }

  activeStatus = ['Active', 'Deactive']
  formCondition = true
  submitted = false;

  onSubmit(data) { this.submitted = true; 
  console.log(data)
  }

  constructor(
    private service:ProfileBateraService,
    public dialog : MatDialog,
  ) {}

  ngOnInit(){
    this.service.getPosts()
      .subscribe(response => {
        this.data = response;
        this.data = this.data.data
        console.log(this.data)
    }); 
  }
  
  changename(name){
    this.profileData.companyName = name
  }
  
  changeProfile(){
    this.formCondition = !this.formCondition
    if (this.formCondition) {
      this.changeButtonStatus = 'primary'
      this.changeText = 'CHANGE PROFILE'
    } else {
      this.changeButtonStatus = 'danger'
      this.changeText = 'CLOSE'
    }
  }

  changeLogo(){
    const dialogConfig = new MatDialogConfig();
    const dialogRef = this.dialog.open(ChangeLogoComponent)
    console.log("open dialog")

    // dialogConfig.disableClose = true;
    // dialogConfig.autoFocus = true;

    // dialogRef.afterClosed().subscribe(res=>{
    //     console.log(res);
    //   }
    // );
  }

  
  addNewUser(){
    const dialogConfig = new MatDialogConfig();
    const dialogRef = this.dialog.open(AddUserComponent)
    console.log("open dialog")

    // dialogConfig.disableClose = true;
    // dialogConfig.autoFocus = true;

    // dialogRef.afterClosed().subscribe(res=>{
    //     console.log(res);
    //   }
    // );
  }

  addUser(){
    this.service.addUser()
      .subscribe(res => {console.log(res)},
      err => {console.log('HTTP Error', err)},
      () => console.log('HTTP request completed.')
      )
  }

  deleteUser(){
    this.service.deleteUser()
      .subscribe(res => {console.log(res)},
      error => {console.log('HTTP Error', error)},
      () => console.log('HTTP request completed.')
      )
  }

  updateUser(){
    this.service.updateUser()
    .subscribe(res => {console.log(res)},
    error => {console.log('HTTP Error', error)},
    () => console.log('HTTP request completed.')
    )
  }

  getId(data){
    sessionStorage.setItem('id', data.id);
    let userId = sessionStorage.getItem('id');
    console.log(userId)
  }
}
