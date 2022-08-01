import { NgModule } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { NbCardModule } from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { HomeBateraRoutingModule, routedComponents } from './home-batera-routing.module';
import { CardComponent } from './card/card.component';

@NgModule({
  imports: [
    ThemeModule,
    HomeBateraRoutingModule,
    NgxEchartsModule,
    NbCardModule,
  ],
  exports: [],
  declarations: [
    ...routedComponents,
    CardComponent
  ],
})
export class HomeBateraModule { }
