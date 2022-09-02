import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FsIconComponent, ProjectBateraComponent } from './project-batera.component';
import { SubMenuIconComponent, SubMenuProjectComponent, SubProjectDataComponent } from './sub-menu-project/sub-menu-project.component';

const routes: Routes = [{
    path: '',
    component: ProjectBateraComponent,
  },
  {
    path: 'sub-menu-project',
    component: SubMenuProjectComponent
  }
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
  SubMenuIconComponent,
  FsIconComponent
];
