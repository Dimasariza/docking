import { NgModule } from '@angular/core';
import { NbAlertModule, NbButtonModule, NbCardModule, NbDatepicker, NbDatepickerModule, NbIconModule, NbInputModule, NbLayoutModule, NbListModule, NbOptionModule, NbPopoverModule, NbSearchModule, NbSelectModule, NbTreeGridModule } from '@nebular/theme';
import { NumberCardModule } from '@swimlane/ngx-charts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { ThemeModule } from '../../@theme/theme.module';
import { ProjectBateraRoutingModule, routedComponents } from './project-batera-routing.module';

@NgModule({
  imports: [
    NbCardModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    NgxDatatableModule,
    ProjectBateraRoutingModule,
    NbOptionModule,
    NbSelectModule,
    NbButtonModule,
    NbListModule,
    NumberCardModule,
    NbPopoverModule,
    NbSearchModule,
    NbAlertModule,
    NbTreeGridModule,
    NbLayoutModule,
    NbDatepickerModule,
  ],
  declarations: [
    ...routedComponents,
  ],
})
export class ProjectBateraModule{ 
}
