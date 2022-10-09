import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProfileBateraService } from '../../profile-batera/profil-batera.service';
import { ProjectBateraService } from '../project-batera.service';

@Component({
  selector: 'ngx-update-workarea',
  templateUrl: './update-workarea.component.html'
})
export class UpdateWorkareaComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<UpdateWorkareaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public datepipe : DatePipe,
    public projectSerivce : ProjectBateraService,
    public profileService : ProfileBateraService
  ){}

  public currentData
  public allData
  onSuccess : EventEmitter<any> = new EventEmitter<any>()
  ngOnInit(): void {
    this.currentData = this.data.current.data
    this.allData = this.data.all
    this.totalPriceBudget = this.currentData['Unit Price'] * this.currentData['Vol']
    this.useUnit = this.unitType[1]

    this.profileService.getUserData(1, 10,'', '','')
    .subscribe(({data} : any) => {
      console.log(data)
      const resp = data.map(user => user.username)
      this.responsible = resp
    })
  }

  public category = ["Owner Exp- Supplies", "Services", "Class", "Others" ,"Yard cost", "Yard cancelled jobs"]
  public rank = ["Critical", "High", "Medium", "Low"]
  public unitType = [ ["Lumpsum"], ["Ls", "m2", "m3", "kg", "pcs", "Mtr (meter length)", "Hours", "times", "unit", "unit.Hours", "shift", "Days", "kWh.Days", "Lines.Days", "Person.Days"]]
  public responsible = []
  public useUnit
  public jobName
  public totalPriceBudget = 0


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

  add(newData){
    let parentIndex = this.currentData.id.toString().split('')
    let postBody = this.updateWorkAreaData(this.allData, parentIndex, newData.value)
    this.submit(postBody)
  }

  submit(work_area) {
    this.projectSerivce.addProjectJob({work_area}, this.data.id_proyek)
    .subscribe(() => {
      this.onSuccess.emit()
      this.close()
    })
  }

  close(){ this.dialogRef.close()}
}
