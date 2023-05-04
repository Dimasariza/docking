import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { FunctionCollection } from '../function-collection/function-collection.component';
import { ProjectBateraService } from '../../pages/project-batera/project-batera.service';
import { ReportBateraService } from '../../pages/report-batera/report-batera.service';
import { TenderBateraService } from '../../pages/tender-batera/tender-batera.service';
import { HomeBateraService } from '../../pages/home-batera/home-batera.service';
import { NbDialogRef } from '@nebular/theme';
import { Subject } from 'rxjs';

@Component({
  selector: 'ngx-delete-dialog',
  templateUrl: './delete-dialog.component.html',
})
export class DeleteDialogComponent {
  constructor(
    private homeService : HomeBateraService,
    private projectService : ProjectBateraService,
    private tenderService : TenderBateraService,
    private reportService : ReportBateraService,
    private dialog: NbDialogRef<any>,
    // public FNCOL : FunctionCollection,
  ) { }

  @Input() dialogData: any;
  private destroy$: Subject<void> = new Subject<void>();
 
  onSuccess : EventEmitter<any> = new EventEmitter<any>()

  acceptDeletion(data){
  //   switch (this.deleteData.dial) {
  //     case 'ship':
  //       this.homeService.deleteShip(this.deleteData.id)
  //       .subscribe( () => {
  //         this.onSuccess.emit()
  //         this.close()
  //       });
  //       break;
  //     case 'project' :
  //       this.projectService.deleteProject(this.deleteData.id)
  //       .subscribe(()=> {
  //         this.onSuccess.emit()
  //         this.close()
  //       })
  //       break
  //     case 'job' :
  //       const work_area = this.deleteJob()
  //       this.projectService.workArea({work_area}, this.deleteData.id)
  //       .subscribe(() => {
  //         this.onSuccess.emit()
  //         this.close()
  //       })
  //       break;
  //     case 'yard' :
  //       this.tenderService.deleteTender(this.deleteData.id)
  //       .subscribe(res => {
  //         this.onSuccess.emit()
  //         this.close()
  //       })
  //       break;
  //     case 'variant job' :
  //       const variant_work = this.deleteJob()
  //       this.reportService.updateVarianWork({variant_work}, this.deleteData.id)
  //       .subscribe(() => {
  //         this.onSuccess.emit()
  //         this.close()
  //       })
  //     default:
  //       break;
  //   }
  }

  deleteJob(){
    // let parentId = this.deleteData.parentId
    // let work_area = this.FNCOL.reconstructData(this.deleteData.work_area, parentId)
    // work_area = this.FNCOL.calculateProgress(parentId, work_area)
    // if (work_area.length === 0 || work_area === undefined) return [null]
    // else return work_area
  }


  closeDialog (arr = null) {
    if(!arr) return this.dialog.close();
    this.dialog.close(arr)
  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
