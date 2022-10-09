import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NbButtonModule, NbCardModule, NbCheckboxModule, NbDatepickerModule, NbIconModule, NbInputModule, NbLayoutModule, NbProgressBarModule, NbRadioModule, NbRouteTabsetModule, NbSelectModule, NbTabsetModule, NbTreeGridModule } from '@nebular/theme';
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
    UpdateWorkprogressComponent
  ],
  entryComponents: [UpdateWorkareaComponent, UpdateWorkprogressComponent],
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
    FormsModule
  ]
})
export class ReportBateraModule {

 }
