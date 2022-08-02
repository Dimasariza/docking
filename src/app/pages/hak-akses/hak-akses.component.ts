import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-hak-akses',
  templateUrl: './hak-akses.component.html',
  styleUrls: ['./hak-akses.component.scss']
})
export class HakAksesComponent implements OnInit {

  dataTable = [
    {
      "name": "Admin",
      "deskripsi": "Manage semua data dan administrasi pegawai pada sistem"
    },
    {
      "name": "Penyelenggara",
      "deskripsi": "Manage penyelenggaraan acara untuk instansi"
    },
    {
      "name": "Kepegawaian ODP",
      "deskripsi": "Manage administrasi pegawai"
    },
    {
      "name": "Pegawai",
      "deskripsi": "Manage personal data"
    }
  ]

  user = [
    {
      "name": "Data Master Pegawai"
    },
    {
      "name": "Data Master Keuangan"
    },
    {
      "name": "Penjadwalan Diklat"
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
