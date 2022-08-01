import { NgModule } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { NbCardModule, NbIconModule } from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { HomeBateraRoutingModule, routedComponents } from './home-batera-routing.module';
import { CardTestComponent } from './card-test/card.component';
import { HomeBateraComponent } from './home-batera.component';

@NgModule({
  imports: [
    ThemeModule,
    HomeBateraRoutingModule,
    NgxEchartsModule,
    NbCardModule,
    NbIconModule,
  ],
  exports: [],
  declarations: [
    ...routedComponents,
    CardTestComponent,
    HomeBateraComponent

  ],
})
export class HomeBateraModule { }
