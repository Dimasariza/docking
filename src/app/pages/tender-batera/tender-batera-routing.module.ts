import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContractActionComponent } from './contract-action/contract-action.component';
import { TenderBateraComponent } from './tender-batera.component';
import { YardDetailsDialog } from './yard-details-dialog/yard-details-dialog.component';
import { YardDialogComponent } from './yard-dialog/yard-dialog.component';

const routes: Routes = [{
    path: '',
    component: TenderBateraComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TenderBateraRoutingModule { }

export const routedComponents = [
  TenderBateraComponent,
  ContractActionComponent,
  YardDetailsDialog,
  YardDialogComponent
];
