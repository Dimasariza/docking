import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CardTestComponent } from './card-test/card.component';
import { HomeBateraComponent } from './home-batera.component';

const routes: Routes = [{
    path: '',
    component: HomeBateraComponent,
    children: [{
      path: 'cards',
      component: CardTestComponent,
    },]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeBateraRoutingModule { }

export const routedComponents = [
];
