import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManajemenFileComponent } from './manajemen-file.component';
import { NbButtonModule, NbCardModule, NbIconModule, NbInputModule } from '@nebular/theme';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';



@NgModule({
  declarations: [
    ManajemenFileComponent
  ],
  imports: [
    CommonModule,
    NbCardModule,
    NgxDatatableModule,
    NbInputModule,
    NbButtonModule,
    NbIconModule
  ]
})
export class ManajemenFileModule { }
