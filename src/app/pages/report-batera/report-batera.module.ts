import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NbButtonModule, NbCardModule, NbCheckboxModule, NbIconModule, NbInputModule, NbLayoutModule, NbRadioModule, NbRouteTabsetModule, NbSelectModule, NbTabsetModule, NbTreeGridModule } from '@nebular/theme';
import { ReportBateraComponent, reportData } from './report-batera.component';
import { ReportBateraRoutingModule } from './report-batera-routing.module';
import { CloseOutComponent } from './close-out/status-report.component';
import { ActivityTableComponent, FsIconComponent } from './table/table.component';
import { InspectionMenuComponent, SubMenuReportComponent } from './sub-menu-report/sub-menu-report.component';
import { WorkProgressComponent } from './work-progress/work-progress.component';
import { BastComponent } from './bast/bast.component';
import { SuratTeguranComponent } from './surat-teguran/surat-teguran.component';
import { PicComponent } from './pic/pic.component';


@NgModule({
  declarations: [
    ReportBateraComponent,
    ReportBateraComponent,
    ActivityTableComponent,
    FsIconComponent,
    SubMenuReportComponent,
    WorkProgressComponent,
    BastComponent,
    SuratTeguranComponent,
    CloseOutComponent,
    InspectionMenuComponent,
    PicComponent,
    reportData
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
    NbLayoutModule,
  ]
})
export class ReportBateraModule {

 }
