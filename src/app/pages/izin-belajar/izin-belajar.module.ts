import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IzinBelajarComponent } from './izin-belajar.component';
import { NbCardModule } from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';



@NgModule({
  declarations: [
    IzinBelajarComponent
  ],
  imports: [
    NbCardModule,
    ThemeModule,
    CommonModule,
    NgxDatatableModule
  ]
})
export class IzinBelajarModule { }
