import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CardComponent } from './card/card.component';
import { FsIconComponent, TenderBateraComponent } from './tender-batera.component';

const routes: Routes = [{
    path: '',
    component: TenderBateraComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TenderBateraRoutingModule { }

export const routedComponents = [
  TenderBateraComponent,
  FsIconComponent,
  CardComponent,
];
