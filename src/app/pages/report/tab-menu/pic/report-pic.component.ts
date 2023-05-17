import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngx-report-pic',
  templateUrl: './report-pic.component.html',
})
export class PicComponent {
  @Input() responsible : any

  columns = [
    { name: 'No', type : 'index', prop : '', width : 70 },
    { name: 'Nama', type : 'text', prop : 'nama_lengkap', width : 300 },
    { name: 'Title', type : 'text', prop : 'jabatan', width : 200 },
    { name: 'Join Date', type : 'date', prop : 'created_at', width : 300 },
    { name: 'Last Change', type : 'date', prop : 'updated_at', width : 300 },
  ];
}

