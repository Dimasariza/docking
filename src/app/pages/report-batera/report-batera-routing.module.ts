import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BastComponent } from './bast/bast.component';
import { PicComponent } from './pic/pic.component';
import { WorkProgressComponent } from './work-progress/work-progress.component';
import { ReportBateraComponent } from './report-batera.component';
import { CloseOutComponent } from './close-out/status-report.component';
import { SubMenuReportComponent } from './sub-menu-report/sub-menu-report.component';
import { SuratTeguranComponent } from './surat-teguran/surat-teguran.component';
import { ActivityReportComponent } from './activity-report/activity-report.component';

const routes: Routes = [{
  path: '',
  component: ReportBateraComponent,
  children: [
    {
      path: 'pic',
      component: PicComponent
    },
    {
      path: 'work-progress',
      component: WorkProgressComponent
    },
    {
      path: 'bast',
      component: BastComponent
    },
    {
      path: 'surat-teguran',
      component: SuratTeguranComponent
    },
    {
      path: 'close-out',
      component: CloseOutComponent
    },
    {
      path: 'activity-report',
      component: ActivityReportComponent
    }
  ],
  },
  {
    path: 'sub-menu-report',
    component: SubMenuReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportBateraRoutingModule {
}
