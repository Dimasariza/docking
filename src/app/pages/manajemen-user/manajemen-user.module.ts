import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManajemenUserComponent } from './manajemen-user.component';
import { NbButtonModule, NbCardModule, NbIconModule } from '@nebular/theme';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';



@NgModule({
  declarations: [
    ManajemenUserComponent
  ],
  imports: [
    CommonModule,
    NbCardModule,
    NgxDatatableModule,
    NbButtonModule,
    NbIconModule
  ]
})
export class ManajemenUserModule { }
