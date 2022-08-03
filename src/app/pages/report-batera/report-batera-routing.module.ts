import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsComponent } from '../layout/tabs/tabs.component';
import { ReportBateraComponent } from './report-batera.component';

const routes: Routes = [{
  path: '',
  component: ReportBateraComponent,
  children: [
    {
      path: 'tabs',
      component: TabsComponent,
      // children: [
      //   {
      //     path: '',
      //     redirectTo: 'tab1',
      //     pathMatch: 'full',
      //   },
      //   {
      //     path: 'tab1',
      //     component: Tab1Component,
      //   },
      //   {
      //     path: 'tab2',
      //     component: Tab2Component,
      //   },
      // ],
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportBateraRoutingModule {
}
