import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
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
    private projectService : ProjectBateraService,
    private profileService : ProfileBateraService
  ) { }

  ngOnInit(): void {
    this.projectService.getDataProjects()
    .subscribe(({data} : any) => {
      let projectData = 
      data.map(project => {
        return {
          name : project.kapal.nama_kapal + ' DD ' + project.tahun,
          id : project.id_proyek
        }
      })
      this.addProjectBody.project = projectData
    })

    this.profileService.getUserData(10, '', '', '')
    .subscribe(({data} : any) => {
      console.log(data)
      let user =
      data.map(user => ({
          name : user.username,
          id: user.id_user
        }
      ))
      this.addProjectBody.responsible = user
    })
  }

  close(){this.dialogRef.close();}

  addProjectBody = {
    project : [],
    yardName : '',
    yardLocation : '',
    responsible : [],
    contractNumber : '',
    comment : ''
  }

  triggerSelectFile(fileInput: HTMLInputElement) {
    fileInput.click()
  }

  onSubmit(data){
    console.log(data)
    // this.close()
    console.log("Submitted")
  }
}
