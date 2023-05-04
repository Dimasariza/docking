import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NbAuthComponent } from '@nebular/auth';
import { AuthComponent } from './auth.component';
import { NgxLoginComponent } from './login/login.component';

const routes: Routes = [{ 
  path: '',
  component: AuthComponent,
  children: [
      {
        path: 'login',
        component: NgxLoginComponent
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
      }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NgxAuthRoutingModule { }
