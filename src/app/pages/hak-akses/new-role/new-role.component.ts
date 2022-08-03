import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-new-role',
  templateUrl: './new-role.component.html',
  styleUrls: ['./new-role.component.scss']
})
export class NewRoleComponent implements OnInit {

  checked = false;

  toggle(checked: boolean) {
    this.checked = checked;
  }

  dataTable = [
    {
      "menu": "Data Master Pegawai"
    },
    {
      "menu": "Data Master Keuangan"
    },
    {
      "menu": "Penjadwalan Kegiatan"
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
