import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HomeBateraService } from '../../home-batera/home-batera.service';
import { ProfileBateraService } from '../../profile-batera/profil-batera.service';
import { ProjectBateraService } from '../../project-batera/project-batera.service';
import { TenderBateraService } from '../tender-batera.service';

@Component({
  selector: 'ngx-add-yard',
  templateUrl: './add-yard.component.html',
})
export class AddYardComponent  {
  constructor(
    private dialogRef: MatDialogRef<AddYardComponent>,
    private tenderService : TenderBateraService,
    private profileService : ProfileBateraService,
    @Inject( MAT_DIALOG_DATA ) public data
  ) { }

  ngOnInit(): void {
    this.profileService.getUserData(1, 10, '', "shipyard", '')
    .subscribe(({data} : any) => {
      let user =
      data.map(user => ({
          name : user.username,
          id: user.id_user
        }))
      this.addProjectBody.responsible = user
    })
  }

  close(){this.dialogRef.close();}

  addProjectBody = {
    project : [],
    responsible : [],
  }

  triggerSelectFile(fileInput: HTMLInputElement) {
    fileInput.click()
  }

  onSubmit(data){
    let body = data.value
    body['id_proyek'] = this.data
    Object.keys(body).filter((k)=> {
      if (body[k] === "" || body[k]===undefined || body[k]===null) {
        return k;
      }
    }).map(item => {
      body[item] = ""
    })
    this.tenderService.addDataTender(body)
    .subscribe(res => {
      console.log(res)
    })
    this.close()
  }
}
