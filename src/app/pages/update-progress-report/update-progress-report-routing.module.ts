import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { UpdateProgressReport } from './update-progress-report.component';

const routes: Routes = [{
  path: '',
  component: UpdateProgressReport
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateProgressRoutingModule { }

export const routedComponents = [
    UpdateProgressReport,
];