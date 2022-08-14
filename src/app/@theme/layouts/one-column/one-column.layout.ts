import { Component } from '@angular/core';

@Component({
  selector: 'ngx-one-column-layout',
  styleUrls: ['./one-column.layout.scss'],
  template: `
    <nb-layout windowMode>
      <nb-layout-header fixed>
        <ngx-header></ngx-header>
      </nb-layout-header>
      <nb-sidebar class="menu-sidebar" tag="menu-sidebar" responsive>
        <nb-card>
          <div class="d-flex justify-content-center  logo-wrapper p-2">
            <img src="../../../assets/images/Logo/Pupuk Indonesia TL.png" alt="Pupuk Indonesia Logistik" style="width:20%">
            <div class="logo-desc">
              <h6 class="logo-name">PUPUK INDONESIA <br> LOGISTIK</h6>
              <span class="text-hint">(PIHC Group)</span> <br>   
            </div>
          </div>
        </nb-card>
        <ng-content select="nb-menu">
        </ng-content>
      </nb-sidebar>

      <nb-layout-column>
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>

      <nb-layout-footer fixed>
        <ngx-footer></ngx-footer>
      </nb-layout-footer>
    </nb-layout>
  `,
})
export class OneColumnLayoutComponent {}
