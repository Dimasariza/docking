import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FunctionCollection } from '../../function-collection-batera/function-collection.component';
import { ProjectBateraService } from '../../project-batera/project-batera.service';
import { TenderBateraService } from '../../tender-batera/tender-batera.service';
import { HomeBateraService } from '../home-batera.service';

@Component({
  selector: 'ngx-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styles: [
  ]
})
export class DeleteDialogComponent implements OnInit {
  constructor(private dialogRef: MatDialogRef<DeleteDialogComponent>,
              private homeService : HomeBateraService,
              private projectService : ProjectBateraService,
              private tenderService : TenderBateraService,
              public FNCOL : FunctionCollection,
              @Inject(MAT_DIALOG_DATA) public deleteData: any
  ) { }
  onSuccess : EventEmitter<any> = new EventEmitter<any>()

  ngOnInit(): void {
  }

  acceptDeletion(){
    switch (this.deleteData.dial) {
      case 'ship':
        this.homeService.deleteShip(this.deleteData.id)
        .subscribe( () => {
          this.onSuccess.emit()
          this.close()
        });
        break;
      case 'project' :
        this.projectService.deleteProject(this.deleteData.id)
        .subscribe(()=> {
          this.onSuccess.emit()
          this.close()
        })
        break
      case 'job' :
        this.deleteJob()
        break;
      case 'yard' :
        this.deleteYard()
        break;
      default:
        break;
    }
  }

  deleteJob(){
    const parentIndex = this.deleteData.parentId.toString().split('')
    const work_area = this.FNCOL.reconstructData(this.deleteData.work_area, parentIndex)
    let postBody
    work_area.length === 0 ||
    work_area === undefined ? postBody = {work_area : [null]} : postBody = {work_area : work_area}
    this.projectService.workArea(postBody, this.deleteData.id)
    .subscribe(() => {
      this.onSuccess.emit()
      this.close()
    })
  }

  deleteYard(){
    this.tenderService.deleteTender(this.deleteData.id)
    .subscribe(res => console.log(res))
  }
  
  close(){this.dialogRef.close(); }

}
