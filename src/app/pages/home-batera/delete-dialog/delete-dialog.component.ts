import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FunctionCollection } from '../../function-collection-batera/function-collection.component';
import { ProjectBateraService } from '../../project-batera/project-batera.service';
import { ReportBateraService } from '../../report-batera/report-batera.service';
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
              private reportService : ReportBateraService,
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
        const work_area = this.deleteJob()
        this.projectService.workArea({work_area}, this.deleteData.id)
        .subscribe(() => {
          this.onSuccess.emit()
          this.close()
        })
        break;
      case 'yard' :
        this.tenderService.deleteTender(this.deleteData.id)
        .subscribe(res => console.log(res))
        break;
      case 'variant job' :
        const variant_work = this.deleteJob()
        this.reportService.updateVarianWork({variant_work}, this.deleteData.id)
        .subscribe(() => {
          this.onSuccess.emit()
          this.close()
        })
      default:
        break;
    }
  }

  deleteJob(){
    let parentId = this.deleteData.parentId
    let work_area = this.FNCOL.reconstructData(this.deleteData.work_area, parentId)
    work_area = this.FNCOL.calculateProgress(parentId, work_area)
    if (work_area.length === 0 || work_area === undefined) return [null]
    else return work_area
  }

  close(){this.dialogRef.close(); }

}
