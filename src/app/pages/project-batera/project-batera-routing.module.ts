import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FsIconComponent } from '../report-batera/work-progress/work-progress.component';
import { ProjectBateraComponent } from './project-batera.component';
import { ProjectDataComponent } from './project-data/project-data.component';
import { SubMenuProjectComponent } from './sub-menu-project/sub-menu-project.component';
import { TableDataComponent } from './sub-menu-project/table-data/table-data.component';
import { WorkAreaComponent } from './work-area/work-area.component';

const routes: Routes = [{
    path: '',
    component: ProjectBateraComponent,
  },
  {
    path: 'sub-menu-project/:id',
    component: SubMenuProjectComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectBateraRoutingModule { }

export const routedComponents = [
  ProjectBateraComponent,
  SubMenuProjectComponent,
  FsIconComponent,
  WorkAreaComponent,
  ProjectDataComponent,
  TableDataComponent
];
