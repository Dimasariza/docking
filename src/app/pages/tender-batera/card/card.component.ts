import { Component } from '@angular/core';

@Component({
  selector: 'ngx-card',
  templateUrl: './card.component.html',
})
export class CardComponent {
  objectKeys = Object.keys;
  dataTable = {
    'Yard' : '',
    'Currency': '',
    'Offhire	Repair': '',
    'Period (In Dock)': '',
    'Offhire Cost': '',
    'Owner Cost': '',
    'Owner Total Cost': '',
    'Yard Total Contract': '',
    'General Discount': {
      discount : '',
      'After Discount' : '' 
    },
    'Sum Internal Adjusment': ''
  }
}
