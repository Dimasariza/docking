import { Component, OnInit } from '@angular/core';

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
                  <button class="btn btn-primary btn-sm btn-action">AJUKAN IZIN</button>
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
    {
      "name": "ITS",
      "time": "FTK / Teknik Kelautan",
      "place": "Surabaya",
      "status": "4 Tahun",
      "pendidikan": "S1"
    },
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

  constructor() { }

  ngOnInit(): void {
  }

}
