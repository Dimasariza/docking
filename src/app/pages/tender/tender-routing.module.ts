import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TenderComponent } from './tender.component';
import { YardDetailsDialog } from './tender-contract/yard-details-dialog/yard-details-dialog.component';
import { YardDialogComponent } from './tender-contract/yard-dialog/yard-dialog.component';
import { TenderContract } from './tender-contract/tender-contract';
import { TenderLoadDetails } from './tender-load-details/tender-load-details';

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
  YardDetailsDialog,
  YardDialogComponent,
  TenderContract,
  TenderLoadDetails
];
