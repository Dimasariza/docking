import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogFormComponent, IzinBelajarComponent } from './izin-belajar.component';
import { NbButtonModule, NbCardModule, NbDialogModule, NbIconModule, NbInputModule } from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';



@NgModule({
  declarations: [
    IzinBelajarComponent,
    DialogFormComponent
  ],
  imports: [
    NbCardModule,
    ThemeModule,
    CommonModule,
    NgxDatatableModule,
    NbButtonModule,
    NbInputModule,
    NbIconModule
  ]
})
export class IzinBelajarModule { }
