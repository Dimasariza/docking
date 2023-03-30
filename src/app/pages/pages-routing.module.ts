import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';



const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'home-batera',
      loadChildren: () => import('./home-batera/home-batera.module')
        .then(m => m.HomeBateraModule),
    },
    {
      path: 'project-batera',
      loadChildren: () => import('./project-batera/project-batera.modules')
      .then(m => m.ProjectBateraModule),
    },
    {
      path: 'tender-batera',
      loadChildren: () => import('./tender-batera/tender-batera.module')
      .then(m => m.TenderBateraModule),
    },
    {
      path: 'tracking-batera',
      loadChildren: () => import('./tracking-batera/tracking-batera.module')
      .then(m => m.TrackingBateraModule),
    },
    {
      path: 'report-batera/:id',
      loadChildren: () => import('./report-batera/report-batera.module')
      .then(m => m.ReportBateraModule),
    },
    {
      path: 'profile-batera',
      loadChildren: () => import('./profile-batera/profil-batera.modules')
      .then(m => m.ProfilBateraModule),
    },
    {
      path: 'export-pdf',
      loadChildren: () => import('./pdf-generator-batera/pdf-generator.module')
        .then(m => m.PdfGeneratorModule),
    },
    {
      path: 'function',
      loadChildren: () => import('./function-collection-batera/function-collection.module')
        .then(m => m.FunctionCollecetionModule),
    },
    {
      path: 'miscellaneous',
      loadChildren: () => import('./miscellaneous/miscellaneous.module')
        .then(m => m.MiscellaneousModule),
    },
    {
      path: '',
      redirectTo: 'home-batera',
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
