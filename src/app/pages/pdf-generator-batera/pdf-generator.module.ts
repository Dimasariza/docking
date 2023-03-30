import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

import { PdfGeneratorRoutingModule } from './pdf-generator-routing.module';
import { NbButtonModule, NbCardModule, NbSelectModule } from '@nebular/theme';
import { PdfGeneratorBateraComponent } from './pdf-generator-batera.component';


@NgModule({
  declarations: [
    PdfGeneratorBateraComponent
  ],
  imports: [
    CommonModule,
    PdfGeneratorRoutingModule,
    NbCardModule,
    NbButtonModule,
    NbSelectModule
  ],
  providers : [CurrencyPipe]
})
export class PdfGeneratorModule { }
