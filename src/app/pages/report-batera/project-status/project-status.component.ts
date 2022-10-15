import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'ngx-project-status',
  templateUrl: './project-status.component.html',
  styleUrls: ['./project-status.component.scss']
})
export class ProjectStatusComponent implements OnInit {
  constructor(private dialogRef: MatDialogRef<ProjectStatusComponent>,
              private datePipe : DatePipe,
              @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
  
  statusColumn: string[] = ['name', 'c_1', 'c_2', 'c_3', 'c_4', 'c_5' ,'c_6'];
  completionColumn : string[] = ['name', 'c_1', 'c_2', 'c_3', 'c_4'];
  status = ["Not Started", "In Progress", "Done", "Canceled"]
  category = ["Owner Exp-Supplies", "Services", "Class", "Others", "Owner Canceled Job" ,"Yard cost", "Yard cancelled jobs"]

  progressData : any [] = [
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
    this.reGroupData(this.data.work_area)
  }

  reGroupData(work_area){
    work_area.map(w => {
      console.log(w)
      const id = w.rank.id
      const status = w?.status?.name
      if(status == 'In Progress'){
        this.progressData[id].progress++
      } else if(status == 'Done'){
        this.progressData[id].done++
      } else if(status == 'Canceled'){
        this.progressData[id].cancel++
      } else {
        this.progressData[id].notStart++
      }
      const endDate = this.datePipe.transform(w.end, 'yyyy-MM-dd')
      const currDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
      if(endDate < currDate){
        this.progressData[id].delay++
      } 
      const category = w.category.name
      if(category == 'Owner Exp-Supplies'){
        this.completionData[id].progress = w.progress
      } else if(category == 'Services'){
        this.completionData[id].progress = w.progress
      } else if(category == 'Class'){
        this.completionData[id].progress = w.progress
      } else if( category == "Others"){
        this.completionData[id].progress = w.progress
      } else if ("Owner Canceled Job") {
        this.completionData[id].progress = w.progress
      } else if("Yard cost") {
        this.completionData[id].progress = w.progress
      } else if("Yard cancelled jobs"){
        this.completionData[id].progress = w.progress
      }
    })
  }

  close(){ this.dialogRef.close();}
}
