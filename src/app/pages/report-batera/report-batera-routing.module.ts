import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportBateraComponent } from './report-batera.component';


const routes: Routes = [{
  path: '',
  component: ReportBateraComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportBateraRoutingModule {
}
