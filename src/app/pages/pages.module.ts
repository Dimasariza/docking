import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { CurrencyPipe } from '@angular/common';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
  ],
  providers : [CurrencyPipe],
  declarations: [
    PagesComponent,
  ],
})
export class PagesModule {
}
