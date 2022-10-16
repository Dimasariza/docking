import { Component, EventEmitter, Inject } from '@angular/core';
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
  onSuccess : EventEmitter<any> = new EventEmitter<any>()

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
    console.log(body)
    // this.tenderService.addDataTender({...body})
    // .subscribe(res => {
    //   this.onSuccess.emit()
    //   this.close()
    // })
  };

  close(){this.dialogRef.close()};

}
