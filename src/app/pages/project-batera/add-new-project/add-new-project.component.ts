import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NbDateService } from '@nebular/theme';

@Component({
  selector: 'ngx-add-new-project',
  templateUrl: './add-new-project.component.html',
})
export class AddNewProjectComponent implements OnInit {
  orderOriginal = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
    return 0
  }
  objectKeys = Object.keys;
  min: Date;

  constructor(
    protected dateService: NbDateService<Date>,
    private dialogRef: MatDialogRef<AddNewProjectComponent>

  ) { 
    this.min = this.dateService.addMonth(this.dateService.today(), 0);
  }

  ngOnInit(): void {
  }

  close(){
    this.dialogRef.close(); 
  }

  selected = {

    'option1' : 'test',
    'option2' : 'test',
    'option3' : 'test',

  } 

  reportData = {
    "Vessel": {
      type : 'drop-down',
      value : ['Batera Ship 01', 'Batera Ship 01'],
      position : "left"
    },
    "Year Project": {
      type : 'text',
      value : 'Batera Yard 01 ',
      position : "left"
    },
    "Phase": {
      type : 'drop-down',
      value: ['Requisition','In Progress','Finish', 'Evaluation'],
      position : "left"
    },
    "Selected Yard": {
      type : 'text',
      value : 'Batera Yard 01',
      position : "left"
    },
    "Base Currency": {
      type : 'drop-down',
      value : ['*IDR', 'EURO', 'US'],
      position : "left"
    },
    "Off Hire Period": {
      type : 'date range',
      value: ['2 Medium', '1 Hard'],
      position : "right"
    },
    "-Deviation": {
      type : 'date',
      value: '4 days',
      position : "right"
    },
    "-Charter Rate": {
      type : 'price',
      value: '71050000 / day.', 
      subvalue : '1.421.000.000',
      position : "right"
    } ,
    "-Bunker": {
      type : 'price',
      value : '	282000000 / day.',
      subvalue : '1.128.000.000',
      position : "right"
    }, 
    "Repair Period": {
      type: 'date range',
      value : 'Slamet Saputro', 
      position : "right"
    },
    "-In Dock": {
      type : 'date range',
      value : 'pertamana' ,
      position : "right"
    },
    "-Additional Days": {
      type : 'date',
      value : '0 days',
      position : "right"
    } 
  }
}
