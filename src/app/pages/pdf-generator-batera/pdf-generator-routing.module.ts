import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PdfGeneratorBateraComponent } from './pdf-generator-batera.component';

const routes: Routes = [
  {
    path : '',
    component : PdfGeneratorBateraComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PdfGeneratorRoutingModule { }

