import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NbAccordionModule, 
  NbAlertModule, 
  NbButtonModule, 
  NbCardModule, 
  NbDatepickerModule, 
  NbDialogModule, 
  NbIconModule, 
  NbInputModule, 
  NbLayoutModule, 
  NbListModule, 
  NbPopoverModule, 
  NbProgressBarModule, 
  NbRouteTabsetModule, 
  NbSelectModule, 
  NbSpinnerModule, 
  NbTabsetModule, 
  NbTreeGridModule,
} from '@nebular/theme';
import { ReportRoutingModule, routedComponents } from './report-routing.module';
import { FormsModule } from '@angular/forms';
import { FrappeGanttModule } from '../tracking/frappe-gant/frappe-gantt.module';
import { ThemeModule } from '../../@theme/theme.module';
import { WorkAreasModule } from '../../component/work-areas/work-areas.module';
import { ListTableModule } from '../../component/list-table/list-table.module';

@NgModule({
  declarations: [
    ...routedComponents
  ],
  imports: [
    CommonModule,
    NgxDatatableModule,
    ThemeModule,
    NbCardModule,
    NbSelectModule,
    NbInputModule,
    NbTabsetModule,
    NbRouteTabsetModule,
    NbButtonModule,
    NbTreeGridModule,
    NbLayoutModule,
    NbDatepickerModule,
    NbProgressBarModule,
    FormsModule,
    NbPopoverModule,
    NbAccordionModule,
    NbIconModule,
    NbAlertModule,
    FrappeGanttModule,
    ReportRoutingModule,
    NbDialogModule,
    WorkAreasModule,
    ListTableModule,
    NbSpinnerModule,
    NbListModule
  ],
})

export class ReportModule {}
