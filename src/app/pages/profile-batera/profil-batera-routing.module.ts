import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddUserComponent } from './add-user/add-user.component';
import { ChangeLogoComponent } from './change-logo/change-logo.component';
import { ProfilBateraComponent } from './profil-batera.component';
import { UpdateUserComponent } from './update-user/update-user.component';

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
  AddUserComponent,
  UpdateUserComponent
];
