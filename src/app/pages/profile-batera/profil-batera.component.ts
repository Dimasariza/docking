import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-profil-batera',
  templateUrl: './profil-batera.component.html',
  styleUrls: ['./profil-batera.component.scss']
})
export class ProfilBateraComponent implements OnInit {
  data = [
    {
      "nama pengguna": "Becky Tumewu",
      "jabatan": "Pembelian & pengadaan",
      "email": "becky.tumewu@gmail.com",
      "mobile phone": "+62 857-3195-9259"
    },
    {
      "nama pengguna": "Abrianto Antok",
      "jabatan": "Teknisi Pengawas Armada",
      "email": "abrianto.icm@gmail.com",
      "mobile phone": "+62 857-3195-9258"
    },
    {
      "nama pengguna": "Andre Sebastian",
      "jabatan": "Pengawas Konstruksi",
      "email": "andre.sebs@gmail.com",
      "mobile phone": "+62 857-3195-9257"
    },
    {
      "nama pengguna": "Dimas Awang",
      "jabatan": "Manager Pengawas Pelayaran",
      "email": "Dimas.awg@gmail.com",
      "mobile phone": "+62 857-3195-9256"
    },
    {
      "nama pengguna": "Risky Trianto",
      "jabatan": "Teknisi Pengawas Armada",
      "email": "risky.tri@gmail.com",
      "mobile phone": "+62 857-3195-9255"
    },
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
