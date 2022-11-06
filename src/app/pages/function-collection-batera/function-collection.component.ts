import { CurrencyPipe, DatePipe } from "@angular/common";
import { Component, Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
@Component({
  selector: 'ngx-function-batera',
  template : `<div> Function </div>`
})
export class FunctionCollection {
    constructor (public datePipe : DatePipe,
                public currency : CurrencyPipe
      ){}
    category = ["Supplies", "Services", "Class", "Other", "Additional Job", "Owner Canceled Job", "Amortization Job", "Depreciation Job", "Yard Cost", "Yard Cancelled Job"]
    rank = ["Critical", "High", "Medium", "Low"]
    jobUnit = ["Lumpsum"]
    subJobUnit = ["Ls", "m2", "m3", "kg", "pcs", "Mtr (meter length)", "Hours", "times", "unit", "unit.Hours", "shift", "Days", "kWh.Days", "Lines.Days", "Person.Days"]
    status = ["Not Started", "In Progress", "Done", "Canceled"]
    Phase: ['requisition','in_progress', 'evaluasi','finish']
    BaseCurrency: ['IDR', 'EURO', 'US']

    convertPhase(phase) {
      switch(phase){
        case 'requisition' :
          phase = 'Requisition'
          break;
        case 'in_progress' :
          phase = 'In Progress'
          break;
        case 'evaluasi' :
          phase = 'Evaluation'
          break;
        case 'finish' :
          phase = 'Finish'
          break;
      }
      return phase
    }

    reconstructData = (data, parentIndex) => {
        return data.map((w, i) => {
          if (parentIndex.length > 1 && i == parentIndex[0]) {
            parentIndex = parentIndex.slice(1)
            return {...w, items: this.reconstructData(w.items, parentIndex)}
          } else if(i == parentIndex[0]) {
            return null
          }
          return w
        })
        .filter(f => f != null)
    }

    addSubJobData = (data, newData, parentIndex) => {
      parentIndex= parentIndex?.toString().split('')
      return data.map((w, i) => {
        if (parentIndex.length > 1 && i == parentIndex[0]) {
          parentIndex = parentIndex.slice(1)
          return {...w, items: this.addSubJobData(w.items, newData, parentIndex)}
        } else if(i == parentIndex[0]) {
          if (!w.items) w.items = []          
          return {...w, items: [...w.items, {...newData}]}
        }
        return w
      })
    }

    updateWorkAreaData =  (data, parentIndex, newData) => {
        parentIndex = parentIndex?.toString().split('')
        return data.map((w, i) => {
        if (parentIndex.length > 1 && i == parentIndex[0]) {
            parentIndex = parentIndex.slice(1)
            return {...w, items: this.updateWorkAreaData(w.items, parentIndex, newData)}
        } else if(i == parentIndex[0]) {
            let item
            w?.items ? item = w.items : item = []
            return {...w, ...newData, items : item}
        }
        return w
        })
    }
    
    populateData = (work, workItem, expand) => { 
        const {unit, category, start, end, responsible, status, lastUpdate, id ,volume, 'Price Budget' : budgetPrice }= work  
        const parentId = id.toString().split('')
        let useUnit = parentId.length == 1 ? this.jobUnit : this.subJobUnit
        return {
          data: {
            ...work,
            start : new Date(start),
            end : new Date(end),
            Start : this.datePipe.transform(start, 'dd-MM-yyyy'),
            Stop : this.datePipe.transform(end, 'dd-MM-yyyy'),
            Unit : useUnit[unit],
            Category : this.category[category],
            Responsible : responsible?.name,
            Status : this.status[status],
            kind : work.items?.length ? 'dir' : 'doc',  
            Update : this.datePipe.transform(lastUpdate, 'dd-MM-yyyy'),
            Volume : volume,
            [workItem[1]] : this.currency.transform(budgetPrice, this.convertCurrency(workItem[0])),
            [workItem[2]] : this.currency.transform(budgetPrice * volume, this.convertCurrency(workItem[0])),
          },
          children: 
          work === null || work === undefined ? null :
          work.items?.length ? work.items.map(child => this.populateData(child, workItem, expand)) : [],
          expanded : expand
        }
    }

    rankColor(rank){
        let rankStatus 
        switch (rank){
          case 0 :
            rankStatus = "maroon"
          break
          case 1 :
            rankStatus = "red"
          break
          case 2 :
            rankStatus = "yellow"
          break
          case 3:
            rankStatus = "green"
          break
          default :
            rankStatus = "grey"
          break
        }
        return rankStatus
    }

    phasesStatus(status){
        if(status === 'requisition'){
          status = [true, false, false, false]
        }
        if(status === 'in_progress'){
          status = [true, true, false, false]
        } 
        if(status === 'evaluasi'){
          status = [true, true, true, false]
        }
        if(status === 'finish'){
          status = [true, true, true, true]
        }
        return status
    }

    convertCurrency(curr) {
      switch(curr) {
        case 'IDR':
          curr = 'Rp '
        break;
        case 'EURO':
          curr = '€ '
        break;
        case 'US':
          curr = '$ '
        break;
      }
      return curr
    }

    minimal( a, b) {
      if(a<b) return a;
      else if(a==b) return a;
      else return b;
    }
}

