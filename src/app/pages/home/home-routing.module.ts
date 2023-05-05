import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { DeleteDialogComponent } from '../../component/delete-dialog/delete-dialog.component';
import { ShipDialogComponent } from './ship-dialog/ship-dialog.component';

const routes: Routes = [{
    path: '',
    component: HomeComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule { }

export const routedComponents = [
  HomeComponent,
  DeleteDialogComponent,
  ShipDialogComponent
];
