import { NgModule } from '@angular/core';
import { NbButtonGroupModule, NbButtonModule, NbCardModule, NbIconModule } from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { routedComponents, TrackingRoutingModule } from './tracking-routing.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FrappeGanttModule } from './frappe-gant/frappe-gantt.module';
import { CommonModule } from '@angular/common';
import { ListTableModule } from '../../component/list-table/list-table.module';

@NgModule({
  imports: [
    ThemeModule,
    TrackingRoutingModule,
    NbCardModule,
    NbIconModule,
    NbButtonModule,
    NgxDatatableModule,
    NbButtonGroupModule,
    FrappeGanttModule,
    CommonModule,
    ListTableModule
  ],
  exports: [  ],
  declarations: [
    ...routedComponents,
  ],
})
export class TrackingModule { }
