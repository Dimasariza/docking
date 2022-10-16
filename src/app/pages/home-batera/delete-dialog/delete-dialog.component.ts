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
      default:
        break;
    }
  }

  switchServ(){
  }
  
  close(){this.dialogRef.close(); }

}
