import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectService } from '../../../project/project.service';

@Component({
  selector: 'ngx-bar-progress',
  templateUrl: './bar-progress.component.html',
})
export class BarProgressComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<BarProgressComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private projectService : ProjectService
    ) { }
    
  modelData : any = this.data.data.data;
  workAreaContainer : any;
  ngOnInit(): void {
    this.projectService.getAllProjects({})
  }

  onSubmit(data){
    // console.log(data)

  }

  close(){
    this.dialogRef.close();
  }


}
