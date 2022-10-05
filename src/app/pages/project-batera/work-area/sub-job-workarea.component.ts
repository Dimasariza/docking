import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { ProjectBateraService } from '../project-batera.service';



@Component({
  selector: 'ngx-sub-job-workarea',
  templateUrl: './sub-job-workarea.component.html',
})
export class SubJobWorkareaComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<SubJobWorkareaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public datepipe : DatePipe,
    public projectSerivce : ProjectBateraService
  ) { }
  onSuccess : EventEmitter<any> = new EventEmitter<any>()


  ngOnInit(): void {
    this.useUnit = this.unitType[1]
    this.jobName = this.data.row.data.Job
    this.projectSerivce.getSubProjectData(this.data.project_id)
    .subscribe(({data} : any) => {
      const {work_area} = data
      this.workAreaContainer = work_area
    })
  }

  public category = ["Owner Exp- Supplies", "Services", "Class", "Others" ,"Yard cost", "Yard cancelled jobs"]
  public rank = ["Critical", "High", "Medium", "Low"]
  public unitType = [ ["Lumpsum"], ["Ls", "m2", "m3", "kg", "pcs", "Mtr (meter length)", "Hours", "times", "unit", "unit.Hours", "shift", "Days", "kWh.Days", "Lines.Days", "Person.Days"]]
  public responsible = ["Admin", "Shipowner", "Shipmanager", "Shipyard"]
  public useUnit
  public workAreaContainer : any
  public jobName 

  onSubmit(newData){
    let submitData = newData.value
    Object.assign(
      submitData, {
        catatan : '',
        type : "pekerjaan",
      }
    )
    submitData.start = this.datepipe.transform(submitData.start, 'yyyy-MM-dd')
    submitData.end = this.datepipe.transform(submitData.end, 'yyyy-MM-dd')
    submitData.kategori = submitData.kategori.toLowerCase()
    submitData.responsible = submitData.responsible.toLowerCase()

    let {index} = this.data.row.data

    if(Object.keys(this.workAreaContainer).includes('updated_at')) {
      delete this.workAreaContainer[index]['updated_at']
      delete this.workAreaContainer[index]['created_at']
    }

    let postBody = { "work_area" : [
      ...this.workAreaContainer
    ]}

    let postItem = postBody.work_area[index]
    if( Object.keys(postItem).includes('items') ) {
      postItem.items.push(submitData)
      postItem.items[postItem.items.length - 1]["id"] =   (index).toString() + (postItem.items.length - 1).toString()
    } else {
      postItem.items  = [] 
      postItem.items.push(submitData)
      postItem.items[postItem.items.length - 1]["id"] =  (index).toString() + (postItem.items.length - 1).toString()
    }
    console.log(postBody)

    postBody.work_area[index].type = "kategori"
    this.projectSerivce.addProjectJob(postBody, this.data.project_id)
    .subscribe(res => {
      console.log(res)
      this.onSuccess.emit()
      this.close()
    })
  }

  close(){ this.dialogRef.close();}

}
