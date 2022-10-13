import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReportBateraService } from '../report-batera.service';

@Component({
  selector: 'ngx-update-workprogress',
  templateUrl: './update-workprogress.component.html',
  styles: [
  ]
})
export class UpdateWorkprogressComponent implements OnInit {
  constructor(private dialogRef: MatDialogRef<UpdateWorkprogressComponent>,
              private reportService : ReportBateraService,
              @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
  onSuccess : EventEmitter<any> = new EventEmitter<any>()

  totalPrice = 0
  projectId : any
  modelData : any
  workProgressData

  ngOnInit(): void {
    this.modelData = this.data.job.data
    this.totalPrice = this.modelData.Vol * this.modelData.unit_price_actual
  }

  updateWorkAreaData = (data, parentIndex, newData) => {
    return data.map((w, i) => {
      if (parentIndex.length > 1 && i == parentIndex[0]) {
        parentIndex = parentIndex.slice(1)
        return {...w, items: this.updateWorkAreaData(w.items, parentIndex, newData)}
      } else if(i == parentIndex[0]) {
        let item
        console.log(i)
        w?.items ? item = w.items : item = null
        return {...w, ...newData, items : item}
      }
      console.log(w)
      return w
    })
  }

  updateWorkProgress(newData){
    const {work_area} = this.data.work
    newData.value.last_update = new Date
    let parentIndex = this.modelData.id.toString().split('')
    let postBody = this.updateWorkAreaData(work_area, parentIndex, newData.value)
    this.submit({...postBody, })
  }

  submit(work_area) {
    this.reportService.updateWorkProgress({work_area}, this.data.id)
    .subscribe(res => console.log(res))
    this.onSuccess.emit()
    this.close()
  }

  close(){ this.dialogRef.close();}
}
