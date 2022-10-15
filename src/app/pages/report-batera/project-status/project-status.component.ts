import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'ngx-project-status',
  templateUrl: './project-status.component.html',
  styleUrls: ['./project-status.component.scss']
})
export class ProjectStatusComponent implements OnInit {
  constructor(private dialogRef: MatDialogRef<ProjectStatusComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
  
  statusColumn: string[] = ['name', 'c_1', 'c_2', 'c_3', 'c_4', 'c_5' ,'c_6'];
  completionColumn : string[] = ['name', 'c_1', 'c_2', 'c_3', 'c_4'];

  public category = ["Owner Exp-Supplies", "Services", "Class", "Others", "Owner Canceled Job" ,"Yard cost", "Yard cancelled jobs"]
  progressData = [
    {name: 'Critical', notStart: 0, progress: 0 , done : 0, cancel : 0, delay: 0, all : 0},
    {name: 'High', notStart: 0, progress: 0 , done : 0, cancel : 0, delay: 0, all : 0},
    {name: 'Medium', notStart: 0, progress: 0 , done : 0, cancel : 0, delay: 0, all : 0},
    {name: 'Low', notStart: 0, progress: 0 , done : 0, cancel : 0, delay: 0, all : 0},
    {name: 'Total', notStart: 0, progress: 0 , done : 0, cancel : 0, delay: 0, all : 0},
  ];
  
  completionData = [
    {name: 'OE-Supplies', percentage: 0, complete: 0, progress : 0, total : 0},
    {name: 'OE-Service', percentage: 0, complete: 0, progress : 0, total : 0},
    {name: 'OE-Class', percentage: 0, complete: 0, progress : 0, total : 0},
    {name: 'OE-Other', percentage: 0, complete:  0, progress : 0, total : 0},
    {name: 'OE-Cancelled', percentage: 0, complete:  0, progress : 0, total : 0},
    {name: 'YE-Cost', percentage: 0, complete:  0, progress : 0, total : 0},
    {name: 'YE-Cancelled', percentage: 0, complete:  0, progress : 0, total : 0},
  ];

  ngOnInit(): void {
    this.data.work_area.forEach(w => {
      this.filterData(w)
    })
  }

  filterData(w){
    const {rank, status} = w
    let total = 0
    if(rank == 'Critical'){
      total++
      const id = 0
      this.progressData[id].all++
      this.decreaseStatus(status, id)
    }
    if(rank == 'High'){
      total++
      const id = 1
      this.progressData[id].all++
      this.decreaseStatus(status, id)
    }
    if(rank == 'Medium'){
      total++
      const id = 2
      this.progressData[id].all++
      this.decreaseStatus(status, id)
    }
    if(rank == 'Low'){
      total++
      const id = 3
      this.progressData[id].all++
      this.decreaseStatus(status, id)
    }
    this.progressData[4].all = total
  }

  decreaseStatus(status, id){
    status === undefined ||
    status === null ? 
    this.progressData[id].notStart++ : null
  }


  close(){ this.dialogRef.close();}

}
