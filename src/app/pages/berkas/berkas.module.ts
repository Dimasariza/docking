import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BerkasRoutingModule } from './berkas-routing.module';
import { NbActionsModule, NbCardModule, NbIconModule, NbLayoutModule, NbSearchModule, NbSidebarModule } from '@nebular/theme';
import { BerkasSayaComponent } from './berkas-saya/berkas-saya.component';
import { BerkasComponent } from './berkas.component';



@NgModule({
  declarations: [
    BerkasComponent,
    BerkasSayaComponent
  ],
  imports: [
    CommonModule,
    BerkasRoutingModule,
    NbCardModule,
    NbLayoutModule,
    NbSearchModule,
    NbSidebarModule,
    NbIconModule,
    NbActionsModule
  ]
})
export class BerkasModule { }
