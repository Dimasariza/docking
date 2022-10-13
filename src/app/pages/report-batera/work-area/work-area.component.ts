import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'ngx-work-area',
  templateUrl: './work-area.component.html',
  styles: [
  ]
})
export class WorkAreaComponent implements OnInit {
  constructor(private dialogRef: MatDialogRef<WorkAreaComponent>,
              private datepipe : DatePipe,
              @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
  onSuccess : EventEmitter<any> = new EventEmitter<any>()

  totalPrice = 0
  category = ["Owner Exp- Supplies", "Services", "Class", "Others" ,"Yard cost", "Yard cancelled jobs"]
  rank = ["Critical", "High", "Medium", "Low"]
  unitType = [["Lumpsum"], ["Ls", "m2", "m3", "kg", "pcs", "Mtr (meter length)", "Hours", "times", "unit", "unit.Hours", "shift", "Days", "kWh.Days", "Lines.Days", "Person.Days"]]
  responsible = []
  variantWorkContainer : any = []
  modelData : any = {}

  ngOnInit(): void {
    const {variant_work} = this.data.data
    this.variantWorkContainer = variant_work
    this.modelData = this.data.subData.data
    this.modelData.head = `${this.modelData.jobNumber}.${this.modelData.jobName}` 
  }

  workAreaBtn(newData){
    const {dial} = this.data
    switch(dial) {
      case 'Add' :
        console.log("add")
        this.addVariantWorkaData(newData)
        break
      case 'Update' :
        console.log("update")
        break
    }
  }

  addVariantWorkaData(newData){
    console.log(newData)
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

    console.log({variant_work : [
      ...this.variantWorkContainer,
      submitData
    ]})
  }

  updateVariantWorkData(newData){
    console.log(newData)
  }


  close(){ this.dialogRef.close();}

}
