import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { TrackingBateraComponent } from './tracking-batera.component';

const routes: Routes = [{
  path: '',
  component: TrackingBateraComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrackingBateraRoutingModule { }

export const routedComponents = [
    TrackingBateraComponent
];
