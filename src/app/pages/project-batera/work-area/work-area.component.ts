import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit } from '@angular/core';  
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FunctionCollection } from '../../function-collection-batera/function-collection.component';
import { ProfileBateraService } from '../../profile-batera/profil-batera.service';
import { ReportBateraService } from '../../report-batera/report-batera.service';
import { ProjectBateraService } from '../project-batera.service';

@Component({
  selector: 'ngx-work-area',
  templateUrl: './work-area.component.html',
})
export class WorkAreaComponent implements OnInit {
  constructor(private projectSerivce:ProjectBateraService,
              private dialogRef: MatDialogRef<WorkAreaComponent>,
              private profileService : ProfileBateraService,
              private currencyPipe : CurrencyPipe,
              private reportService : ReportBateraService,
              public FNCOL : FunctionCollection,
              @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  onSuccess : EventEmitter<any> = new EventEmitter<any>()

  responsible = []
  workAreaContainer : any = []
  modelData : any = {}
  disabledJob : boolean = false
  totalPrice : any = 0
  unitPrice : any 
  originalUnitPrice : any = 0 
  unitPriceLabel : string = null
  usedCurrency : string
  unitType

  ngOnInit(){
    this.workAreaContainer = this.data.work.work_area
    const data = this.data?.data?.data
    const parentId = data?.id.toString().split('')
    switch (this.data.dial) {
      case 'Add':
        this.unitType = this.FNCOL.jobUnit
        this.unitPriceLabel = 'Price Budget'
        this.getUserProfile()
        break;
      case 'Add Variant' :
        this.unitType = this.FNCOL.jobUnit
        this.unitPriceLabel = 'Price Add On'
        this.getUserProfile()
        break;
      case 'Add Sub':
        this.unitType = this.FNCOL.subJobUnit
        this.modelData['head'] = `${data.jobNumber}. ${data.jobName}` 
        this.unitPriceLabel = 'Price Budget'
        this.getUserProfile()
      break;
      case 'Add Sub Variant' :
        this.unitType = this.FNCOL.subJobUnit
        this.modelData['head'] = `${data.jobNumber}. ${data.jobName}` 
        this.unitPriceLabel = 'Price Add On'
        this.getUserProfile()
      break;
      case 'Update' :
        this.unitPriceLabel = 'Price Budget'
        this.workAreaDatas(parentId, data)
        this.getUserProfile()
      break;
      case 'Edit Variant' :
        this.unitPriceLabel = 'Price Add On'
        this.workAreaDatas(parentId, data)
        this.getUserProfile()
      break;
      case 'Work Progress':
        this.unitPriceLabel = 'Price Actual'
        this.workAreaDatas(parentId, data)
      break;
      case 'Update Load Details':
        this.unitPriceLabel = 'Price Contract'
        this.workAreaDatas(parentId, data)
      break;
    }
  }

  getUserProfile(){
    this.profileService.getUserData(1, 10, '', "shipyard", '')
    .subscribe(({data} : any) => {
      this.responsible = data
      .map(user => {
        return {
          name : user.username, 
          id : user.id_user
      }});
    });
  }
  
  workAreaDatas(parentId, data){
    parentId.length === 1 ?
    this.unitType = this.FNCOL.jobUnit :
    this.unitType = this.FNCOL.subJobUnit
    this.modelData = this.data.data.data
    this.modelData['head'] = `${data.jobNumber}. ${data.jobName}`
    this.disabledJob = true
    this.unitPrice = this.modelData?.[this.unitPriceLabel]
    this.totalPrice = this.unitPrice ? this.unitPrice * this.modelData.volume : 0
    // this.unitPrice = this.currencyPipe.transform(unitPrice, 'Rp ')
    // this.totalPrice = this.currencyPipe.transform(totalPrice, 'Rp ')
  }
  
  unitPriceAmount(e, volume){
    e = e.replace(/\D/g, '')
    if(!e.length) return  
    this.originalUnitPrice = e
    this.unitPrice = this.currencyPipe.transform(e, this.FNCOL.convertCurrency(this.usedCurrency)).split(".")[0]
    this.totalPrice = this.currencyPipe.transform(volume * e, this.FNCOL.convertCurrency(this.usedCurrency)).split(".")[0]
  }

  volumeAmount(e){
    const total = e * this.originalUnitPrice
    this.totalPrice = this.currencyPipe.transform(total, this.FNCOL.convertCurrency(this.usedCurrency)).split(".")[0]
  }

  workAreaBtn(data){
    switch (this.data.dial) {
      case 'Add' :
      case 'Add Variant' :
      this.addWorkArea(data)
      break;
      case 'Add Sub' :
      case 'Add Sub Variant' :
      this.addSubJob(data)
      break;
      case 'Update' :
      case 'Work Progress' :
      case 'Update Load Details':
      case 'Edit Variant' :
        this.updateWorkArea(data)
      break;
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

  addWorkArea(data){
    const submitData = data.value
    submitData[this.unitPriceLabel] = this.originalUnitPrice
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
  
  updateWorkArea(newData){
    const submitData = newData.value
    const reconstructData = {
      ...submitData,
      ...this.reconstructData(submitData),
      last_update : new Date()
    }
    const data = this.data?.data?.data
    const parentId = data?.id.toString().split('')
    const work_area = this.FNCOL.updateWorkAreaData(this.workAreaContainer, parentId, reconstructData)
    this.uploadData(work_area)
  }

  addSubJob(newData){
    const submitData = newData.value
    const reconstructData = {...submitData, 
      ...this.reconstructData(submitData),
      type : "pekerjaan",
    } 
    const data = this.data?.data?.data
    const parentId = data?.id.toString().split('')
    const work_area = this.addSubJobData(this.workAreaContainer, reconstructData, parentId)
    this.uploadData(work_area)
  }

  uploadData(work_area){
    switch(this.data.dial) {
      case 'Add' :
      case 'Add Sub' :
      case 'Update' :
      case 'Work Progress' :
      case 'Update Load Details':
        this.projectSerivce.workArea({work_area}, this.data.id)
        .subscribe(() => {
          this.onSuccess.emit()
          this.close()
        })
      break;
      case 'Add Variant' :
      case 'Add Sub Variant' :
      case 'Edit Variant' :
        this.reportService.updateVarianWork({variant_work : work_area}, this.data.id)
        .subscribe(() => {
          this.onSuccess.emit()
          this.close()
        })
      break;
    }
  }

  close(){ this.dialogRef.close()}
}
