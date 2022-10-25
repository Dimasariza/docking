import { CurrencyPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { NbAlertModule, NbButtonModule, NbCardModule, NbDatepickerModule, NbIconModule, NbInputModule, NbLayoutModule, NbListModule, NbOptionModule, NbPopoverModule, NbSearchModule, NbSelectModule, NbTagModule, NbTreeGridModule } from '@nebular/theme';
import { NumberCardModule } from '@swimlane/ngx-charts';
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
  providers : [CurrencyPipe]
})
export class ProjectBateraModule{ 
}
