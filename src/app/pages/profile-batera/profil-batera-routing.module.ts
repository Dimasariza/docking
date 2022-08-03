import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfilBateraComponent } from './profil-batera.component';

const routes: Routes = [{
    path: '',
    component: ProfilBateraComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilBateraRoutingModule { }

export const routedComponents = [
];
