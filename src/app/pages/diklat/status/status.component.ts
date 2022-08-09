import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'ngx-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {

  @ViewChild('filter') filter: ElementRef

  isHidden = true
  coba() {
    // this.filter.ElementRef.hidden = this.isHidden
    console.log(this.filter)
  }

  data = [
    {
      "npd": "10030",
      "opd": "Dinas Pariwisata",
      "name": "Raden Bagus",
      "time": "1 Agustus 2022",
      "diklat": "Pelatihan SDM",
      "status": "Permintaan baru"
    },
    {
      "npd": "10029",
      "opd": "Dinas Kesehatan",
      "name": "Dwi Rachmawati",
      "time": "31 Juli 2022",
      "diklat": "Pelatihan SDM",
      "status": "Permintaan baru"
    },
    {
      "npd": "10028",
      "opd": "Dinas Pendidikan dan Kebudayaan",
      "name": "Imam Daud Rahim",
      "time": "31 Juli 2022",
      "diklat": "Pelatihan SDM",
      "status": "Permintaan baru"
    },
    {
      "npd": "10027",
      "opd": "Dinas Lingkungan Hidup dan Kehutanan",
      "name": "Rafiq Taufiqur Rahman",
      "time": "31 Juli 2022",
      "diklat": "Pelatihan SDM",
      "status": "Permintaan baru"
    },
    {
      "npd": "10026",
      "opd": "Dinas Sosial",
      "name": "Dwi Rachmawati",
      "time": "28 Juli 2022",
      "diklat": "Pelatihan SDM",
      "status": "Disetujui"
    },
    {
      "npd": "10025",
      "opd": "Dinas Tenaga Kerja dan Transmigrasi",
      "name": "Imam Daud Rahim",
      "time": "28 Juli 2022",
      "diklat": "Pelatihan SDM",
      "status": "Disetujui"
    },
    {
      "npd": "10024",
      "opd": "Dinas Pertanian",
      "name": "Rafiq Taufiqur Rahman",
      "time": "27 Juli 2022",
      "diklat": "Pelatihan SDM",
      "status": "Disetujui"
    },
    {
      "npd": "10023",
      "opd": "Dinas Pertanian",
      "name": "Imam Daud Rahim",
      "time": "26 Juli 2022",
      "diklat": "Pelatihan SDM",
      "status": "Disetujui"
    },
    {
      "npd": "10022",
      "opd": "Dinas Pendidikan dan Kebudayaan",
      "name": "Rafiq Taufiqur Rahman",
      "time": "26 Juli 2022",
      "diklat": "Pelatihan SDM",
      "status": "Disetujui"
    },
    {
      "npd": "10021",
      "opd": "Dinas Lingkungan Hidup dan Kehutanan",
      "name": "Imam Daud Rahim",
      "time": "25 Juli 2022",
      "diklat": "Pelatihan SDM",
      "status": "Disetujui"
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
