import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { DialogFormComponent } from '../izin-belajar.component';

@Component({
  selector: 'ngx-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

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

  constructor(private dialogService: NbDialogService) { }
  names: string[] = []
  open() {
    this.dialogService.open(DialogFormComponent)
    //   .onClose.subscribe(name => name && this.names.push(name));
  }


  ngOnInit(): void {
  }

}


