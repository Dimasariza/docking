import { HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProfileBateraService } from '../../profile-batera/profil-batera.service';
import { ProjectBateraService } from '../../project-batera/project-batera.service';
import { ProjectDataComponent } from '../../project-batera/project-data/project-data.component';
import { ReportBateraService } from '../../report-batera/report-batera.service';
import { TenderBateraService } from '../tender-batera.service';

@Component({
  providers : [ProjectDataComponent],
  selector: 'ngx-contract-action',
  templateUrl: './contract-action.component.html',
})
export class ContractActionComponent  {
  constructor(private dialogRef: MatDialogRef<ContractActionComponent>,
              private tenderService : TenderBateraService,
              private profileService : ProfileBateraService,
              private projectComp : ProjectDataComponent,
              private reportService : ReportBateraService,
              @Inject( MAT_DIALOG_DATA ) public data
  ) { }
  onSuccess : EventEmitter<any> = new EventEmitter<any>()

  modelData
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
    this.modelData = this.data.data
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
    switch (this.data.dial) {
      case 'Add' :
        this.addNewContract(body)
        break;
      case 'Update' :
        this.updateContract(data)
        break;
    }
  };

  public idAttachment : any = ""
  onFileChange(res){
    const formData = new FormData();
    const file = res.target?.files[0];
    file?.name ? this.idAttachment = file.name : null;
    formData.append('dokumen', file);
    const _subs = this.reportService.addAttachment(formData)
    .subscribe((res) => {
      if (res.type === HttpEventType.UploadProgress) {
        console.log("Upload Progress: " + Math.round(res.loaded / res.total ) * 100 + ' %')
      } else if ( res.type === HttpEventType.Response){
        console.log("final Response uploading image")
        this.idAttachment = res
        this.idAttachment = this.idAttachment.body.data.nama_attachment
      }
    })
  }

  addNewContract(body){
    console.log(body)
    this.tenderService.addTenderContract({
      ...body,
      dokumen : this.idAttachment
    })
    .subscribe(res => {
      this.onSuccess.emit()
      this.close()
    })
  }

  updateContract(body){
    const {id_tender} = this.modelData
    this.tenderService.updateTenderContract(body.value, id_tender)
    .subscribe(res => console.log(res))
  }

  close(){this.dialogRef.close()};

}
