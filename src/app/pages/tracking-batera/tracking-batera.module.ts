import { NgModule } from '@angular/core';
import { NbButtonModule, NbCardModule, NbIconModule } from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { routedComponents, TrackingBateraRoutingModule } from './tracking-batera.routing.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { GanttComponent } from './gantt-component/gantt.component';

@NgModule({
  imports: [
    ThemeModule,
    TrackingBateraRoutingModule,
    NbCardModule,
    NbIconModule,
    NbButtonModule,
    NgApexchartsModule,
    NgxDatatableModule,
    NgApexchartsModule
  ],
  exports: [],
  declarations: [
    ...routedComponents,
    GanttComponent
  ],
})
export class TrackingBateraModule { }
