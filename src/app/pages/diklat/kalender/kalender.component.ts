import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-kalender',
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
        <nb-card-body>
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
              <ngx-datatable-column [name]="'NAMA DIKLAT'" prop="name"></ngx-datatable-column>
              <ngx-datatable-column [name]="'WAKTU PELAKSANAAN'" prop="time"></ngx-datatable-column>
              <ngx-datatable-column [name]="'TEMPAT PELAKSANAAN'" prop="place"></ngx-datatable-column>
              <ngx-datatable-column [name]="'REGISTRASI'">
              <ng-template let-row="row" let-rowIndex="rowIndex" ngx-datatable-cell-template>
                        <div class="d-flex">
                            <button class="btn btn-primary btn-sm btn-action">DAFTAR</button>
                        </div>
                    </ng-template>
              </ngx-datatable-column>
          </ngx-datatable>
        </nb-card-body>
      </nb-card>
    </div>
  </div>
  `,
  styleUrls: ['./kalender.component.scss']
})
export class KalenderComponent implements OnInit {

  data = [
    {
      "name": "Ethel Price",
      "time": "12 Mei 2022 - 20 Mei 2022",
      "place": "Blended Learning"
    },
    {
      "name": "Claudine Neal",
      "time": "12 Mei 2022 - 20 Mei 2022",
      "place": "Blended Learning"
    },
    {
      "name": "Beryl Rice",
      "time": "12 Mei 2022 - 20 Mei 2022",
      "place": "Blended Learning"
    },
    {
      "name": "Wilder Gonzales",
      "time": "10 Juni 2022 - 22 Juni 2022",
      "place": "Blended Learning"
    },
    {
      "name": "Georgina Schultz",
      "time": "12 Mei 2022 - 20 Mei 2022",
      "place": "Blended Learning"
    },
    {
      "name": "Carroll Buchanan",
      "time": "10 Juni 2022 - 22 Juni 2022",
      "place": "Blended Learning"
    },
    {
      "name": "Valarie Atkinson",
      "time": "12 Mei 2022 - 20 Mei 2022",
      "place": "Blended Learning"
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
