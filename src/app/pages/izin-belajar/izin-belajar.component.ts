import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';

@Component({
  selector: 'ngx-izin-belajar',
  template: `
    <div class="row">
    <div class="col-xxl-5">
      <div class="row">
        <div class="col-12">
          <nb-card>
            <nb-card-body class="d-flex bg-info">
              <div class="photo col-3">
                <img src="../../../assets/images/nick.png" alt="Nick" width="200">
              </div>
              <div class="title col-9" style="color: white;">
                <h4>SELAMAT DATANG,</h4>
                <h2>ACHMAD FEBRIAN BAGUS PANGESTU</h2>
                <p>Minggu, 20 Mei 2022</p>
                <span>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusamus quod dolor sit.</span>
              </div>
            </nb-card-body>
          </nb-card>
        </div>
      </div>

      <nb-card>
        <div *ngIf= "data.length !== 0">
        <nb-card-body >
          <ngx-datatable 
              [class]="'bootstrap'" 
              [rows]="data" 
              [count]="data.length"
              [scrollbarH]="true"
              columnMode="force"
              default>
              <ngx-datatable-column [name]="'No'" [width]="50">
                  <ng-template let-row="row" let-rowIndex="rowIndex" ngx-datatable-cell-template>
                      #{{rowIndex+1}}
                  </ng-template>
              </ngx-datatable-column>
              <ngx-datatable-column [name]="'Perguruan Tinggi'" prop="name"></ngx-datatable-column>
              <ngx-datatable-column [name]="'Fakultas / Jurusan'" prop="time"></ngx-datatable-column>
              <ngx-datatable-column [name]="'Jenjang Pendidikan'" prop="pendidikan"></ngx-datatable-column>
              <ngx-datatable-column [name]="'Lokasi'" prop="place"></ngx-datatable-column>
              <ngx-datatable-column [name]="'Lama Pendidikan'" prop="status"></ngx-datatable-column>
              <ngx-datatable-column [name]="'Keterangan'">
              <ng-template let-row="row" let-rowIndex="rowIndex" ngx-datatable-cell-template>
                        <div class="d-flex">
                            <button class="btn btn-primary btn-sm btn-action">ACTION</button>
                        </div>
                    </ng-template>
              </ngx-datatable-column>
          </ngx-datatable>
        </nb-card-body>
        </div>
        <div *ngIf= "data.length == 0">
        <nb-card-body >
          <ngx-datatable 
              [class]="'bootstrap'" 
              [rows]="message" 
              [count]="data.length"
              [scrollbarH]="true"
              columnMode="force"
              default>
              <ngx-datatable-column [name]="'KETERANGAN'" prop="pesan"></ngx-datatable-column>
              <ngx-datatable-column name="AKSI">
                <ng-template let-row="row" let-rowIndex="rowIndex" ngx-datatable-cell-template>
                <button nbButton status="primary" (click)="open()">AJUKAN IZIN</button>
                </ng-template>
              </ngx-datatable-column>
          </ngx-datatable>
        </nb-card-body>
        </div>
      </nb-card>
    </div>
  </div>
  `,
  styleUrls: ['./izin-belajar.component.scss']
})
export class IzinBelajarComponent implements OnInit {

  message = [
    {
      "pesan": "Anda belum mengajukan izin belajar"
    }
  ]

  data = [
    // {
    //   "name": "ITS",
    //   "time": "FTK / Teknik Kelautan",
    //   "place": "Surabaya",
    //   "status": "4 Tahun",
    //   "pendidikan": "S1"
    // },
    // {
    //   "name": "Claudine Neal",
    //   "time": "13200921921",
    //   "place": "Blended Learning",
    //   "status": "DITERIMA",
    //   "pendidikan": "S1"
    // },
    // {
    //   "name": "Beryl Rice",
    //   "time": "13200921921",
    //   "place": "Blended Learning",
    //   "status": "DITOLAK",
    //   "pendidikan": "D3"
    // },
    // {
    //   "name": "Wilder Gonzales",
    //   "time": "13200921921",
    //   "place": "Blended Learning",
    //   "status": "DITOLAK",
    //   "pendidikan": "S1"
    // },
    // {
    //   "name": "Georgina Schultz",
    //   "time": "13200921921",
    //   "place": "Blended Learning",
    //   "status": "DITERIMA",
    //   "pendidikan": "D3"
    // },
    // {
    //   "name": "Carroll Buchanan",
    //   "time": "13200921921",
    //   "place": "Blended Learning",
    //   "status": "DITERIMA",
    //   "pendidikan": "D3"
    // },
    // {
    //   "name": "Valarie Atkinson",
    //   "time": "13200921921",
    //   "place": "Blended Learning",
    //   "status": "DITOLAK",
    //   "pendidikan": "S1"
    // }
  ]

  constructor(private dialogService: NbDialogService) { }
  names: string[] = []
  open() {
    // this.scroll(true)
    this.dialogService.open(DialogFormComponent)
      .onClose.subscribe(name => name && this.names.push(name));
  }

  // protected scroll(hasScroll: boolean) {
  //   this.dialogService.open(DialogFormComponent, {hasScroll})
  // }
  ngOnInit(): void {
  }

}

@Component ({
  selector: 'ngx-dialog-form',
  template: `
    <nb-card>
      <nb-card-header>Upload Berkas</nb-card-header>
      <nb-card-body class="d-inline-block">
        <div *ngFor="let file of files">
          <label [for]=file.id class="btn">{{ file.nama }}
          <nb-icon icon="cloud-upload-outline"></nb-icon>
          <input class="w-100" [id]=file.id type="file" #name nbInput fullWidth fieldSize="small">
          </label>
        </div>
      </nb-card-body>
      <nb-card-footer>
        <button class="cancel" nbButton status="danger" (click)="cancel()">Cancel</button>
        <button nbButton status="success" (click)="submit(name.nativeElement.files[0].name)">Submit</button>
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
    {
      nama: 'FC Ijazah Terakhir',
      id: 'fc-ijazah'
    },
    {
      nama: 'Surat Pernyataan Bermaterai',
      id: 'sura-pernyataan'
    },
    {
      nama: 'Surat Keterangan Calon Mahasiswa',
      id: 'sk-mhs'
    },
    {
      nama: 'Rencana Jadwal Kuliah',
      id: 'jadwal'
    },
    {
      nama: 'Surat Keterangan Program Studi Sudah Berakreditasi Minimal B',
      id: 'sk-prodi'
    }
  ]
}
