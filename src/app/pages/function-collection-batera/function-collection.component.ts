import { DatePipe } from "@angular/common";
import { Injectable } from "@angular/core";
import { take } from "rxjs/operators";
import { HomeBateraService } from "../home-batera/home-batera.service";

@Injectable({
    providedIn: 'root'
})
export class FunctionCollection {
    constructor (public datePipe : DatePipe,
                private homeService : HomeBateraService
      ){}

    category = ["Owner Exp-Supplies", "Services", "Class", "Others", "Owner Canceled Job" ,"Yard cost", "Yard cancelled jobs", "Depreciation Jobs", "Amortization Jobs"]
    rank = ["Critical", "High", "Medium", "Low"]
    jobUnit = ["Lumpsum"]
    subJobUnit = ["Ls", "m2", "m3", "kg", "pcs", "Mtr (meter length)", "Hours", "times", "unit", "unit.Hours", "shift", "Days", "kWh.Days", "Lines.Days", "Person.Days"]
    status = ["Not Started", "In Progress", "Done", "Canceled"]

    Phase: ['requisition','in_progress', 'evaluasi','finish']
    phase: ['Requisition','In Progress', 'Evaluation','Finish']
    BaseCurrency: ['IDR', 'EURO', 'US']

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
        const {volume , unit, category, start, end, responsible}= work  
        return {
          data: {
            ...work,
            ...workItem,
            Start : this.datePipe.transform(start, 'yyyy-MM-dd'),
            Stop : this.datePipe.transform(end, 'yyyy-MM-dd'),
            Unit : unit?.name,
            Category : category?.name,
            Volume : volume?.name,
            Responsible : responsible?.name,
            kind : work.items?.length ? 'dir' : 'doc',
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
}