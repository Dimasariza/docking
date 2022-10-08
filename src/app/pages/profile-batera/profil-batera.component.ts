import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddUserComponent } from './add-user/add-user.component';
import { ChangeLogoComponent } from './change-logo/change-logo.component';
import { ProfileBateraService } from './profil-batera.service';
import { UpdateUserComponent } from './update-user/update-user.component';

interface companyData {
  profile_nama_perusahaan : string
  profile_alamat_perusahaan_1 : string
  profile_telepon : string
  profile_npwp : string
  profile_merk_perusahaan : string
  profile_alamat_perusahaan_2 : string
  profile_fax : string
  profile_email : any
}

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

  public userData : any;
  public companyProfile : any
  changeText : string  = 'CHANGE PROFILE'
  formCondition = true

  ngOnInit(){
    this.pofileService.getUserData(10, '', '', '')
      .subscribe(({data} : any) => {
        this.userData = data
    }); 

    this.pofileService.getCompanyProfile()
    .subscribe(({data} : any) => {
      data.length === 0 ? '' : this.companyData = data
    })
  }

  companyData : companyData = {
    profile_nama_perusahaan : 'Company Name',
    profile_alamat_perusahaan_1 : 'Company Address',
    profile_telepon : 'Company Mobile Number',
    profile_npwp : 'Company NPWP',
    profile_merk_perusahaan : 'Company Brand',
    profile_alamat_perusahaan_2 : 'Company Address',
    profile_fax : 'Company FAX',
    profile_email : 'Company Email'
  }

  changeProfile(){
    this.formCondition = !this.formCondition
    this.changeText = this.formCondition ? 'CHANGE PROFILE' : 'CLOSE'
  }

  updateCompanyProfile(formValue){
    this.changeProfile()
    this.pofileService.updateCompanyProfile(this.companyData)
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
      data : this.userData[row]
    })
  }
}

