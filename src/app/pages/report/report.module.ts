import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NbAccordionModule, 
  NbAlertModule, 
  NbButtonModule, 
  NbCardModule, 
  NbDatepickerModule, 
  NbIconModule, 
  NbInputModule, 
  NbLayoutModule, 
  NbPopoverModule, 
  NbProgressBarModule, 
  NbRouteTabsetModule, 
  NbSelectModule, 
  NbTabsetModule, 
  NbTreeGridModule } from '@nebular/theme';
import { ReportRoutingModule } from './report-routing.module';
import { SubMenuReportComponent } from './sub-menu-report/sub-menu-report.component';
import { WorkProgressComponent } from './work-progress/work-progress.component';
import { PicComponent } from './pic/pic.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { LetterDocComponent } from './letter-doc/letter-doc.component';
import { ProjectStatusComponent } from './project-status/project-status.component';
import { ReportComponent } from './report.component';
import { MatTableModule } from '@angular/material/table';
import { VariantWorkComponent } from './variant-work/variant-work.component';
import { LetterMenuComponent } from './letter-menu/letter-menu.component';
import { JobSuplierComponent } from './job-suplier/job-suplier.component';

import { BarProgressComponent } from './bar-progress/bar-progress.component';
import { FrappeGanttModule } from '../tracking/frappe-gant/frappe-gantt.module';

@NgModule({
  declarations: [
    SubMenuReportComponent,
    WorkProgressComponent,
    PicComponent,
    LetterDocComponent,
    JobSuplierComponent,
    ReportComponent,
    ProjectStatusComponent,
    VariantWorkComponent,
    LetterMenuComponent,
    BarProgressComponent,
  ],
  entryComponents: [ LetterDocComponent],
  imports: [
    CommonModule,
    NgxDatatableModule,
    NbCardModule,
    NbSelectModule,
    NbInputModule,
    NbTabsetModule,
    NbRouteTabsetModule,
    ReportRoutingModule,
    NbButtonModule,
    NbTreeGridModule,
    NbLayoutModule,
    NbDatepickerModule,
    MatDialogModule,
    NbProgressBarModule,
    FormsModule,
    NbPopoverModule,
    NbAccordionModule,
    NbIconModule,
    MatTableModule,
    NbAlertModule,
    FrappeGanttModule
  ],
  providers : [CurrencyPipe]
})

export class ReportModule {
 }
