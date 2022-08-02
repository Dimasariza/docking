import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectBateraComponent } from './project-batera.component';

const routes: Routes = [{
    path: '',
    component: ProjectBateraComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectBateraRoutingModule { }

export const routedComponents = [
  ProjectBateraComponent,

];
