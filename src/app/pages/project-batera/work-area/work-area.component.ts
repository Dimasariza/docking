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
              private reportService : ReportBateraService,
              @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }
  onSuccess : EventEmitter<any> = new EventEmitter<any>()
  @Output() reloadPage = new EventEmitter<string>();

  close(){ this.dialogRef.close();}

  category = ["Owner Exp-Supplies", "Services", "Class", "Others", "Owner Canceled Job" ,"Yard cost", "Yard cancelled jobs", "Depreciation Jobs", "Amortization Jobs"]
  rank = ["Critical", "High", "Medium", "Low"]
  jobUnit = ["Lumpsum"]
  subJobUnit = ["Ls", "m2", "m3", "kg", "pcs", "Mtr (meter length)", "Hours", "times", "unit", "unit.Hours", "shift", "Days", "kWh.Days", "Lines.Days", "Person.Days"]
  status = ["Not Started", "In Progress", "Done", "Canceled"]
  responsible = []
  workAreaContainer : any = []
  modelData : any = {}
  disabledJob : boolean = false
  totalPrice = 0
  unitPriceLabel : string = null
  unitType
  
  ngOnInit(){
    const data = this.data.data?.data
    switch (this.data.dial) {
      case 'Add':
        this.unitType = this.jobUnit
        this.unitPriceLabel = 'Price Budget'
        break;
      case 'Add Sub':
        this.unitType = this.subJobUnit
        this.modelData['head'] = `${data.jobNumber}. ${data.jobName}` 
        this.unitPriceLabel = 'Price Budget'
      break;
      case 'Update' :
        const parentId = this.data?.parentId.toString().split('')
        parentId.length === 1 ?
        this.unitType = this.jobUnit :
        this.unitType = this.subJobUnit
        this.modelData = this.data.data.data
        this.modelData['head'] = `${data.jobNumber}. ${data.jobName}`
        this.modelData['unitPriceLabel'] = this.modelData['Price Budget']
        this.totalPrice = this.modelData.unitPriceLabel * this.modelData.volume
        this.disabledJob = true
        this.unitPriceLabel = 'Price Budget'
      break;
      case 'Work Progress':
        this.disabledJob = true
        this.modelData = this.data.data.data
        this.modelData['head'] = `${data.jobNumber}. ${data.jobName}`
        this.unitPriceLabel = 'Price Actual'
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
    if(this.data.dial === 'Work Progress'){
      this.updateWorkArea(data)
    }
  }

  reconstructData(reData){
    if(typeof(reData.category) === 'number'){
      reData.category = {name : this.category[reData.category] ,id : reData.category}
    }
    if(typeof(reData.rank) === 'number'){
      reData.rank = {name : this.rank[reData.rank] ,id : reData.rank}
    }
    if(typeof(reData.unit) === 'number'){
      reData.unit = {name : this.unitType[reData.unit] ,id : reData.unit}
    }
    if(typeof(reData?.status) === 'number'){
      reData.status = {name : this.status[reData.status] ,id : reData.status}
    }
    return reData
  }

  addWorkArea(data){
    const submitData = data.value
    this.workAreaContainer === null ||
    this.workAreaContainer === undefined ||
    this.workAreaContainer[0] === null ? this.workAreaContainer = [] : null
    let work_area = [
      ...this.workAreaContainer,
      {
      ...submitData , 
      ...this.reconstructData(submitData),
      id: this.workAreaContainer.length, 
      type : "pekerjaan",
      status : 'Not Started',
    }]
    this.uploadData(work_area)
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
      return {...w,
        start : this.datepipe.transform(newData.start, 'yyyy-MM-dd'),
        end : this.datepipe.transform(newData.end, 'yyyy-MM-dd'),
      }
    })
  }

  updateWorkArea(newData){
    const submitData = newData.value
    const reconstructData = {
      ...submitData,
      ...this.reconstructData(submitData),
      last_update : new Date()
    }
    const parentIndex = this.data.parentId.toString().split('')
    const work_area = this.updateWorkAreaData(this.workAreaContainer, parentIndex, reconstructData)
    this.uploadData(work_area)
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
    const submitData = newData.value
    const reconstructData = {...submitData, 
      ...this.reconstructData(submitData),
      type : "pekerjaan",
    } 
    let parentIndex = this.data.parentId.toString().split('')
    const work_area = this.addSubJobData(this.workAreaContainer, reconstructData, parentIndex)
    this.uploadData(work_area)
  }

  uploadData(work_area){
    this.projectSerivce.workArea({work_area}, this.data.id)
    .subscribe(() => {
      this.onSuccess.emit()
      this.close()
    })
  }
}
