import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FunctionCollection } from './function-collection.component';

const routes: Routes = [
  {
    path : '',
    component : FunctionCollection
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FunctionRoutingModule { }

