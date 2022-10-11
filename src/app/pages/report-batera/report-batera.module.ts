import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NbAccordionModule, NbButtonModule, NbCardModule, NbCheckboxModule, NbDatepickerModule, NbIconModule, NbInputModule, NbLayoutModule, NbPopoverModule, NbProgressBarModule, NbRadioModule, NbRouteTabsetModule, NbSelectModule, NbTabsetModule, NbTreeGridModule } from '@nebular/theme';
import { FsIconComponent, ReportBateraComponent, reportData } from './report-batera.component';
import { ReportBateraRoutingModule } from './report-batera-routing.module';
import { CloseOutComponent } from './close-out/close-out.component';
import { SubMenuReportComponent } from './sub-menu-report/sub-menu-report.component';
import { WorkProgressComponent } from './work-progress/work-progress.component';
import { BastComponent } from './bast/bast.component';
import { SuratTeguranComponent } from './surat-teguran/surat-teguran.component';
import { PicComponent } from './pic/pic.component';
import { MatDialogModule } from '@angular/material/dialog';
import { WorkAddComponent } from './work-add/work-add.component';
import { UpdateWorkprogressComponent } from './work-progress/update-workprogress.component';
import { UpdateWorkareaComponent } from '../project-batera/work-area/update-workarea.component';
import { FormsModule } from '@angular/forms';
import { LetterDocComponent } from './letter-doc/letter-doc.component';
import { JobSuplierComponent } from './work-progress/job-suplier.component';


@NgModule({
  declarations: [
    ReportBateraComponent,
    ReportBateraComponent,
    SubMenuReportComponent,
    WorkProgressComponent,
    BastComponent,
    SuratTeguranComponent,
    CloseOutComponent,
    PicComponent,
    reportData,
    CloseOutComponent,
    WorkAddComponent,
    FsIconComponent,
    UpdateWorkprogressComponent,
    LetterDocComponent,
    JobSuplierComponent
  ],
  entryComponents: [UpdateWorkareaComponent, UpdateWorkprogressComponent, LetterDocComponent],
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
    MatDialogModule,
    NbProgressBarModule,
    FormsModule,
    NbPopoverModule,
    NbAccordionModule
  ]
})
export class ReportBateraModule {

 }
