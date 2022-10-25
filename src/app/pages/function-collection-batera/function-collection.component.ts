import { DatePipe } from "@angular/common";
import { Injectable, NgModule } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class FunctionCollection {
    constructor (public datePipe : DatePipe,
      ){}

    category = ["Supplies", "Services", "Class", "Other", "Additional Job", "Owner Canceled Job", "Amortization Job", "Depreciation Job", "Yard Cost", "Yard Cancelled Job"]
    rank = ["Critical", "High", "Medium", "Low"]
    jobUnit = ["Lumpsum"]
    subJobUnit = ["Ls", "m2", "m3", "kg", "pcs", "Mtr (meter length)", "Hours", "times", "unit", "unit.Hours", "shift", "Days", "kWh.Days", "Lines.Days", "Person.Days"]
    status = ["Not Started", "In Progress", "Done", "Canceled"]

    Phase: ['requisition','in_progress', 'evaluasi','finish']
    phase: ['Requisition','In Progress', 'Evaluation','Finish']
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

    populateData = (work, workItem) => {  
        const {unit, category, start, end, responsible, status, last_update, rank}= work  
        return {
          data: {
            ...work,
            ...workItem,
            Start : this.datePipe.transform(start, 'dd-MM-yyyy'),
            Stop : this.datePipe.transform(end, 'dd-MM-yyyy'),
            Unit : unit?.name,
            Category : category?.name,
            Responsible : responsible?.name,
            Status : status?.name,
            kind : work.items?.length ? 'dir' : 'doc',  
            Rank : rank?.name,
            update : this.datePipe.transform(last_update, 'dd-MM-yyyy'),
          },
          children: 
          work === null || work === undefined ? null :
          work.items?.length ? work.items.map(child => this.populateData(child, workItem)) : []
        }
    }

    rankColor(rank){
        let rankStatus 
        switch (rank){
          case "Critical" :
            rankStatus = "maroon"
          break
          case "High" :
            rankStatus = "red"
          break
          case "Medium" :
            rankStatus = "yellow"
          break
          case "Low":
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
