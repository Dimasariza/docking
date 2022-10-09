import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BastComponent } from './bast/bast.component';
import { PicComponent } from './pic/pic.component';
import { WorkProgressComponent } from './work-progress/work-progress.component';
import { ReportBateraComponent } from './report-batera.component';
import { SubMenuReportComponent } from './sub-menu-report/sub-menu-report.component';
import { SuratTeguranComponent } from './surat-teguran/surat-teguran.component';
import { CloseOutComponent } from './close-out/close-out.component';


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
