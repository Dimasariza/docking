import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ECommerceComponent } from './e-commerce/e-commerce.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { HomeBateraComponent } from './home-batera/home-batera.component';
import { ProjectBateraComponent } from './project-batera/project-batera.component';
import { TechnicalBateraComponent } from './technical-batera/technical-batera.component';
import { ProcurementBateraComponent } from './procurement-batera/procurement-batera.component';
import { ReportBateraComponent } from './report-batera/report-batera.component';
import { TrackingBateraComponent } from './tracking-batera/tracking-batera.component';
import { ProfilBateraComponent } from './profile-batera/profil-batera.component';

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
      component: ProjectBateraComponent,
    },
    {
      path: 'technical-batera',
      component: TechnicalBateraComponent,
    },
    {
      path: 'procurement-batera',
      component: ProcurementBateraComponent,
    },
    {
      path: 'tracking-batera',
      component: TrackingBateraComponent,
    },
    {
      path: 'report-batera',
      component: ReportBateraComponent,
    },
    {
      path: 'profile-batera',
      component: ProfilBateraComponent,
    },
    {
      path: 'dashboard',
      component: ECommerceComponent,
    },
    {
      path: 'iot-dashboard',
      component: DashboardComponent,
    },
    {
      path: 'layout',
      loadChildren: () => import('./layout/layout.module')
        .then(m => m.LayoutModule),
    },
    {
      path: 'forms',
      loadChildren: () => import('./forms/forms.module')
        .then(m => m.FormsModule),
    },
    {
      path: 'ui-features',
      loadChildren: () => import('./ui-features/ui-features.module')
        .then(m => m.UiFeaturesModule),
    },
    {
      path: 'modal-overlays',
      loadChildren: () => import('./modal-overlays/modal-overlays.module')
        .then(m => m.ModalOverlaysModule),
    },
    {
      path: 'extra-components',
      loadChildren: () => import('./extra-components/extra-components.module')
        .then(m => m.ExtraComponentsModule),
    },
    {
      path: 'maps',
      loadChildren: () => import('./maps/maps.module')
        .then(m => m.MapsModule),
    },
    {
      path: 'charts',
      loadChildren: () => import('./charts/charts.module')
        .then(m => m.ChartsModule),
    },
    {
      path: 'editors',
      loadChildren: () => import('./editors/editors.module')
        .then(m => m.EditorsModule),
    },
    {
      path: 'tables',
      loadChildren: () => import('./tables/tables.module')
        .then(m => m.TablesModule),
    },
    {
      path: 'miscellaneous',
      loadChildren: () => import('./miscellaneous/miscellaneous.module')
        .then(m => m.MiscellaneousModule),
    },
    {
      path: '',
      redirectTo: 'dashboard',
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
