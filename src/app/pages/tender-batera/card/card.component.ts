import { Component } from '@angular/core';

@Component({
  selector: 'ngx-card',
  templateUrl: './card.component.html',
})
export class CardComponent {
  objectKeys = Object.keys;
  dataTable = {
    'Currency': 'IDA*',
    'Offhire	Repair': '19 Days',
    'Period (In Dock)': '13 Days',
    'Offhire Cost': '2.759.920.000',
    'Owner Cost': '2.412.000.000',
    'Owner Total Cost': '4.171.950.000',
    'Yard Total Quote': '4.560.753.000',
    'General Discount 15%': '-684.000.000',
    'Additional Discount': '0',
    'Sum Internal Adjusment': '811.000.000'
  }

}
