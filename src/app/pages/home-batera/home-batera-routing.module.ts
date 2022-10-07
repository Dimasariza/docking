import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddShipComponent } from './add-ship/add-ship.component';
import { HomeCardComponent } from './card-component/home-card.component';
import { FsIconComponent, HomeBateraComponent } from './home-batera.component';
import { UpdateShipComponent } from './update-ship/update-ship.component';

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
  AddShipComponent,
  UpdateShipComponent,
  HomeCardComponent,
];
