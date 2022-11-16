import { DatePipe } from '@angular/common';
import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FunctionCollection } from '../../function-collection-batera/function-collection.component';


@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'ngx-project-status',
  templateUrl: './project-status.component.html',
  styleUrls: ['./project-status.component.scss']
})
export class ProjectStatusComponent implements OnInit {
  constructor(private dialogRef: MatDialogRef<ProjectStatusComponent>,
              private datePipe : DatePipe,
              private FNCOL : FunctionCollection,
              @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
  
  statusColumn: string[] = ['name', 'c_1', 'c_2', 'c_3', 'c_4', 'c_5' ,'c_6'];
  completionColumn : string[] = ['name', 'c_1', 'c_2', 'c_3', 'c_4'];
  progressData : any []
  completionData : any []
  baseCurrency : any

  initData(){
    this.progressData = [
      {name: 'Critical', notStart: 0, progress: 0 , done : 0, cancel : 0, delay: 0, all : 0},
      {name: 'High', notStart: 0, progress: 0 , done : 0, cancel : 0, delay: 0, all : 0},
      {name: 'Medium', notStart: 0, progress: 0 , done : 0, cancel : 0, delay: 0, all : 0},
      {name: 'Low', notStart: 0, progress: 0 , done : 0, cancel : 0, delay: 0, all : 0},
      {name: 'Total', notStart: 0, progress: 0 , done : 0, cancel : 0, delay: 0, all : 0},
    ];
    
    this.completionData = [
      {name: 'OE-Supplies', percentage: 0, complete: 0, totalJob : 0, value : 0},
      {name: 'OE-Service', percentage: 0, complete: 0, totalJob : 0, value : 0},
      {name: 'OE-Class', percentage: 0, complete: 0, totalJob : 0, value : 0},
      {name: 'OE-Other', percentage: 0, complete:  0, totalJob : 0, value : 0},
      {name: 'OE-Additional Job', percentage: 0, complete:  0, totalJob : 0, value : 0},
      {name: 'OE-Cancelled', percentage: 0, complete:  0, totalJob : 0, value : 0},
      {name: 'Amortization Job', percentage: 0, complete:  0, totalJob : 0, value : 0},
      {name: 'Depreciation Job', percentage: 0, complete:  0, totalJob : 0, value : 0},
      {name: 'YE-Cost', percentage: 0, complete:  0, totalJob : 0, value : 0},
      {name: 'YE-Cancelled', percentage: 0, complete:  0, totalJob : 0, value : 0},
      {name: 'Grand Total', percentage: 0, complete:  0, totalJob : 0, value : 0},
    ];
  }

  isFalsy = (value) => !value
  ngOnInit(): void {
    this.initData();
    let {variant_work, project} = this.data
    let {work_area, mata_uang} = project
    if(this.isFalsy(work_area) || this.isFalsy(work_area[0])) work_area = []
    if(this.isFalsy(variant_work) || this.isFalsy(variant_work[0])) variant_work = []
    const regroupData = [...project.work_area, ...variant_work]
    this.baseCurrency = this.FNCOL.convertCurrency(mata_uang)
    if(!this.isFalsy(regroupData)) this.reGroupData(regroupData)
  }

  reGroupData(work_area){
    work_area.forEach(job => {
      const rankId = job?.rank
      const status = job?.status
      const endDate = this.datePipe.transform(job.end, 'yyyy-MM-dd')
      const currDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')

      if(endDate < currDate) this.progressData[rankId].delay++ ;
      const position = this.progressData.length - 1
      const allAmount = (index) => this.progressData[index].all++;
      if(status == 1){
        this.progressData[rankId].progress++;
        this.progressData[position].progress++;
        allAmount(position);
        allAmount(rankId);
      } else if(status == 2){
        this.progressData[rankId].done++;
        this.progressData[position].done++;
        allAmount(position);
        allAmount(rankId);
      } else if(status == 3){
        this.progressData[rankId].cancel++;
        this.progressData[position].cancel++;
        allAmount(position);
        allAmount(rankId);
      } else {
        this.progressData[rankId].notStart++;
        this.progressData[position].notStart++;
        allAmount(position);
        allAmount(rankId);
      }

      const category = job.category
      for(let [index] of this.FNCOL.category.entries()) {
        if(index === category) {
          this.completionData[index].totalJob++;
          this.completionData[index].percentage += job?.progress;
          this.completionData[index].percentage /= this.completionData[index].totalJob
          const {'Price Budget' : priceBudget = 0 , 'Price Contract' : priceContract = 0, 'Price Add On' : priceAddOn = 0}  = job;
          if(status === 2) this.completionData[index].complete++;
          if(!priceBudget) continue;
          this.completionData[index].value += parseInt(priceBudget) + parseInt(priceContract) + parseInt(priceAddOn);
        }
      }
    })

    const completion = this.completionData.length - 1
    for(let i = 0 ; i < completion ; i++) {
      this.completionData[completion].percentage += this.completionData[i].percentage / completion
      this.completionData[completion].complete += this.completionData[i].complete
      this.completionData[completion].totalJob += this.completionData[i].totalJob
      this.completionData[completion].value += this.completionData[i].value 
    }
    this.completionData[completion].percentage = this.completionData[completion].percentage.toFixed(3)
   }

  close(){ this.dialogRef.close()}
}



