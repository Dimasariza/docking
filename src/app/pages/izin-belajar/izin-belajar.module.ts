import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IzinBelajarComponent } from './izin-belajar.component';
import { NbCardModule } from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';



@NgModule({
  declarations: [
    IzinBelajarComponent
  ],
  imports: [
    NbCardModule,
    ThemeModule,
    CommonModule
  ]
})
export class IzinBelajarModule { }
