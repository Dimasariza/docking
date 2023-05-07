import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, Injectable } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { parse } from 'date-fns';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'ngx-common-function',
  template : ``
})
export class CommonFunction {
  constructor(
    public currency : CurrencyPipe,
    private datepipe: DatePipe,
    private dialogService: NbDialogService,
  ) {  }
  public jobStatus = ['Not Started', 'In Progress', 'Done', 'Canceled']
  public category = ["Supplies", "Services", "Class", "Other", "Additional Job", 
  "Owner Canceled Job", "Variant Job", "Yard Cost", "Yard Cancelled Job"]
  public rank = ["Critical", "High", "Medium", "Low"]
  public jobUnit = [ "Lumpsum", "Ls", "m2", "m3", "kg", "pcs", "Mtr (meter length)", 
  "Hours", "times", "unit", "unit.Hours", "shift", "Days", "kWh.Days", "Lines.Days", "Person.Days"]
  public typeOfDocking = ['annual', 'intermediate', 'special', 'emergency']
  public baseCurrency = ['IDR', 'EURO', 'US']
  public phase = ['requisition','in_progress', 'evaluasi','finish']

  arrayNotEmpty = (value) => {
    if(value !== null)
    return value?.length && value[0];
    return false;
  } 

  reconstructDatas({
    workData = [],
    newData,
    sortBy = "id",
    targetIndex = '',
    lastIndex = '',
    id = '',
    status = 'new' // default value for add job
  } : any) {

    // Add new job
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

    if(targetIndex.length == 1 && lastIndex == workData[parentIndex][sortBy] ) {
      workData[parentIndex] = {...workData[parentIndex], ...work, ...newData};
      return workData;
    }
    
    // if(status == 'update' && targetIndex.length == 1)
    //   workData[parentIndex] = {...work, ...newData}

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

  populateData = (work, expanded = false) => { 
    return work.map(item => ({
        data : {...item, kind : item.items?.length ? 'upper' : 'end'},
        children : item?.items?.length 
        ? this.populateData(item.items, expanded) 
        : [],
        expanded,
    }))
  }

  refillWorkArea(workArea, fillData) {
    return workArea.map(work => {
      if(work.items?.length) 
        work.items = this.refillWorkArea(work.items, fillData)
      return {...work, ...fillData}
    })
  }

  convertToCurrency(currency, ammount) {
    if(!ammount) ammount = 0;
    ammount = this.priceAmount(ammount);
    return this.currency.transform(ammount, `${currency} `, 'symbol','1.0');
  }

  priceAmount(text) {
    if(text) {
      text = text.toString().replace(/\D/g, '');
      text = parseInt(text) 
      return text;
    }
    return 0;
  }

  transformDate(date, format = 'yyyy-MM-dd') {
    return this.datepipe.transform(date , format)
  }

  parseDate(date, format = 'yyyy-MM-dd') {
    return parse(date, format, new Date())
  }

  parseStartEndDate(start, end) {
    return {
      start : this.parseDate(start),
      end : this.parseDate(end),
    }
  }

  rankColor(r){
    if(r == 'Critical') return "marron"
    if(r == 'High') return "red"
    if(r == 'Medium') return "yellow"
    if(r == 'Low') return "green"
    return "grey"
  }

  setPhase(p) {
    if(p == 'requisition') return {R : true, P : false, E : false, F : false};
    if(p == 'in_progress') return {R : true, P : true, E : false, F : false};
    if(p == 'evaluasi') return {R : true, P : true, E : true, F : false};
    if(p == 'finish') return {R : true, P : true, E : true, F : true};
  }

  openDialog({dialogData, component} : any){
    return this.dialogService.open(component, {
      hasBackdrop : true,
      closeOnBackdropClick : false,
      context: {dialogData },
    })
  }
}


@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'ngx-replace-data',
  template : ``
})
export class ReplaceData {
  replace(obj, find, replace, replaceBy = null) {
    const keys = Object.keys(obj);
    for (let key of keys) {
        if(obj[key] == find && replaceBy) {
            obj[replaceBy] = replace;
            break;
        } 
        if(obj[key] == find && !replaceBy) {
            obj[key] = replace;
            break;
        };
        if(typeof obj[key] == 'object') 
        obj[key] = this.replace(obj[key], find, replace, replaceBy)
    }
    return obj;
  }
}

@Injectable({
  providedIn: 'root',
})
export class onHandleEvent {
  public handleEvent : any = {};
  set({show = true, status, text = '', spinner = false} : any) {
    this.handleEvent.show = show;
    this.handleEvent.status = status;
    this.handleEvent.text = text;
    this.handleEvent.spinner = spinner;
    return this.handleEvent;
  }
}