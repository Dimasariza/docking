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
              // protected dateService: NbDateService<Date>,
              @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    // this.min = this.dateService.addMonth(this.dateService.today(), 0);
  }

  onSuccess : EventEmitter<any> = new EventEmitter<any>()
  // min : Date
  responsible = []
  workAreaContainer : any = []
  modelData : any = {}
  totalPrice : any = 0
  unitPrice : any 
  originalUnitPrice : any = 0 
  unitPriceLabel : string = null
  usedCurrency : string
  unitType
  disabledChild : boolean = false

  ngOnInit(){
    this.usedCurrency = this.data.work.mata_uang
    const data = this.data?.data?.data
    const parentId = data?.id.toString().split('')
    this.disabledChild = parentId?.length > 1 ? true : false;
    switch (this.data.dial) {
      case 'Add':
        this.getUserProfile();
        this.unitPriceLabel = 'Price Budget';
        this.workAreaCondition('work area');
      break;
      case 'Add Variant' :
        this.getUserProfile();
        this.unitPriceLabel = 'Price Add On';
        this.workAreaCondition('work area');
      break;
      case 'Add Sub':
        this.unitPriceLabel = 'Price Budget';
        this.addSubJobData(data);
        this.workAreaCondition('work area');
      break;
      case 'Add Sub Variant' :
        this.unitPriceLabel = 'Price Add On';
        this.addSubJobData(data);
        this.workAreaCondition('variant work');
      break;
      case 'Update' : 
      case 'Work Progress':
        if(!this.disabledChild) this.getUserProfile()
        this.unitPriceLabel = 'Price Budget';
        this.updateWorkAreaDatas(data);  
        this.workAreaCondition('work area');
      break;
      case 'Update Load Details':
        if(this.disabledChild) this.getUserProfile()
        this.unitPriceLabel = 'Price Contract';
        this.updateWorkAreaDatas(data)
        this.workAreaCondition('work area');
      break;
      case 'Edit Variant' :
        if(this.disabledChild) this.getUserProfile();
        this.unitPriceLabel = 'Price Add On';
        this.updateWorkAreaDatas(data)
        this.workAreaCondition('variant work');
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

  workAreaCondition(conds){
    switch (conds) {
      case 'work area' :
      this.workAreaContainer = this.data.work.work_area
      this.unitTypeUsed()
      break;
      case 'variant work' :
      this.workAreaContainer = this.data.work.variant_work
      this.unitTypeUsed()
      break;
    }
  }

  unitTypeUsed() : any {
    if(!this.disabledChild) this.unitType = this.FNCOL.jobUnit;
    else this.unitType = this.FNCOL.subJobUnit;
  }
  
  updateWorkAreaDatas(data){
    this.modelData = data
    const {[this.unitPriceLabel] : unitPrice, jobName, jobNumber, volume} = data
    this.modelData['head'] = `${jobNumber}. ${jobName}`
    this.unitPrice = unitPrice
    if(!unitPrice) return  
    this.originalUnitPrice = unitPrice
    this.totalPrice = unitPrice * volume
    this.unitPrice = this.currencyPipe.transform(this.unitPrice, this.FNCOL.convertCurrency(this.usedCurrency)).split('.')[0] 
    this.totalPrice = this.currencyPipe.transform(this.totalPrice, this.FNCOL.convertCurrency(this.usedCurrency)).split('.')[0] 
  }

  addSubJobData(data) {
    const {jobNumber, jobName, responsible, id, rank, items, category} = data
    this.modelData = {responsible, id, rank, items, category}
    this.modelData['head'] = `${jobNumber}. ${jobName}`
    this.disabledChild = true
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

  addWorkArea(data){
    const isFalsy = (value) => !value
    if(isFalsy(this.workAreaContainer) || isFalsy(this.workAreaContainer[0])) this.workAreaContainer = [];
    const work_area = [
      ...this.workAreaContainer,
      {
        ...data.value,
        id: this.workAreaContainer.length, 
        status : 0,
        progress : 0,
        createdAt : new Date(),
        items : [],
        [this.unitPriceLabel] : parseInt(this.originalUnitPrice)
      }
    ]
    this.uploadData(work_area)
  }

  addSubJob(newData){
    const id = this.modelData.id.toString() + this.modelData?.items.length.toString()
    const reconstructData = { 
      ...newData.value,
      [this.unitPriceLabel] : parseInt(this.originalUnitPrice),
      items : [],
      status : 0,
      progress : 0,
      createdAt : new Date(),
      id
    } 
    this.workAreaContainer =  this.FNCOL.addSubJobData(this.workAreaContainer , reconstructData, this.modelData.id)
    const work_area = this.FNCOL.calculateProgress(id, this.workAreaContainer)
    this.uploadData(work_area)
  }

  updateWorkArea(newData){
    const submitData = newData.value
    const parentId = this.modelData?.id.toString().split('')
    const reconstructData = {
      progress : this.modelData.progress,
      ...submitData,
      lastUpdate : new Date(),
      [this.unitPriceLabel] : parseInt(this.originalUnitPrice)
    }
    this.workAreaContainer = this.FNCOL.updateWorkAreaData(this.workAreaContainer, this.modelData?.id, reconstructData);
    if(parentId?.length == 1) {
      this.rebindingStatusData([this.modelData], submitData); 
      this.uploadData(this.workAreaContainer)
    }
    else if(this.modelData.progress !== reconstructData.progress) {
      const postBody = {
        id_proyek : this.data.id,
        progress : submitData.progress
      }
      let progressId = this.modelData.progressId || []
      this.projectSerivce.updateProgress(postBody)
      .subscribe(({data} : any) => {
        progressId.push(data.id_proyek_report_progress_pekerjaan)
        this.workAreaContainer = this.FNCOL.updateWorkAreaData(this.workAreaContainer, this.modelData?.id, {progressId});
        const work_area = this.FNCOL.calculateProgress(parentId, this.workAreaContainer)
        this.uploadData(work_area)
      })
    }
    else (this.uploadData(this.workAreaContainer))
  }
 
  rebindingStatusData(newData, submitData) {
    newData.forEach(work => {
      const {category = this.modelData.category, rank = this.modelData.rank, responsible = this.modelData.responsible, status = this.modelData.status} = submitData;
      const dataItems = {category, rank, responsible, status};
      this.workAreaContainer = this.FNCOL.updateWorkAreaData(this.workAreaContainer, work?.id, dataItems);
      if(work?.items?.length) this.rebindingStatusData(work.items , submitData);
    })
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
