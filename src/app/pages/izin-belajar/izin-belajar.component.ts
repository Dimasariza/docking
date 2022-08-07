import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';

@Component({
  selector: 'ngx-izin-belajar',
  template: `
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./izin-belajar.component.scss']
})
export class IzinBelajarComponent implements OnInit {

  message = [
    {
      "pesan": "Anda belum mengajukan izin belajar"
    }
  ]


  ngOnInit(): void {
  }

}

@Component ({
  selector: 'ngx-dialog-form',
  template: `
    <nb-card>
      <nb-card-header class="text-primary">Upload Surat Reomendasi</nb-card-header>
      <nb-card-body class="d-inline-block">
        <div>
          <p class="label">Attach Document</p>
          <div class="drag-file" style="width: 30vw; height: 40vh; background-color: #E5E5E5;">
            <p class="label text-center" style="line-height: 40vh;">Drop file here</p>  
          </div>
          <p class="label" style="font-size: .8rem;">Format file harus berbentuk .pdf</p>
        </div>
      </nb-card-body>
      <nb-card-footer class="d-flex justify-content-end">
        <button nbButton status="primary" (click)="submit(name.nativeElement.files[0].name)">Submit</button>
      </nb-card-footer>
    </nb-card>
  `,
  styleUrls: ['./izin-belajar.component.scss']
})

export class DialogFormComponent {
  @ViewChild('name') name: ElementRef
  constructor(protected ref: NbDialogRef<DialogFormComponent>) {}

  cancel() {
    this.ref.close();
  }

  submit(name) {
    this.ref.close(name);
    console.log(name)
  }

  files = [
    {
      nama: 'SK CPNS',
      id: 'sk-cpns'
    },
    {
      nama: 'SK PNS',
      id: 'sk-pns'
    },
    {
      nama: 'SK Pangkat',
      id: 'sk-pangkat'
    },
    {
      nama: 'SKP 2 Tahun Terakhir',
      id: 'skp'
    },
    // {
    //   nama: 'FC Ijazah Terakhir',
    //   id: 'fc-ijazah'
    // },
    // {
    //   nama: 'Surat Pernyataan Bermaterai',
    //   id: 'sura-pernyataan'
    // },
    // {
    //   nama: 'Surat Keterangan Calon Mahasiswa',
    //   id: 'sk-mhs'
    // },
    // {
    //   nama: 'Rencana Jadwal Kuliah',
    //   id: 'jadwal'
    // },
    // {
    //   nama: 'Surat Keterangan Program Studi Sudah Berakreditasi Minimal B',
    //   id: 'sk-prodi'
    // }
  ]
}
