import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiklatComponent } from './diklat.component';
import { KalenderComponent } from './kalender/kalender.component';
import { StatusComponent } from './status/status.component';

const routes: Routes = [
  { path: '',
    component: DiklatComponent,
    children: [
      {
        path: 'kalender',
        component: KalenderComponent
      },
      {
        path: 'status',
        component: StatusComponent
      }
    ] 
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiklatRoutingModule { }
