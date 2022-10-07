import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NbButtonModule, NbCardModule, NbCheckboxModule, NbDatepickerModule, NbIconModule, NbInputModule, NbLayoutModule, NbRadioModule, NbRouteTabsetModule, NbSelectModule, NbTabsetModule, NbTreeGridModule } from '@nebular/theme';
import { ReportBateraComponent, reportData } from './report-batera.component';
import { ReportBateraRoutingModule } from './report-batera-routing.module';
import { CloseOutComponent } from './close-out/close-out.component';
import { InspectionMenuComponent, SubMenuReportComponent } from './sub-menu-report/sub-menu-report.component';
import { ApprovalDetailComponent, approvalIconComponent, WorkProgressComponent } from './work-progress/work-progress.component';
import { BastComponent } from './bast/bast.component';
import { SuratTeguranComponent } from './surat-teguran/surat-teguran.component';
import { PicComponent } from './pic/pic.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FsIconComponent } from '../home-batera/home-batera.component';
import { WorkAddComponent } from './work-add/work-add.component';


@NgModule({
  declarations: [
    ReportBateraComponent,
    ReportBateraComponent,
    SubMenuReportComponent,
    WorkProgressComponent,
    BastComponent,
    SuratTeguranComponent,
    CloseOutComponent,
    InspectionMenuComponent,
    PicComponent,
    reportData,
    CloseOutComponent,
    approvalIconComponent,
    ApprovalDetailComponent,
    WorkAddComponent,
    FsIconComponent
  ],
  entryComponents: [ApprovalDetailComponent],
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
    NbDatepickerModule,
    MatDialogModule
  ]
})
export class ReportBateraModule {

 }
