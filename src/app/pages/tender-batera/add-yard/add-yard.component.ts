import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TenderBateraService } from '../tender-batera.service';

@Component({
  selector: 'ngx-add-yard',
  templateUrl: './add-yard.component.html',
})
export class AddYardComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<AddYardComponent>,
    private tenderBateraService : TenderBateraService
  ) { }

  ngOnInit(): void {
    this.tenderBateraService.getDataProject()
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

    this.tenderBateraService.getDataUser()
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
  onSubmit(){
    this.close()
  }
}
