import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FsIconComponent } from '../report-batera/work-progress/work-progress.component';
import { AddNewProjectComponent } from './add-new-project/add-new-project.component';
import { ProjectBateraComponent } from './project-batera.component';
import { SubMenuProjectComponent, SubPriceDataComponent, SubProjectDataComponent } from './sub-menu-project/sub-menu-project.component';
import { SubJobWorkareaComponent } from './work-area/sub-job-workarea.component';
import { UpdateWorkareaComponent } from './work-area/update-workarea.component';
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
  SubProjectDataComponent,
  SubMenuProjectComponent,
  SubPriceDataComponent,
  AddNewProjectComponent,
  SubJobWorkareaComponent,
  FsIconComponent,
  WorkAreaComponent,
  UpdateWorkareaComponent
];
