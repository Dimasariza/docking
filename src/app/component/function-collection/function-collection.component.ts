import { CurrencyPipe, DatePipe } from "@angular/common";
import { Component, Injectable } from "@angular/core";
import { ProjectService } from "../../pages/project/project.service";

@Injectable({
    providedIn: 'root'
})
@Component({
  selector: 'ngx-function-',
  template : `<div> Function </div>`
})
export class FunctionCollection {
    constructor ( public datePipe : DatePipe,
                  public currency : CurrencyPipe,
                  public projectService : ProjectService, 
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

    reconstructDatas = (status, workDatas = [], newData, parentIndex = null) => {
      const addNewData = () => {
        const id = workDatas.length;
        return [...workDatas, {...newData, items : [], id}]
      }
      // if( !this.arrayNotEmpty(workDatas) ) return addNewData();
      parentIndex = parentIndex?.toString().split('.')
        return workDatas.map((job, index) => {
          if (parentIndex.length > 1 && index == parentIndex[0]) {
            parentIndex = parentIndex.slice(1).join(".")
            return {...job, items: this.reconstructDatas(status, job.items, newData, parentIndex)}
          } 
          else if(index == parentIndex[0]) {
            if (!job.items) job.items = []; 
            const id = newData.id + "." + job.items.length;  
  
            // add sub job
            if(status == 'sub') 
            return {...job, items: [...job.items, {...newData, id, items : []}]} 
  
            // update job data
            else if(status == 'update') 
            return {...job, ...newData}
  
            // delete job
            else if (status == 'delete')
            return null
          } else {
            addNewData();
          }
          return job
        })
        .filter(f => f != null)
    }
  

    addSubJobData = (data, newData, parentIndex) => {
      parentIndex = parentIndex?.toString().split('');
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
        parentIndex = parentIndex?.toString().split('.')
        console.log(parentIndex)
        return data.map((w, i) => {
        if (parentIndex.length > 1 && i == parentIndex[0]) {
            parentIndex = parentIndex.slice(1)
            console.log(parentIndex)
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
        const {unit, category, start, end, responsible, status, lastUpdate, id ,volume, [workItem[1]] : unitPrice = 0} = work 
        const parentId = id.toString().split('.')
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

    arrayNotEmpty = (value) => {
      if(value != null)
      return value?.length && value[0];
      return false;
    } 

    reconstructDataTable({
      workData = [],
      newData,
      sortBy = "id",
      id = '',
      targetIndex = '',
      lastIndex = '',
      status = 'new' // Update or delete (default value for add job)
    } : any) {

      if( !this.arrayNotEmpty(workData) ) {
        id = (id + 0).toString();
        return [{...newData, items : [], id}];
      }
      
      if(targetIndex !== '') targetIndex = targetIndex?.toString().split('.');
      if(lastIndex === '') lastIndex = targetIndex[0];
      else if (lastIndex !== '') lastIndex = lastIndex + '.' + targetIndex[0];

      const work = workData.find(work => work[sortBy] === lastIndex);
      if(!work) {
        id = id + workData.length.toString();
        return [...workData, {...newData, items : [], id}];
      } 

      const parentIndex = workData.indexOf(work);
      if(status == 'delete' && targetIndex.length == 1) {
        workData[parentIndex] = null;
        return workData.filter(f => f != null);
      }

      if(status == 'update' && targetIndex.length == 1)
        workData[parentIndex] = {...work, ...newData}

      if(targetIndex.length > 0 && work) {
        id = (id + parentIndex + '.').toString();
        targetIndex = targetIndex.slice(1).join(".").toString();
        workData[parentIndex].items = this.reconstructDataTable({
          workData : work?.items,
          newData, id,
          sortBy,
          targetIndex,
          lastIndex,
          status
        })
      }
      return workData;
    }

}



class testConstructor {
  

  testdata : any = [
    {
     nama : "roganda",
     age : 18,
     country : "indonesia",
     // id : '0',
   }
 ];

 emptyData = [
   {
     nama : "mr black",
     age : 20,
     country : "argentina",
     id : '0',
     // jobNumber : '1',
     items : [
       {
         nama : "roganda dimas",
         age : 18,
         country : "germany",
         id : '0.0',
         // jobNumber : '1.1',
       },
       {
         nama : "roganda dimas ariza",
         age : 18,
         country : "germany",
         id : '0.1',
         // jobNumber : '1.2',
         items : [{
           age : 18,
           country : "spain",
           id : "0.1.0",
           // jobNumber : '1.2.1',
           items : [],
           nama : "dimas ariza",
         }]
       }
     ]
   }
 ]

 exportExcel = [
   {
     nama : "mr black",
     age : 20,
     country : "argentina",
     jobNumber : '1',
   },
   {
     nama : "roganda dimas",
     age : 18,
     country : "germany",
     jobNumber : '1.1',
   },
   {
     nama : "roganda dimas ariza",
     age : 18,
     country : "germany",
     jobNumber : '1.2',
   },
   {
     country : "spain",
     jobNumber : '1.2.1',
     items : [],
     nama : "dimas ariza",
   }
 ]

 newExportExcel : any = []

 testreconstruct() {
   const newData = {
     nama : "mr black new daata",
     age : 20,
     country : "argentina",
   }

   this.emptyData = this.reconstructDatas({
     workData : this.emptyData,
     newData,
     targetIndex : '0.1.0',
     sortBy : 'id',
     status : 'delete'
   })

   // this.exportExcel.forEach(newData => {
   //   this.newExportExcel = this.reconstructDatas({
   //       workData : this.newExportExcel,
   //       newData,
   //       targetIndex : newData.jobNumber,
   //       sortBy : 'jobNumber' 
   //     })
   // })

   console.log(this.emptyData)
 }

 seeData() {
   console.log(this.exportExcel)
 }

 arrayNotEmpty = (value) => {
   if(value != null)
   return value?.length && value[0];
   return false;
 } 

 reconstructDatas({
   workData = [],
   newData,
   sortBy = "id",
   id = '',
   targetIndex = '',
   lastIndex = '',
   status = 'new' // Update or delete (default value for add job)
 } : any) {

   if( !this.arrayNotEmpty(workData) ) {
     id = (id + 0).toString();
     return [{...newData, items : [], id}];
   }
   
   if(targetIndex !== '') targetIndex = targetIndex?.toString().split('.');
   if(lastIndex === '') lastIndex = targetIndex[0];
   else if (lastIndex !== '') lastIndex = lastIndex + '.' + targetIndex[0];

   const work = workData.find(work => work[sortBy] === lastIndex);
   if(!work) {
     id = id + workData.length.toString();
     return [...workData, {...newData, items : [], id}];
   } 

   const parentIndex = workData.indexOf(work);
   if(status == 'delete' && targetIndex.length == 1) {
     workData[parentIndex] = null;
     return workData.filter(f => f != null);
   }

   if(status == 'update' && targetIndex.length == 1)
     workData[parentIndex] = {...work, ...newData}

   if(targetIndex.length > 0 && work) {
     id = (id + parentIndex + '.').toString();
     targetIndex = targetIndex.slice(1).join(".").toString();
     workData[parentIndex].items = this.reconstructDatas({
       workData : work?.items,
       newData, id,
       sortBy,
       targetIndex,
       lastIndex,
       status
     })
   }
   return workData;
 }


 
  
 testData = [
  {
    nama : "mr black",
    age : 20,
    country : "argentina",
    id : '0',
    items : [
      {
        nama : "roganda dimas",
        age : 18,
        country : "germany",
        id : '0.0',
      },
      {
        nama : "roganda dimas ariza",
        age : 18,
        country : "germany",
        id : '0.1',
        items : [{
          age : 18,
          country : "spain",
          id : "0.1.0",
          items : [],
          nama : "dimas ariza",
        }]
      }
    ]
  },
  {
    nama : "mr black 2",
    age : 30,
    country : "jamaika",
    id : '1',
    items : [{
      nama : "mr black 2.1",
      age : 20,
      country : "zimbabwq",
      id : '1.0',
      items : []
    }]
  }
]

updateData() {
  const newData = {
    age : 20,
    country : "Germany oke oke",
    nama : "dimas ariza blabla bla bla",
  }
  // this.testData = this.commonFunction.reconstructDatas({
  //   workData : this.testData,
  //   newData,
  //   sortBy : "id",
  //   targetIndex : "1.0",
  //   // status : 'update'
  // })
}

}