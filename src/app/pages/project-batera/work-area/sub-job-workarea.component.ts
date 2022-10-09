import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { ProjectBateraService } from '../project-batera.service';
import { ProfileBateraService } from '../../profile-batera/profil-batera.service';

@Component({
  selector: 'ngx-sub-job-workarea',
  templateUrl: './sub-job-workarea.component.html',
})
export class SubJobWorkareaComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<SubJobWorkareaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public datepipe : DatePipe,
    public projectSerivce : ProjectBateraService,
    public profileService : ProfileBateraService
  ) { }
  onSuccess : EventEmitter<any> = new EventEmitter<any>()

  ngOnInit(): void {
    console.log(this.data)
    this.useUnit = this.unitType[1]
    this.jobName = this.data.row.data.Job
    this.projectSerivce.getSubProjectData(this.data.project_id)
    .subscribe(({data} : any) => {
      const {work_area} = data
      this.workAreaContainer = work_area
    })

    this.profileService.getUserData(1, 10, '', '','')
    .subscribe(({data} : any) => {
      const resp = data.map(user => user.username)
      this.responsible = resp
    })
  }

  public category = ["Owner Exp- Supplies", "Services", "Class", "Others" ,"Yard cost", "Yard cancelled jobs"]
  public rank = ["Critical", "High", "Medium", "Low"]
  public unitType = [ ["Lumpsum"], ["Ls", "m2", "m3", "kg", "pcs", "Mtr (meter length)", "Hours", "times", "unit", "unit.Hours", "shift", "Days", "kWh.Days", "Lines.Days", "Person.Days"]]
  public responsible = []
  public useUnit
  public workAreaContainer : any
  public jobName
  public totalPriceBudget = 0

  add(newData){
    let submitData = {...newData.value, 
      catatan : "", 
      type : "pekerjaan",
      start : this.datepipe.transform(newData.value.start, 'yyyy-MM-dd'),
      end : this.datepipe.transform(newData.value.end, 'yyyy-MM-dd')
    } 
    
    let {id} = this.data.row.data
    let parentIndex = id.toString().split('')
    
    const reconstructData = (data, newData) => {
      return data.map((w, i) => {
        if (parentIndex.length > 1 && i == parentIndex[0]) {
          parentIndex = parentIndex.slice(1)
          return {...w, items: reconstructData(w.items, newData), type: 'kategori'}
        } else if(i == parentIndex[0]) {
          if (!w.items) w.items = []          
          return {...w, items: [...w.items, {...newData, id: w.id.toString()+w.items.length.toString()}], type: 'kategori'}
        }
        return w
      })
    }

    const work_area = reconstructData(this.workAreaContainer, submitData)
    this.submit(work_area)
  }

  submit(work_area) {
    this.projectSerivce.addProjectJob({work_area}, this.data.project_id)
    .subscribe(() => {
      this.onSuccess.emit()
      this.close()
    })
  }

  close(){ this.dialogRef.close();}
}
