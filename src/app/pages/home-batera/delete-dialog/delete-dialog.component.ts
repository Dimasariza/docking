import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectBateraService } from '../../project-batera/project-batera.service';
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
      case 'job' :
        this.deleteJob()
      default:
        break;
    }
  }

  reconstructData = (data, parentIndex) => {
    return data.map((w, i) => {
      if (parentIndex.length > 1 && i == parentIndex[0]) {
        parentIndex = parentIndex.slice(1)
        return {...w, items: this.reconstructData(w.items, parentIndex)}
      } else if(i == parentIndex[0]) {
        return null
      }
      return w
    })
    .filter(f => f != null)
  }

  deleteJob(){
    const parentIndex = this.deleteData.parentId.toString().split('')
    const work_area = this.reconstructData(this.deleteData.work_area, parentIndex)
    let postBody
    work_area.length === 0 ||
    work_area === undefined ? postBody = {work_area : [null]} : postBody = {work_area : work_area}
    this.projectService.workArea(postBody, this.deleteData.id)
    .subscribe(() => {
      this.onSuccess.emit()
      this.close()
    })
  }

  switchServ(){
  }
  
  close(){this.dialogRef.close(); }

}
