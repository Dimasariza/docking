import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectBateraComponent } from './project-batera.component';
import { ProjectSubComponent } from '../project_sub-batera/project_sub.component';
import { ProjectDialogComponent } from './project-dialog/project-dialog.component';

const routes: Routes = [{
    path: '',
    component: ProjectBateraComponent,
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
export class ProjectBateraRoutingModule { }

export const routedComponents = [
  ProjectBateraComponent,
  ProjectSubComponent,
  ProjectDialogComponent
];
