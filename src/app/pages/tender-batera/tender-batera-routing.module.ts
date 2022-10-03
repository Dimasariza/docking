import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BastComponent } from '../report-batera/bast/bast.component';
import { CloseOutComponent } from '../report-batera/close-out/close-out.component';
import { PicComponent } from '../report-batera/pic/pic.component';
import { SuratTeguranComponent } from '../report-batera/surat-teguran/surat-teguran.component';
import { WorkProgressComponent } from '../report-batera/work-progress/work-progress.component';
import { CardComponent } from './card/card.component';
import { FsIconComponent, TenderBateraComponent } from './tender-batera.component';

const routes: Routes = [{
    path: '',
    component: TenderBateraComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TenderBateraRoutingModule { }

export const routedComponents = [
  TenderBateraComponent,
  FsIconComponent,
  CardComponent,
];
