import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


const PROGRESS_DATA = [
  {name: 'Offhire Days', budget: 14.0067, contract : 0,  actual: ''},
  {name: 'Owner Exp', budget: 15.9994, contract : 0,  actual: ''},
  {name: '- Supplies', budget: 18.9984, contract : 0,  actual: ''},
  {name: '- Services', budget: 20.1797, contract : 0,  actual: ''},
  {name: '- Class', budget: 20.1797, contract : 0,  actual: ''},
  {name: '- Other', budget: 20.1797, contract : 0,  actual: ''},
  {name: 'Additional Job', budget: 20.1797, contract : 0,  actual: ''},
  {name: 'Owner Canceled Job', budget: 20.1797, contract : 0,  actual: ''},
  {name: 'Amortization Job', budget: 20.1797, contract : 0,  actual: ''},
  {name: 'Depreciation Job', budget: 20.1797, contract : 0,  actual: ''},
  {name: 'Yard Cost', budget: 20.1797, contract : 0,  actual: ''},
  {name: 'Yard Cancelled Jobs', budget: 20.1797, contract : 0,  actual: ''},
  {name: 'Total Cost', budget: 20.1797, contract : 0,  actual: ''},
];


@Component({
  selector: 'ngx-table-data',
  templateUrl: './table-data.component.html',
  styleUrls: [ './table-data.component.scss'
  ]
})
export class TableDataComponent implements OnInit {

  statusColumn: string[] = ['name', 'Budget', 'Contract', 'Actual'  ];
  progressData = PROGRESS_DATA
  constructor() { }

  ngOnInit(): void {
  }

}
