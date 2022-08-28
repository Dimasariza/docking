import { NgModule } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { NbCardModule, NbIconModule } from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { HomeBateraRoutingModule, routedComponents } from './home-batera-routing.module';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { MatDatepickerModule } from '@angular/material/datepicker';

@NgModule({
  imports: [
    ThemeModule,
    HomeBateraRoutingModule,
    NgxEchartsModule,
    NbCardModule,
    NbIconModule,
    CdkAccordionModule,
    MatDatepickerModule,
  ],
  exports: [],
  declarations: [
    ...routedComponents,
  ],
})
export class HomeBateraModule { }
