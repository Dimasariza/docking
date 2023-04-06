import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { NbDateFnsDateModule } from '@nebular/date-fns';
import { NbAlertModule, 
  NbButtonModule, 
  NbCardModule, 
  NbDatepickerModule, 
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
import { ProjectDataComponent } from './project-data/project-data.component';
import { WorkAreaComponent } from './work-area/work-area.component';


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
    NbPopoverModule,
    NbSearchModule,
    NbAlertModule,
    NbTreeGridModule,
    NbDatepickerModule,
    NbDateFnsDateModule,
    MatDialogModule,
    NbTagModule,
    FormsModule,
    MatTableModule,
  ],
  entryComponents: [
    ProjectDataComponent,
    WorkAreaComponent,
  ],
  declarations: [
    ...routedComponents,
  ],
})
export class ProjectBateraModule{ 
}
