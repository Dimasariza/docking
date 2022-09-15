import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeBateraComponent, HomeCardComponent } from './home-batera.component';

const routes: Routes = [{
    path: '',
    component: HomeBateraComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeBateraRoutingModule { }

export const routedComponents = [
  HomeBateraComponent,
  HomeCardComponent,
];
