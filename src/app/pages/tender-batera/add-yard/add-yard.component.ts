import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProfileBateraService } from '../../profile-batera/profil-batera.service';
import { ProjectBateraService } from '../../project-batera/project-batera.service';
import { ProjectDataComponent } from '../../project-batera/project-data/project-data.component';
import { TenderBateraService } from '../tender-batera.service';

@Component({
  providers : [ProjectDataComponent],
  selector: 'ngx-add-yard',
  templateUrl: './add-yard.component.html',
})
export class AddYardComponent  {
  constructor(
    private dialogRef: MatDialogRef<AddYardComponent>,
    private tenderService : TenderBateraService,
    private profileService : ProfileBateraService,
    private projectComp : ProjectDataComponent,
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


  addProjectBody = {
    project : [],
    responsible : [],
  }

  triggerSelectFile(fileInput: HTMLInputElement) {
    fileInput.click()
  }

  onSubmit(data){
    let body = this.projectComp.checkPostBody(data.value)
    this.tenderService.addDataTender({...body, id_proyek : this.data})
    .subscribe(res => {
      console.log(res)
    })
    this.close()
  };

  close(){this.dialogRef.close()};

}
