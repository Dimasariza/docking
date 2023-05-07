import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngx-report-suplier',
  templateUrl: './report-supplier.html',
})
export class SupplierComponent {
  @Input() suplierData;

  buttons = [
    { name : 'Add Supplier', icon : 'plus-outline'}
  ]

  columns = [
    { name: 'No', type : 'index', width : 70 },
    { name: 'Name', type : 'text', prop : 'nama_supplier', width : 300 },
    { name: 'Address', type : 'text', prop : 'alamat', width : 200 },
    { name: 'Email', type : 'text', prop : 'email', width : 300 },
    { name: 'Contact Number', type : 'text', prop : 'no_hp', width : 300 },
    { name : '', type : 'button', width : 150, unSort : true,
      button :  [ 
          {icon : 'edit-outline', menu : 'Edit Supplier', status : 'success'}, 
          {icon : 'trash-2-outline', menu : 'Delete Supplier', status : 'danger'},
      ], 
    },
  ];

  handleClickButton(button, data) {
    console.log('button', button)
    console.log('data', data)
    if(button == 'Add Supplier') console.log(button)
  }
}