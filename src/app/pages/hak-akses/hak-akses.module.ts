import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HakAksesComponent } from './hak-akses.component';
import { NbButtonModule, NbCardModule, NbIconModule } from '@nebular/theme';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';



@NgModule({
  declarations: [
    HakAksesComponent
  ],
  imports: [
    CommonModule,
    NbCardModule,
    NgxDatatableModule,
    NbButtonModule,
    NbIconModule
  ]
})
export class HakAksesModule { }
