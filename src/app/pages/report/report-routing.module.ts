import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportComponent } from './report.component';
import { LetterMenuComponent } from './tab-menu/letter-menu/report-letter-menu.component';
import { ReportWorkProgress } from './tab-menu/work-progress/report-work-progress';
import { ReportVariantWork } from './tab-menu/variant-work/report-variant-work';
import { PicComponent } from './tab-menu/pic/report-pic.component';
import { SupplierComponent } from './tab-menu/supplier/report-supplier';
import { LetterDialogComponent } from './tab-menu/letter-menu/letter-dialog/letter-dialog.component';
import { SupplierDialog } from './tab-menu/supplier/supplier-dialog/supplier-dialog';
import { ReportStatusDialog } from './report-status-dialog/report-status-dialog';
import { WorkVariantDetailDialog } from './tab-menu/work-variant-detail-dialog/work-variant-detail-dialog';
import { ExportToPDF } from './export-to-pdf/export-to-pdf';
import { AddJobSupplierDialog } from './tab-menu/supplier/addjob-supplier-dialog/addjob-supplier-dialog';

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
  ReportComponent,
  LetterMenuComponent,
  PicComponent,
  ReportWorkProgress,
  ReportVariantWork,
  SupplierComponent,
  LetterDialogComponent,
  SupplierDialog,
  ReportStatusDialog,
  WorkVariantDetailDialog,
  ExportToPDF,
  AddJobSupplierDialog
];
