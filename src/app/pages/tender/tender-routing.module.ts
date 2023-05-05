import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContractActionComponent } from './contract-action/contract-action.component';
import { TenderComponent } from './tender.component';
import { YardDetailsDialog } from './yard-details-dialog/yard-details-dialog.component';
import { YardDialogComponent } from './yard-dialog/yard-dialog.component';

const routes: Routes = [{
    path: '',
    component: TenderComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TenderRoutingModule { }

export const routedComponents = [
  TenderComponent,
  ContractActionComponent,
  YardDetailsDialog,
  YardDialogComponent
];
