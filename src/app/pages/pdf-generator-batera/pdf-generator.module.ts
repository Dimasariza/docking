import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PdfGeneratorRoutingModule } from './pdf-generator-routing.module';
import { NbCardModule } from '@nebular/theme';
import { PdfGeneratorBateraComponent } from './pdf-generator-batera.component';


@NgModule({
  declarations: [
    PdfGeneratorBateraComponent
  ],
  imports: [
    CommonModule,
    PdfGeneratorRoutingModule,
    NbCardModule,
  ]
})
export class PdfGeneratorModule { }
