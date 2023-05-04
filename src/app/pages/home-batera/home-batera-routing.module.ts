import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeBateraComponent } from './home-batera.component';
import { DeleteDialogComponent } from '../../component/delete-dialog/delete-dialog.component';
import { ShipDialogComponent } from './ship-dialog/ship-dialog.component';

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
  DeleteDialogComponent,
  ShipDialogComponent
];
