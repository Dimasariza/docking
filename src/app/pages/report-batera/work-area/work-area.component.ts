import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProfileBateraService } from '../../profile-batera/profil-batera.service';
import { ReportBateraService } from '../report-batera.service';

@Component({
  selector: 'ngx-work-area',
  templateUrl: './work-area.component.html',
  styles: [
  ]
})
export class WorkAreaComponent implements OnInit {
  constructor(private dialogRef: MatDialogRef<WorkAreaComponent>,
              private datepipe : DatePipe,
              private reportService : ReportBateraService,
              private profileService : ProfileBateraService,
              @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
  onSuccess : EventEmitter<any> = new EventEmitter<any>()

  totalPrice = 0
  category = ["Owner Exp- Supplies", "Services", "Class", "Others" ,"Yard cost", "Yard cancelled jobs"]
  rank = ["Critical", "High", "Medium", "Low"]
  unitType = [["Lumpsum"], ["Ls", "m2", "m3", "kg", "pcs", "Mtr (meter length)", "Hours", "times", "unit", "unit.Hours", "shift", "Days", "kWh.Days", "Lines.Days", "Person.Days"]]
  responsible = []
  variantWorkContainer : any = []
  project_id : any
  modelData : any = {}

  ngOnInit(): void {
    this.variantWorkContainer = this.data.data.variant_work
    this.project_id = this.data.data.id_proyek
    const data = this.data.subData?.data
      switch (this.data.dial) {
        case 'Add':
          this.unitType = this.unitType.filter((v, i) => i == 0)
          break;
        case 'Add Sub Variant':
          this.unitType = this.unitType.filter((v, i) => i == 1)
          this.modelData['head'] = `${data['Job No']}. ${data.Job}` 
          this.modelData.id = data.id
        break;
        case 'Edit Variant' :
          const parentId = data?.id.toString().split('')
          parentId.length === 1 ?
          this.unitType = this.unitType.filter((v, i) => i == 0) :
          this.unitType = this.unitType.filter((v, i) => i == 1)
          this.modelData = data
          this.modelData['head'] = `${data['Job No']}. ${data.Job}`
        break;
    }

    this.profileService.getUserData(1, 10, '', "shipyard", '')
    .subscribe(({data} : any) => {
      this.responsible =
      data.map(user => ({
          name : user.username,
          id: user.id_user
        }))
    })
  }

  workAreaBtn(newData){
    const {dial} = this.data
    switch(dial) {
      case 'Add Variant' :
        console.log("add")
        this.addVariantWorkaData(newData)
        break
      case 'Edit Variant' :
        this.updateVariantWorkData(newData)
        break
      case 'Add Sub Variant' :
        this.addSubVariantData(newData)
        break;
    }
  }

  addVariantWorkaData(newData){
    let submitData = newData.value
    this.variantWorkContainer === null ||
    this.variantWorkContainer === undefined ||
    this.variantWorkContainer[0] === null ? this.variantWorkContainer = [] : null
    submitData = {...submitData , 
      start : this.datepipe.transform(submitData.start, 'yyyy-MM-dd'),
      end : this.datepipe.transform(submitData.end, 'yyyy-MM-dd'),
      category : submitData.category.toLowerCase(),
      responsible : submitData.responsible,
      id: this.variantWorkContainer.length, 
      type : "pekerjaan"
    }
    this.submitData([
      ...this.variantWorkContainer,
      submitData
    ])
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

  updateVariantWorkData(newData){
    let parentIndex = this.modelData?.id.toString().split('')
    const variant_work = this.updateWorkAreaData(this.variantWorkContainer, parentIndex, newData.value)
    this.submitData(variant_work)
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

  addSubVariantData(newData){
    let submitData = {...newData.value, 
      start : this.datepipe.transform(newData.value.start, 'yyyy-MM-dd'),
      end : this.datepipe.transform(newData.value.end, 'yyyy-MM-dd')
    } 
    let parentIndex = this.modelData?.id.toString().split('')
    const variant_work = this.addSubJobData(this.variantWorkContainer, submitData, parentIndex)
    this.submitData(variant_work)
  }

  submitData(variant_work){
    this.reportService.updateVarianWork({variant_work}, this.project_id)
    .subscribe(() => {
      this.onSuccess.emit()
      this.close()
    })
  }

  close(){ this.dialogRef.close();}
}
