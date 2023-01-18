import { CurrencyPipe, DatePipe } from "@angular/common";
import { Component, Injectable } from "@angular/core";
import { ProjectBateraService } from "../project-batera/project-batera.service";

@Injectable({
    providedIn: 'root'
})
@Component({
  selector: 'ngx-function-batera',
  template : `<div> Function </div>`
})
export class FunctionCollection {
    constructor ( public datePipe : DatePipe,
                  public currency : CurrencyPipe,
                  public projectService : ProjectBateraService, 
      ){}
    category = ["Supplies", "Services", "Class", "Other", "Additional Job", "Owner Canceled Job", "Variant Job", "Yard Cost", "Yard Cancelled Job"]
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
      parentIndex = parentIndex?.toString().split('')
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
        const {unit, category, start, end, responsible, status, lastUpdate, id ,volume, [workItem[1]] : unitPrice } = work  
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
            [`Unit ${workItem[1]}`] : this.currency.transform(unitPrice, this.convertCurrency(workItem[0])),
            [`Total ${workItem[1]}`] : this.currency.transform(unitPrice * volume, this.convertCurrency(workItem[0])),
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

    convertStatus (stat) {
      switch(stat) {
        case 'normal' :
          stat = 'IN'
        break;
        case 'standard':
          stat = 'SP'
        break;
        case 'emergency':
          stat = 'ESC'
        break;
      }
      return stat
    }

    convertCurrency(curr) {
      switch(curr) {
        case 'IDR':
          curr = 'Rp ';
        break;
        case 'EURO':
          curr = '€ ';
        break;
        case 'US':
          curr = '$ ';
        break;
      }
      return curr
    }
    
    calculateProgress(parentId, work) {
      parentId = parentId.toString().split('');
      parentId.pop();
      parentId = parentId.join('').replace(',', '');;
      let totalProgress = 0;
      const works = work.find(w => w.id.toString() === parentId.toString() );
      works?.items.forEach(work => totalProgress += work.progress);
      totalProgress = totalProgress / works?.items?.length;
      if(Number(totalProgress) === totalProgress && totalProgress % 1 !== 0)
      totalProgress = parseFloat(totalProgress?.toFixed(3));
      work = this.updateWorkAreaData(work, parentId, {progress : totalProgress});
      parentId = parentId.toString().split('')
      if(parentId.length > 1) this.calculateProgress(parentId, work);
      return work
    }

    minimal( a, b) {
      if(a<b) return a;
      else if(a==b) return a;
      else return b;
    }
}

