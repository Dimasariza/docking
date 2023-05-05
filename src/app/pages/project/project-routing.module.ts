import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectComponent } from './project.component';
import { ProjectSubComponent } from '../project-sub/project-sub.component';
import { ProjectDialogComponent } from './project-dialog/project-dialog.component';

const routes: Routes = [{
    path: '',
    component: ProjectComponent,
  },
  {
    path: 'sub-menu-project/:id',
    component: ProjectSubComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectRoutingModule { }

export const routedComponents = [
  ProjectComponent,
  ProjectSubComponent,
  ProjectDialogComponent
];
