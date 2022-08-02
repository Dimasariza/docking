import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { HomeModule } from './home/home.module';
import { IzinBelajarModule } from './izin-belajar/izin-belajar.module';
import { ManajemenFileModule } from './manajemen-file/manajemen-file.module';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    ECommerceModule,
    MiscellaneousModule,
    HomeModule,
    IzinBelajarModule,
    ManajemenFileModule
  ],
  declarations: [
    PagesComponent
  ],
})
export class PagesModule {
}
