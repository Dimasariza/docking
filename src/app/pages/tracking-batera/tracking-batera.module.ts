import { NgModule } from '@angular/core';
import { NbButtonGroupModule, NbButtonModule, NbCardModule, NbIconModule } from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { routedComponents, TrackingBateraRoutingModule } from './tracking-batera.routing.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FrappeGanttModule } from './frappe-gant/frappe-gantt.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    ThemeModule,
    TrackingBateraRoutingModule,
    NbCardModule,
    NbIconModule,
    NbButtonModule,
    NgxDatatableModule,
    NbButtonGroupModule,
    FrappeGanttModule,
    CommonModule
  ],
  exports: [  ],
  declarations: [
    ...routedComponents,
  ],
})
export class TrackingBateraModule { }
