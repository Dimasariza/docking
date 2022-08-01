import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { ProjectBateraComponent } from './project-batera/project-batera.component';
import { TechnicalBateraComponent } from './technical-batera/technical-batera.component';
import { ProcurementBateraComponent } from './procurement-batera/procurement-batera.component';
import { TrackingBateraComponent } from './tracking-batera/tracking-batera.component';
import { ReportBateraComponent } from './report-batera/report-batera.component';
import { ProfilBateraComponent } from './profile-batera/profil-batera.component';
import { CardComponent } from './home-batera/card/card.component';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    ECommerceModule,
    MiscellaneousModule,
  ],
  declarations: [
    PagesComponent,
    ProjectBateraComponent,
    TechnicalBateraComponent,
    ProcurementBateraComponent,
    TrackingBateraComponent,
    ReportBateraComponent,
    ProfilBateraComponent,
    CardComponent,
  ],
})
export class PagesModule {
}
