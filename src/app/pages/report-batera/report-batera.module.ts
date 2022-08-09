import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NbButtonModule, NbCardModule, NbCheckboxModule, NbIconModule, NbInputModule, NbListModule, NbRadioModule, NbRouteTabsetModule, NbSelectModule, NbStepperModule, NbTableModule, NbTabsetModule, NbTreeGridModule, NbUserModule } from '@nebular/theme';
import { ReportBateraComponent } from './report-batera.component';
import { ReportBateraRoutingModule } from './report-batera-routing.module';
import { KeyPositionsComponent } from './key-positions/key-positions.component';
import { PositionsComponent } from './positions/positions.component';
import { MeetingsComponent } from './meetings/meetings.component';
import { StatusReportComponent } from './status-report/status-report.component';
import { ActivityFlowComponent } from './activity-flow/activity-flow.component';
import { ActivityReportComponent } from './activity-report/activity-report.component';
import { ActivityTableComponent, FsIconComponent } from './table/table.component';
import { SubMenuReportComponent } from './sub-menu-report/sub-menu-report.component';


@NgModule({
  declarations: [
    ReportBateraComponent,
    ReportBateraComponent,
    KeyPositionsComponent,
    PositionsComponent,
    MeetingsComponent,
    StatusReportComponent,
    ActivityFlowComponent,
    ActivityReportComponent,
    ActivityTableComponent,
    FsIconComponent,
    SubMenuReportComponent
  ],
  imports: [
    CommonModule,
    NgxDatatableModule,
    NbCardModule,
    NbSelectModule,
    NbCheckboxModule,
    NbRadioModule,
    NbInputModule,
    NbTabsetModule,
    NbRouteTabsetModule,
    ReportBateraRoutingModule,
    NbButtonModule,
    NbIconModule,
    NbTreeGridModule,
  ]
})
export class ReportBateraModule {

 }
