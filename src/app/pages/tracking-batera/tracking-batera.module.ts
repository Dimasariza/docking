import { NgModule } from '@angular/core';
import { NbButtonModule, NbCardModule, NbIconModule } from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { routedComponents, TrackingBateraRoutingModule } from './tracking-batera.routing.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FrappeGanttComponent } from './frappe-gant/frappe-gantt.component';

@NgModule({
  imports: [
    ThemeModule,
    TrackingBateraRoutingModule,
    NbCardModule,
    NbIconModule,
    NbButtonModule,
    NgxDatatableModule,
  ],
  exports: [],
  declarations: [
    ...routedComponents,
    FrappeGanttComponent
  ],
})
export class TrackingBateraModule { }
