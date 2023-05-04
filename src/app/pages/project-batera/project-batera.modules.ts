import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NbDateFnsDateModule } from '@nebular/date-fns';
import { NbAlertModule, 
  NbButtonModule, 
  NbCardModule, 
  NbDatepickerModule, 
  NbDialogModule, 
  NbIconModule, 
  NbInputModule, 
  NbListModule, 
  NbOptionModule, 
  NbPopoverModule, 
  NbSearchModule, 
  NbSelectModule, 
  NbTagModule, 
  NbTreeGridModule } from '@nebular/theme';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ThemeModule } from '../../@theme/theme.module';
import { ProjectBateraRoutingModule, routedComponents } from './project-batera-routing.module';
import { WorkAreasModule } from '../../component/work-areas/work-areas.module';
import { WorkAreasDialogModule } from '../../component/work-areas/work-areas-dialog/work-areas-dialog.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
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
    NbPopoverModule,
    NbSearchModule,
    NbAlertModule,
    NbTreeGridModule,
    NbDatepickerModule,
    NbDateFnsDateModule,
    NbTagModule,
    FormsModule,
    NbDialogModule,
    WorkAreasModule,
    WorkAreasDialogModule,
  ],
  entryComponents: [],
  declarations: [
    ...routedComponents,
  ],
})
export class ProjectBateraModule{ 
}
