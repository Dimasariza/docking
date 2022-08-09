import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivityFlowComponent } from './activity-flow/activity-flow.component';
import { ActivityReportComponent } from './activity-report/activity-report.component';
import { KeyPositionsComponent } from './key-positions/key-positions.component';
import { MeetingsComponent } from './meetings/meetings.component';
import { PositionsComponent } from './positions/positions.component';
import { ReportBateraComponent } from './report-batera.component';
import { StatusReportComponent } from './status-report/status-report.component';
import { SubMenuReportComponent } from './sub-menu-report/sub-menu-report.component';

const routes: Routes = [{
  path: '',
  component: ReportBateraComponent,
  children: [
    {
      path: 'key-positions',
      component: KeyPositionsComponent
    },
    {
      path: 'positions',
      component: PositionsComponent
    },
    {
      path: 'activity-report',
      component: ActivityReportComponent
    },
    {
      path: 'meetings',
      component: MeetingsComponent
    },
    {
      path: 'status-report',
      component: StatusReportComponent
    },
    {
      path: 'activity-flow',
      component: ActivityFlowComponent
    },
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
