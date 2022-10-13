import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportBateraComponent } from './report-batera.component';
import { SubMenuReportComponent } from './sub-menu-report/sub-menu-report.component';


const routes: Routes = [{
  path: '',
  component: ReportBateraComponent,
  },
  {
    path: ':id/sub-menu-report',
    component: SubMenuReportComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportBateraRoutingModule {
}
