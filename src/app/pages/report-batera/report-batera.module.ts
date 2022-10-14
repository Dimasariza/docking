import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NbAccordionModule, 
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
import { ReportBateraRoutingModule } from './report-batera-routing.module';
import { SubMenuReportComponent } from './sub-menu-report/sub-menu-report.component';
import { WorkProgressComponent } from './work-progress/work-progress.component';
import { PicComponent } from './pic/pic.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { LetterDocComponent } from './letter-doc/letter-doc.component';
import { ProjectStatusComponent } from './project-status/project-status.component';
import { FsIconComponent, ReportBateraComponent } from './report-batera.component';
import { MatTableModule } from '@angular/material/table';
import { WorkAreaComponent } from './work-area/work-area.component'
import { VariantWorkComponent } from './variant-work/variant-work.component';
import { LetterMenuComponent } from './letter-menu/letter-menu.component';
import { JobSuplierComponent } from './job-suplier/job-suplier.component';


@NgModule({
  declarations: [
    SubMenuReportComponent,
    WorkProgressComponent,
    PicComponent,
    LetterDocComponent,
    JobSuplierComponent,
    ReportBateraComponent,
    ProjectStatusComponent,
    FsIconComponent,
    WorkAreaComponent,
    VariantWorkComponent,
    LetterMenuComponent
  ],
  entryComponents: [ LetterDocComponent, ProjectStatusComponent],
  imports: [
    CommonModule,
    NgxDatatableModule,
    NbCardModule,
    NbSelectModule,
    NbInputModule,
    NbTabsetModule,
    NbRouteTabsetModule,
    ReportBateraRoutingModule,
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
  ]
})
export class ReportBateraModule {

 }
