import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NbAuthComponent } from '@nebular/auth';
import { AuthComponent } from './auth.component';
import { NgxLoginComponent } from './login/login.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
        {
            path: 'login',
            component: NgxLoginComponent
        }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NgxAuthRoutingModule {
}