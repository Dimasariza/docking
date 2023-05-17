import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfilComponent } from './profile.component';
import { UserActionComponent } from './user-action/user-action.component';

const routes: Routes = [{
    path: '',
    component: ProfilComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilRoutingModule { }

export const routedComponents = [
  ProfilComponent,
  UserActionComponent
];
