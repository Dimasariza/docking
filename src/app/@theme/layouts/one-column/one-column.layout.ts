import { Component } from '@angular/core';
import { NbSidebarService, NbSidebarState } from '@nebular/theme';
import { Observable } from 'rxjs';

@Component({
  selector: 'ngx-one-column-layout',
  styleUrls: ['./one-column.layout.scss'],
  template: `
    <nb-layout windowMode>
      <nb-layout-header fixed>
        <ngx-header></ngx-header>
      </nb-layout-header>
      <nb-sidebar class="menu-sidebar" tag="menu-sidebar" responsive>
        <ng-container *ngIf="(state$ | async) as state; else logo">
          <nb-card *ngIf="state == 'compacted' || state == 'collapsed'">
            <div class="d-flex justify-content-center  logo-wrapper p-2">
              <img src="./assets/images/Logo/Pupuk Indonesia TL.png" alt="Pupuk Indonesia Logistik" style="width:20%">
              <div class="logo-desc">
                <h6 class="logo-name">PUPUK INDONESIA LOGISTIK</h6>
                <span class="text-hint">(PIHC Group)</span> <br>   
              </div>
            </div>
          </nb-card>
          <div *ngIf="state == 'expanded'" style="margin: 0 -18px">
              <img src="./assets/images/Logo/Pupuk Indonesia TL.png" alt="Pupuk Indonesia Logistik" style="width:50px">
          </div>
        </ng-container>
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

    <ng-template #logo>
      <nb-card>
        <div class="d-flex justify-content-center  logo-wrapper p-2">
          <img src="./assets/images/Logo/Pupuk Indonesia TL.png" alt="Pupuk Indonesia Logistik" style="width:20%">
          <div class="logo-desc">
            <h6 class="logo-name">PUPUK INDONESIA LOGISTIK</h6>
            <span class="text-hint">(PIHC Group)</span> <br>   
          </div>
        </div>
      </nb-card>
    </ng-template>
  `,
})
export class OneColumnLayoutComponent {
  state$: Observable<NbSidebarState>
  constructor(private sidebarService: NbSidebarService) {
    sidebarService.onToggle().subscribe(change => {
      this.state$ = sidebarService.getSidebarState(change.tag)
    })
  }
}
