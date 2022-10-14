import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Inject, Output } from '@angular/core';  
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProfileBateraService } from '../../profile-batera/profil-batera.service';
import { ReportBateraService } from '../../report-batera/report-batera.service';
import { TenderBateraService } from '../../tender-batera/tender-batera.service';
import { ProjectBateraService } from '../project-batera.service';

@Component({
  selector: 'ngx-work-area',
  templateUrl: './work-area.component.html',
})
export class WorkAreaComponent {
  constructor(private projectSerivce:ProjectBateraService,
              private dialogRef: MatDialogRef<WorkAreaComponent>,
              private datepipe : DatePipe,
              private profileService : ProfileBateraService,
              private tenderService : TenderBateraService,
              private reportService : ReportBateraService,
              @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}
  
  onSuccess : EventEmitter<any> = new EventEmitter<any>()
  @Output() reloadPage = new EventEmitter<string>();

  close(){ this.dialogRef.close();}

  public category = ["Owner Exp- Supplies", "Services", "Class", "Others" ,"Yard cost", "Yard cancelled jobs"]
  public rank = ["Critical", "High", "Medium", "Low"]
  public unitType = [["Lumpsum"], ["Ls", "m2", "m3", "kg", "pcs", "Mtr (meter length)", "Hours", "times", "unit", "unit.Hours", "shift", "Days", "kWh.Days", "Lines.Days", "Person.Days"]]
  public responsible = []
  public workAreaContainer : any = []
  public totalPriceBudget = 0
  public modelData : any = {}
  
  ngOnInit(){
    const data = this.data.data?.data
    switch (this.data.dial) {
      case 'Add':
        this.unitType = this.unitType.filter((v, i) => i == 0)
        break;
      case 'Add Sub':
        this.unitType = this.unitType.filter((v, i) => i == 1)
        this.modelData['head'] = `${data['Job No']}. ${data.Job}` 
      break;
      case 'Update' :
        const parentId = this.data?.parentId.toString().split('')
        parentId.length === 1 ?
        this.unitType = this.unitType.filter((v, i) => i == 0) :
        this.unitType = this.unitType.filter((v, i) => i == 1)
        this.modelData = this.data.data.data
        this.modelData['head'] = `${data['Job No']}. ${data.Job}`
      break;
    }

    this.profileService.getUserData(1, 10, '', "shipyard", '')
    .subscribe(({data} : any) => {
      this.responsible = data
      .map(user => {
        return {
          name : user.username, 
          id : user.id_user
      }});
    });

    this.projectSerivce.getSubProjectData(this.data.id)
    .subscribe(({data} : any) => {
      const {work_area} = data
      work_area === null || 
      work_area === undefined ? null 
      : this.workAreaContainer = work_area
    })
  }
    
  workAreaBtn(data){
    if(this.data.dial === "Add") {
      this.addWorkArea(data)
    }
    if(this.data.dial === "Update") {
      this.updateWorkArea(data)
    }
    if(this.data.dial === "Add Sub") {
      this.addSubJob(data)
    }
  }

  addWorkArea(data){
    let submitData = data.value
    this.workAreaContainer === null ||
    this.workAreaContainer === undefined ||
    this.workAreaContainer[0] === null ? this.workAreaContainer = [] : null
    submitData = {...submitData , 
      start : this.datepipe.transform(submitData.start, 'yyyy-MM-dd'),
      end : this.datepipe.transform(submitData.end, 'yyyy-MM-dd'),
      category : submitData.category.toLowerCase(),
      responsible : submitData.responsible,
      id: this.workAreaContainer.length, 
      type : "pekerjaan"
    }
    const work_area = {...this.workAreaContainer,submitData}
    this.reportService.updateWorkProgress({work_area}, this.data.id)
    this.tenderService.updateWorkArea({work_area}, this.data.id)
    this.projectSerivce.addProjectJob({work_area}, this.data.id)
    .subscribe(() => {
      this.onSuccess.emit()
      this.close()
    })
  }
  
  updateWorkAreaData = (data, parentIndex, newData) => {
    return data.map((w, i) => {
      if (parentIndex.length > 1 && i == parentIndex[0]) {
        parentIndex = parentIndex.slice(1)
        return {...w, items: this.updateWorkAreaData(w.items, parentIndex, newData)}
      } else if(i == parentIndex[0]) {
        let item
        w?.items ? item = w.items : item = null
        return {...w, ...newData, items : item}
      }
      return w
    })
  }

  updateWorkArea(newData){
    let parentIndex = this.data.parentId.toString().split('')
    const work_area = this.updateWorkAreaData(this.workAreaContainer, parentIndex, newData.value)
    console.log({work_area})
    this.reportService.updateWorkProgress({work_area}, this.data.id)  
    .subscribe(res => console.log(res))
    this.tenderService.updateWorkArea({work_area}, this.data.id)
    .subscribe(res => console.log(res))
    this.projectSerivce.addProjectJob({work_area}, this.data.id)
    .subscribe(() => {
      this.onSuccess.emit()
      this.close()
    })
  }

  addSubJobData = (data, newData, parentIndex) => {
    return data.map((w, i) => {
      if (parentIndex.length > 1 && i == parentIndex[0]) {
        parentIndex = parentIndex.slice(1)
        return {...w, items: this.addSubJobData(w.items, newData, parentIndex), type: 'kategori'}
      } else if(i == parentIndex[0]) {
        if (!w.items) w.items = []          
        return {...w, items: [...w.items, {...newData, id: w.id.toString()+w.items.length.toString()}], type: 'kategori'}
      }
      return w
    })
  }

  addSubJob(newData){
    let submitData = {...newData.value, 
      type : "pekerjaan",
      start : this.datepipe.transform(newData.value.start, 'yyyy-MM-dd'),
      end : this.datepipe.transform(newData.value.end, 'yyyy-MM-dd')
    } 
    let parentIndex = this.data.parentId.toString().split('')
    const work_area = this.addSubJobData(this.workAreaContainer, submitData, parentIndex)
    this.reportService.updateWorkProgress({work_area}, this.data.id)
    this.tenderService.updateWorkArea({work_area}, this.data.id)
    this.projectSerivce.addProjectJob({work_area}, this.data.id)
    .subscribe(() => {
      this.onSuccess.emit()
      this.close()
    })
  }
}
