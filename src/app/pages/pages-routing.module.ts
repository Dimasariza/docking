import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'home',
      loadChildren: () => import('./home/home.module')
        .then(m => m.HomeModule),
    },
    {
      path: 'project',
      loadChildren: () => import('./project/project.modules')
      .then(m => m.ProjectModule),
    },
    {
      path: 'tender',
      loadChildren: () => import('./tender/tender.module')
      .then(m => m.TenderModule),
    },
    {
      path: 'tracking',
      loadChildren: () => import('./tracking/tracking.module')
      .then(m => m.TrackingModule),
    },
    {
      path: 'report/:id',
      loadChildren: () => import('./report/report.module')
      .then(m => m.ReportModule),
    },
    {
      path: 'profile',
      loadChildren: () => import('./profile/profile.modules')
      .then(m => m.ProfileModule),
    },
    {
      path: 'miscellaneous',
      loadChildren: () => import('./miscellaneous/miscellaneous.module')
        .then(m => m.MiscellaneousModule),
    },
    {
      path: '',
      redirectTo: 'home',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
