import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CardComponent } from '@swimlane/ngx-charts';
import { HomeBateraComponent } from './home-batera.component';

const routes: Routes = [{
    path: '',
    component: HomeBateraComponent,
    children: [{
      path: 'cards',
      component: CardComponent,
    },]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeBateraRoutingModule { }

export const routedComponents = [
    
];
