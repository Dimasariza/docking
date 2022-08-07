import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ECommerceComponent } from './e-commerce/e-commerce.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { HomeComponent } from './home/home.component';
import { IzinBelajarComponent } from './izin-belajar/izin-belajar.component';
import { BerkasComponent } from './berkas/berkas.component';
import { ManajemenFileComponent } from './manajemen-file/manajemen-file.component';
import { HakAksesComponent } from './hak-akses/hak-akses.component';
import { ManajemenUserComponent } from './manajemen-user/manajemen-user.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'home',
      component: HomeComponent
    },
    {
      path: 'dashboard',
      component: ECommerceComponent,
    },
    { path: 'diklat',
      loadChildren: () => import('./diklat/diklat.module').then(m => m.DiklatModule)
    },
    {
      path: 'izin-belajar',
      loadChildren: () => import('./izin-belajar/izin-belajar.module').then(m => m.IzinBelajarModule)
    },
    {
      path: 'manajemen-file',
      component: ManajemenFileComponent
    },
    {
      path: 'manajemen-user',
      loadChildren: () => import('./manajemen-user/manajemen-user.module').then(m => m.ManajemenUserModule)
    },
    {
      path: 'hak-akses',
      loadChildren: () => import('./hak-akses/hak-akses.module').then(m => m.HakAksesModule)
    },
    {
      path: 'berkas',
      loadChildren: () => import('./berkas/berkas.module').then(m => m.BerkasModule)
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
