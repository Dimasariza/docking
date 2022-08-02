import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-status',
  template: `
  <div class="row">
    <div class="col-xxl-5">
      <nb-card>
        <nb-card-body class="d-flex justify-content-between align-items-baseline">
          <div class="header-title">
            <h6>Daftar Pengajuan Diklat Individu</h6>
            <p style="font-size: .7rem;">Tabel berikut memuat daftar permintaan diklat individu oleh pegawai untuk direview dan disetujui oleh petugas yang berwenang</p>
          </div>
          <div>
            <a routerLink="/pages/diklat/diklat-individu" class="mr-3 text-muted" style="font-size: .8rem; text-decoration: none;">Filter</a>
            <button nbButton status="primary" size="small">Download <nb-icon icon="download-outline"></nb-icon> </button>
          </div>
        </nb-card-body>
        <nb-card-body>
          <ngx-datatable 
              [class]="'bootstrap'" 
              [rows]="data" 
              [count]="data.length"
              [scrollbarH]="true"
              columnMode="force"
              default>
              <ngx-datatable-column [name]="'NPD'" prop="npd" [width]="50"></ngx-datatable-column>
              <ngx-datatable-column [name]="'Diklat'" prop="diklat"></ngx-datatable-column>
              <ngx-datatable-column [name]="'OPD'" prop="opd" width="300"></ngx-datatable-column>
              <ngx-datatable-column [name]="'Pemohon'" prop="name" width="200"></ngx-datatable-column>
              <ngx-datatable-column [name]="'Tanggal'" prop="time"></ngx-datatable-column>
              <ngx-datatable-column [name]="'Status'">
                <ng-template let-row="row" let-rowIndex="rowIndex" ngx-datatable-cell-template>
                  <div *ngIf="row.status == 'Permintaan baru' ">
                    <span style="color: #FFAA00;">{{ row.status }}</span>
                  </div>

                  <div *ngIf="row.status == 'Disetujui' ">
                    <span class="text-primary">{{ row.status }}</span>
                  </div>
                </ng-template>
              </ngx-datatable-column>
              <ngx-datatable-column>
              <ng-template let-row="row" let-rowIndex="rowIndex" ngx-datatable-cell-template>
                        <div>
                            <nb-icon icon="more-horizontal-outline" style="cursor: pointer;"></nb-icon>
                        </div>
                    </ng-template>
              </ngx-datatable-column>
          </ngx-datatable>
        </nb-card-body>
      </nb-card>
    </div>
  </div>
  `,
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {

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
