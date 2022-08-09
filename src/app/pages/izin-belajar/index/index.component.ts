import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  data = [
    {
      "npb": "10030",
      "opd": "Dinas Pariwisata",
      "name": "Raden Bagus",
      "time": "1 Agustus 2022",
      "nip": "13052656659656",
      "status": "Permintaan baru"
    },
    {
      "npb": "10029",
      "opd": "Dinas Kesehatan",
      "name": "Dwi Rachmawati",
      "time": "31 Juli 2022",
      "nip": "13052656659656",
      "status": "Permintaan baru"
    },
    {
      "npb": "10028",
      "opd": "Dinas Pendidikan dan Kebudayaan",
      "name": "Imam Daud Rahim",
      "time": "31 Juli 2022",
      "nip": "13052656659656",
      "status": "Permintaan baru"
    },
    {
      "npb": "10027",
      "opd": "Dinas Lingkungan Hidup dan Kehutanan",
      "name": "Rafiq Taufiqur Rahman",
      "time": "31 Juli 2022",
      "nip": "13052656659656",
      "status": "Permintaan baru"
    },
    {
      "npb": "10026",
      "opd": "Dinas Sosial",
      "name": "Dwi Rachmawati",
      "time": "28 Juli 2022",
      "nip": "13052656659656",
      "status": "Disetujui"
    },
    {
      "npb": "10025",
      "opd": "Dinas Tenaga Kerja dan Transmigrasi",
      "name": "Imam Daud Rahim",
      "time": "28 Juli 2022",
      "nip": "13052656659656",
      "status": "Disetujui"
    },
    {
      "npb": "10024",
      "opd": "Dinas Pertanian",
      "name": "Rafiq Taufiqur Rahman",
      "time": "27 Juli 2022",
      "nip": "13052656659656",
      "status": "Disetujui"
    },
    {
      "npb": "10023",
      "opd": "Dinas Pertanian",
      "name": "Imam Daud Rahim",
      "time": "26 Juli 2022",
      "nip": "13052656659656",
      "status": "Disetujui"
    },
    {
      "npb": "10022",
      "opd": "Dinas Pendidikan dan Kebudayaan",
      "name": "Rafiq Taufiqur Rahman",
      "time": "26 Juli 2022",
      "nip": "13052656659656",
      "status": "Disetujui"
    },
    {
      "npb": "10021",
      "opd": "Dinas Lingkungan Hidup dan Kehutanan",
      "name": "Imam Daud Rahim",
      "time": "25 Juli 2022",
      "nip": "13052656659656",
      "status": "Disetujui"
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
