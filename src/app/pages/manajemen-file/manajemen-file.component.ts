import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-manajemen-file',
  templateUrl: './manajemen-file.component.html',
  styleUrls: ['./manajemen-file.component.scss']
})
export class ManajemenFileComponent implements OnInit {

  dataTable = [
    {
      "name": "SK CPNS",
      "icon": "edit-outline",
      "button": "Edit"
    },
    {
      "name": "SK PNS",
      "icon": "edit-outline",
      "button": "Edit"
    },
    {
      "name": "SK Pangkat Terakhir",
      "icon": "edit-outline",
      "button": "Edit"
    },
    {
      "name": "SKP 2 Tahun Terakhir",
      "icon": "edit-outline",
      "button": "Edit"
    },
    {
      "name": "FC Ijazah Terakhir",
      "icon": "edit-outline",
      "button": "Edit"
    },
    {
      "name": "Surat Pernyataan Bermaterai",
      "icon": "cloud-upload-outline",
      "button": "Upload"
    },
    {
      "name": "Surat Keterangan sebagai Mahasiswa",
      "icon": "cloud-upload-outline",
      "button": "Upload"
    },
    {
      "name": "Rencana Jadwal Kuliah",
      "icon": "cloud-upload-outline",
      "button": "Upload"
    },
    {
      "name": "Surat Keterangan Akreditasi Prodi",
      "icon": "cloud-upload-outline",
      "button": "Upload"
    },
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
