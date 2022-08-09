import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  dataTable = [
    {
      "nip": "13052656659656",
      "user": "rusli.rahmawan",
      "email": "rusli.rahmawan@bkd.go.id",
      "role": "Admin",
      "status": "Aktif"
    },
    {
      "nip": "13052656659656",
      "user": "rahmatul.khasanah",
      "email": "rahmatul.khasanah@bkd.go.id",
      "role": "Pegawai",
      "status": "Aktif"
    },
    {
      "nip": "13052656659656",
      "user": "endang.susilowati",
      "email": "endang.susilowati@bkd.go.id",
      "role": "Penyelenggara",
      "status": "Aktif"
    },
    {
      "nip": "13052656659656",
      "user": "budi.darmawan",
      "email": "budi.darmawan@bkd.go.id",
      "role": "Kepegawaian ODP",
      "status": "Aktif"
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
