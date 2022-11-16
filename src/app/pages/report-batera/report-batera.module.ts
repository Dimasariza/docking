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
import { ReportBateraRoutingModule } from './report-batera-routing.module';
import { SubMenuReportComponent } from './sub-menu-report/sub-menu-report.component';
import { WorkProgressComponent } from './work-progress/work-progress.component';
import { PicComponent } from './pic/pic.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { LetterDocComponent } from './letter-doc/letter-doc.component';
import { ProjectStatusComponent } from './project-status/project-status.component';
import { ReportBateraComponent } from './report-batera.component';
import { MatTableModule } from '@angular/material/table';
import { VariantWorkComponent } from './variant-work/variant-work.component';
import { LetterMenuComponent } from './letter-menu/letter-menu.component';
import { JobSuplierComponent } from './job-suplier/job-suplier.component';

import {MatDatepickerModule, MatDateRangeInput, MatRangeDateSelectionModel} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatNativeDateModule } from '@angular/material/core';


@NgModule({
  declarations: [
    SubMenuReportComponent,
    WorkProgressComponent,
    PicComponent,
    LetterDocComponent,
    JobSuplierComponent,
    ReportBateraComponent,
    ProjectStatusComponent,
    VariantWorkComponent,
    LetterMenuComponent,
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
    NbAlertModule
  ],
  providers : [CurrencyPipe]
})
export class ReportBateraModule {

 }
