import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddUserComponent } from './add-user/add-user.component';
import { ChangeLogoComponent } from './change-logo/change-logo.component';
import { ProfileBateraService } from './profil-batera.service';
import { UpdateUserComponent } from './update-user/update-user.component';


@Component({
  selector: 'ngx-profil-batera',
  templateUrl: './profil-batera.component.html',
  styleUrls: ['./profil-batera.component.scss']
})
export class ProfilBateraComponent implements OnInit {
  constructor(
    private service:ProfileBateraService,
    public dialog : MatDialog,
  ) {}

  userData : any;
  ngOnInit(){
    this.service.getUserData()
      .subscribe(response => {
        this.userData = response;
        this.userData = this.userData.data
    }); 

    this.service.getCompanyProfile()
    .subscribe(res => {
      this.companyProfile = res
      this.companyProfile = this.companyProfile.data[0]
      this.companyData.companyName = this.companyProfile.nama_perusahaan
      this.companyData.companyAddress1 = this.companyProfile.alamat_perusahaan_1
      this.companyData.companyAddress2 = this.companyProfile.alamat_perusahaan_2
      this.companyData.email = this.companyProfile.email
      this.companyData.fax = this.companyProfile.fax
      this.companyData.companyBrand = this.companyProfile.merk_perusahaan
      this.companyData.npwp = this.companyProfile.npwp
      this.companyData.mobileNo = this.companyProfile.telepon
    })
  }

  public companyProfile : any
  companyData = {
    companyName : 'Company Name',
    companyAddress1 : 'Company Address',
    mobileNo : 'Company Mobile Number',
    npwp : 'Company NPWP',
    companyBrand : 'Company Brand',
    companyAddress2 : 'Company Address',
    fax : 'Company FAX',
    email : 'Company Email'
  }

  changeText : string  = 'CHANGE PROFILE'
  formCondition = true
  changeProfile(){
    this.formCondition = !this.formCondition
    this.changeText = this.formCondition ? 'CHANGE PROFILE' : 'CLOSE'
  }

  updateCompanyProfile(formValue){
    this.changeProfile()
    this.service.updateCompanyProfile(this.companyData)
    .subscribe(res => {
      console.log(res)
    })
  }

  changeLogoDial(){
    const dialogConfig = new MatDialogConfig();
    const dialogRef = this.dialog.open(ChangeLogoComponent)
  }

  addNewUserDial(){
    const dialogConfig = new MatDialogConfig();
    const dialogRef = this.dialog.open(AddUserComponent, {
      disableClose : true, autoFocus:true, 
    })
  }

  updateUserDial(row){
    const dialogConfig = new MatDialogConfig();
    const dialogRef = this.dialog.open(UpdateUserComponent, {
      // disableClose : true, 
      // autoFocus:true, 
      data : this.userData[row]
    })
  }

}
