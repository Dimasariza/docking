import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportComponent } from './report.component';
import { SubMenuReportComponent } from '../../component/ondeletingcomponent/sub-menu-report/sub-menu-report.component';
import { LetterDocComponent } from './tab-menu/letter-menu/letter-doc/letter-doc.component';
import { JobSuplierComponent } from './last-folder/job-suplier/job-suplier.component';
import { ProjectStatusComponent } from './last-folder/project-status/project-status.component';
import { LetterMenuComponent } from './tab-menu/letter-menu/report-letter-menu.component';
import { BarProgressComponent } from './last-folder/bar-progress/bar-progress.component';
import { ReportWorkProgress } from './tab-menu/work-progress/report-work-progress';
import { ReportVariantWork } from './tab-menu/variant-work/report-variant-work';
import { PicComponent } from './tab-menu/pic/report-pic.component';
import { SupplierComponent } from './tab-menu/supplier/report-supplier';

const routes: Routes = [{
  path: '',
  component: ReportComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportRoutingModule { }

export const routedComponents = [
  SubMenuReportComponent,
  LetterDocComponent,
  JobSuplierComponent,
  ReportComponent,
  LetterMenuComponent,
  BarProgressComponent,
  
  PicComponent,
  ProjectStatusComponent,
  ReportWorkProgress,
  ReportVariantWork,
  SupplierComponent
];
