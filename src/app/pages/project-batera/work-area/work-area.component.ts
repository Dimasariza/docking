import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Inject } from '@angular/core';  
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectBateraService } from '../project-batera.service';

@Component({
  selector: 'ngx-work-area',
  templateUrl: './work-area.component.html',
})
export class WorkAreaComponent {
  constructor(
    private projectSerivce:ProjectBateraService,
    public dialog : MatDialog,
    private dialogRef: MatDialogRef<WorkAreaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public datepipe : DatePipe
  ) {}
  
  onSuccess : EventEmitter<any> = new EventEmitter<any>()
  
  onSubmit(data){
    let submitData = data.value
    Object.assign(
      submitData, {
        id : this.workAreaContainer.length,
        catatan : '',
        type : "pekerjaan"
      }
    )
    submitData.start = this.datepipe.transform(submitData.start, 'yyyy-MM-dd')
    submitData.end = this.datepipe.transform(submitData.end, 'yyyy-MM-dd')
    submitData.kategori = submitData.kategori.toLowerCase()
    submitData.responsible = submitData.responsible.toLowerCase()
    let postBody = { "work_area" : [
      ...this.workAreaContainer,
      submitData
    ]}
    
    this.projectSerivce.addProjectJob(postBody, this.data)
    .subscribe(res => {
      console.log(res)
      this.onSuccess.emit()
      this.close()
    })
  }
  
  close(){ this.dialogRef.close();}

  public category = ["Owner Exp- Supplies", "Services", "Class", "Others" ,"Yard cost", "Yard cancelled jobs"]
  public rank = ["Critical", "High", "Medium", "Low"]
  public unitType = [ ["Lumpsum"], ["Ls", "m2", "m3", "kg", "pcs", "Mtr (meter length)", "Hours", "times", "unit", "unit.Hours", "shift", "Days", "kWh.Days", "Lines.Days", "Person.Days"]]
  public responsible = ["Admin", "Shipowner", "Shipmanager", "Shipyard"]
  public useUnit
  public workAreaContainer : any

  ngOnInit(){
    this.useUnit = this.unitType[0]

    this.projectSerivce.getSubProjectData(this.data)
    .subscribe(({data} : any) => {
      const {work_area} = data
      this.workAreaContainer = work_area
    })
  }
}
