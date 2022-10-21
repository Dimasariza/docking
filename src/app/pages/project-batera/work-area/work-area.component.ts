import { Component, EventEmitter, Inject } from '@angular/core';  
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FunctionCollection } from '../../function-collection-batera/function-collection.component';
import { ProfileBateraService } from '../../profile-batera/profil-batera.service';
import { ProjectBateraService } from '../project-batera.service';


@Component({
  selector: 'ngx-work-area',
  templateUrl: './work-area.component.html',
})
export class WorkAreaComponent {
  constructor(private projectSerivce:ProjectBateraService,
              private dialogRef: MatDialogRef<WorkAreaComponent>,
              private profileService : ProfileBateraService,
              public FNCOL : FunctionCollection,
              @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  onSuccess : EventEmitter<any> = new EventEmitter<any>()

  responsible = []
  workAreaContainer : any = []
  modelData : any = {}
  disabledJob : boolean = false
  totalPrice = 0
  unitPriceLabel : string = null
  unitPriceJob
  unitType
  
  ngOnInit(){
    console.log(this.data)
    const data = this.data?.data?.data
    const parentId = data?.id.toString().split('')
    switch (this.data.dial) {
      case 'Add':
        this.unitType = this.FNCOL.jobUnit
        this.unitPriceLabel = 'Price Budget'
        break;
      case 'Add Sub':
        this.unitType = this.FNCOL.subJobUnit
        this.modelData['head'] = `${data.jobNumber}. ${data.jobName}` 
        this.unitPriceLabel = 'Price Budget'
      break;
      case 'Update' :
        parentId.length === 1 ?
        this.unitType = this.FNCOL.jobUnit :
        this.unitType = this.FNCOL.subJobUnit
        this.modelData = this.data.data.data
        this.modelData['head'] = `${data.jobNumber}. ${data.jobName}`
        this.modelData['unitPriceLabel'] = this.modelData['Price Budget']
        this.totalPrice = this.modelData.unitPriceLabel * this.modelData.volume
        this.disabledJob = true
        this.unitPriceLabel = 'Price Budget'
        this.unitPriceJob = this.modelData?.[this.unitPriceLabel]
      break;
      case 'Work Progress':
        this.disabledJob = true
        this.modelData = this.data.data.data
        this.modelData['head'] = `${data.jobNumber}. ${data.jobName}`
        this.unitPriceLabel = 'Price Actual'
      break;
      case 'Update Load Details':
        parentId.length === 1 ?
        this.unitType = this.FNCOL.jobUnit :
        this.unitType = this.FNCOL.subJobUnit
        this.modelData = this.data.data.data
        this.modelData['head'] = `${data.jobNumber}. ${data.jobName}`
        this.modelData['unitPriceLabel'] = this.modelData['Price Budget']
        this.totalPrice = this.modelData.unitPriceLabel * this.modelData.volume
        this.disabledJob = true
        this.unitPriceLabel = 'Price Contract'
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
      work_area === undefined ? null : 
      this.workAreaContainer = work_area
    })
  }
    
  workAreaBtn(data){
    switch (this.data.dial) {
      case 'Add' :
      this.addWorkArea(data)
        break
      case 'Update' :
      this.updateWorkArea(data)
        break
      case 'Add Sub' :
      this.addSubJob(data)
        break
      case 'Work Progress' :
      this.updateWorkArea(data)
        break
    }
  }

  reconstructData(reData){
    if(typeof(reData.category) === 'number'){
      reData.category = {name : this.FNCOL.category[reData.category] ,id : reData.category}
    }
    if(typeof(reData.rank) === 'number'){
      reData.rank = {name : this.FNCOL.rank[reData.rank] ,id : reData.rank}
    }
    if(typeof(reData.unit) === 'number'){
      reData.unit = {name : this.unitType[reData.unit] ,id : reData.unit}
    }
    if(typeof(reData?.status) === 'number'){
      reData.status = {name : this.FNCOL.status[reData.status] ,id : reData.status}
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
    // this.uploadData(work_area)
  }
  
  updateWorkArea(newData){
    const submitData = newData.value
    const reconstructData = {
      ...submitData,
      ...this.reconstructData(submitData),
      last_update : new Date()
    }
    const parentIndex = this.data.parentId.toString().split('')
    const work_area = this.FNCOL.updateWorkAreaData(this.workAreaContainer, parentIndex, reconstructData)
    console.log(work_area)
    // this.uploadData(work_area)
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
    // this.uploadData(work_area)
  }

  uploadData(work_area){
    this.projectSerivce.workArea({work_area}, this.data.id)
    .subscribe(() => {
      this.onSuccess.emit()
      this.close()
    })
  }

  close(){ this.dialogRef.close()}

}
