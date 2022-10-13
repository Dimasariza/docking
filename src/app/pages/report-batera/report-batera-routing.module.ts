import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportBateraComponent } from './report-batera.component';
import { SubMenuReportComponent } from './sub-menu-report/sub-menu-report.component';


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
