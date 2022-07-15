import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiklatRoutingModule } from './diklat-routing.module';
import { DiklatComponent } from './diklat.component';
import { KalenderComponent } from './kalender/kalender.component';
import { NbCardModule } from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { StatusComponent } from './status/status.component';


@NgModule({
  declarations: [
    DiklatComponent,
    KalenderComponent,
    StatusComponent
  ],
  imports: [
    NgxDatatableModule,
    NbCardModule,
    ThemeModule,
    CommonModule,
    DiklatRoutingModule
  ]
})
export class DiklatModule { }
