import { NgModule } from '@angular/core';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NbAlertModule, NbButtonModule, NbCardModule, NbDatepicker, NbDatepickerModule, NbIconModule, NbInputModule, NbLayoutModule, NbListModule, NbMenuModule, NbOptionModule, NbPopoverModule, NbSearchModule, NbSelectModule, NbTagModule, NbTreeGridModule } from '@nebular/theme';
import { NumberCardModule } from '@swimlane/ngx-charts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { ThemeModule } from '../../@theme/theme.module';
import { AddNewProjectComponent } from './add-new-project/add-new-project.component';
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
    MatDialogModule,
    MatFormFieldModule,
    MatOptionModule,
    NbTagModule
  ],
  entryComponents: [AddNewProjectComponent],
  declarations: [
    ...routedComponents,
  ],
})
export class ProjectBateraModule{ 
}
