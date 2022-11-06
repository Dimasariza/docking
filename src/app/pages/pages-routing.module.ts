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
    // {
    //   path: 'dashboard',
    //   component: ECommerceComponent,
    // },
    // {
    //   path: 'iot-dashboard',
    //   component: DashboardComponent,
    // },
    // {
    //   path: 'layout',
    //   loadChildren: () => import('./layout/layout.module')
    //     .then(m => m.LayoutModule),
    // },
    // {
    //   path: 'forms',
    //   loadChildren: () => import('./forms/forms.module')
    //     .then(m => m.FormsModule),
    // },
    // {
    //   path: 'ui-features',
    //   loadChildren: () => import('./ui-features/ui-features.module')
    //     .then(m => m.UiFeaturesModule),
    // },
    // {
    //   path: 'e-commerce',
    //   loadChildren: () => import('./e-commerce/e-commerce.module')
    //     .then(m => m.ECommerceModule),
    // },
    // {
    //   path: 'modal-overlays',
    //   loadChildren: () => import('./modal-overlays/modal-overlays.module')
    //     .then(m => m.ModalOverlaysModule),
    // },
    // {
    //   path: 'extra-components',
    //   loadChildren: () => import('./extra-components/extra-components.module')
    //     .then(m => m.ExtraComponentsModule),
    // },
    // {
    //   path: 'maps',
    //   loadChildren: () => import('./maps/maps.module')
    //     .then(m => m.MapsModule),
    // },
    // {
    //   path: 'charts',
    //   loadChildren: () => import('./charts/charts.module')
    //     .then(m => m.ChartsModule),
    // },
    // {
    //   path: 'editors',
    //   loadChildren: () => import('./editors/editors.module')
    //     .then(m => m.EditorsModule),
    // },
    // {
    //   path: 'tables',
    //   loadChildren: () => import('./tables/tables.module')
    //     .then(m => m.TablesModule),
    // },
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
