import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangeLogoComponent } from './change-logo/change-logo.component';
import { ProfilBateraComponent } from './profil-batera.component';
import { UserActionComponent } from './user-action/user-action.component';

const routes: Routes = [{
    path: '',
    component: ProfilBateraComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilBateraRoutingModule { }

export const routedComponents = [
  ProfilBateraComponent,
  ChangeLogoComponent,
  UserActionComponent
];
