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
      value : ['Batera Ship 01', 'Batera Ship 01'],
    },
    "Year Project": {
      value : 'Batera Yard 01 ',
    },
    "Phase": {
      value: ['Requisition','In Progress','Finish', 'Evaluation'],
    },
    "Selected Yard": {
      value : 'Batera Yard 01',
    },
    "BaseCurrency": {
      value : ['*IDR', 'EURO', 'US'],
    },
    "responsible" : {
      value : [ 'SM', 'MT', 'BP' ]
    },
    "Off Hire Period": {
      value: ['2 Medium', '1 Hard'],
    },
    "-Deviation": {
      value: '4 days',
    },
    "-Charter Rate": {
      value: '71050000 / day.', 
      subvalue : '1.421.000.000',
    } ,
    "-Bunker": {
      value : '	282000000 / day.',
      subvalue : '1.128.000.000',
    }, 
    "Repair Period": {
      value : 'Slamet Saputro', 
    },
    "-In Dock": {
      value : 'pertamana' ,
    },
    "-Additional Days": {
      value : '0 days',
    } 
  }
}
