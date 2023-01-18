import { CurrencyPipe } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FunctionCollection } from '../../../function-collection-batera/function-collection.component';



@Component({
  selector: 'ngx-table-data',
  templateUrl: './table-data.component.html',
  styleUrls: [ './table-data.component.scss'
  ]
})
export class TableDataComponent implements OnChanges, OnInit {
  @Input() tableData : any
  statusColumn: string[] = ['name', 'Budget', 'Contract', 'Actual'  ];

  constructor(public FNCOL : FunctionCollection,
              public currency : CurrencyPipe
  ) { }
  progressData : any 

  ngOnInit(): void {
    this.progressData = 
    [
      {name: 'Offhire Days', budget : '', contract : '|', actual : '|'},
      {name: 'Owner Exp', budget : 0, contract : 0, actual : 0},
      {name: '- Supplies', budget : 0, contract : 0, actual : 0},
      {name: '- Services', budget : 0, contract : 0, actual : 0},
      {name: '- Class', budget : 0, contract : 0, actual : 0},
      {name: '- Other', budget : 0, contract : 0, actual : 0},
      {name: 'Additional Job', budget : 0, contract : 0, actual : 0},
      {name: 'Owner Canceled Job', budget : 0, contract : 0, actual : 0},
      // {name: 'Amortization Job', budget : 0, contract : 0, actual : 0},
      {name: 'Variant Job', budget : 0, contract : 0, actual : 0},
      {name: 'Yard Cost', budget : 0, contract : 0, actual : 0},
      {name: 'Yard Cancelled Job', budget : 0, contract : 0, actual : 0},
      {name: 'Total Cost', budget : 0, contract : 0, actual : 0},
    ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    const start = 2;
    const dataLength = this.progressData?.length - start;
    if(!this.tableData?.work_area || this.tableData.work_area[0] === null) return
    this.progressData[0].budget = this.tableData?.off_hire_period + this.tableData?.off_hire_deviasi + ' Days';

      this.tableData?.work_area.forEach(work => {
        const {'Price Budget' : budget = 0,'Price Actual' : actual = 0, 'Price Contract' : contract = 0, category = 0, volume = 0} = work;
        this.progressData[category + start].budget += parseInt(budget) * volume;
        this.progressData[category + start].contract += parseInt(contract) * volume;
        this.progressData[category + start].actual += parseInt(actual) * volume;
      });
      
      for(let i = start ; i <= 5 ; i++) {
        this.progressData[1].budget += this.progressData[i].budget;
        this.progressData[1].contract += this.progressData[i].contract;
        this.progressData[1].actual += this.progressData[i].actual;
      }

      const usedCurrency = this.FNCOL.convertCurrency(this.tableData.mata_uang);
      for(let i = start ; i <= 11 ; i++) {
        this.progressData[dataLength].budget += this.progressData[i].budget;
        this.progressData[dataLength].contract += this.progressData[i].contract;
        this.progressData[dataLength].actual += this.progressData[i].actual;
      }

      const convertCurrency = (price) => {
        for(let i = 1; i <= dataLength; i++) {
          if(this.progressData[i][price] == 0) continue;
          this.progressData[i][price] = this.currency.transform(this.progressData[i][price], usedCurrency);
        }
      }
      convertCurrency('budget')
      convertCurrency('contract')
      convertCurrency('actual')
  }



}
