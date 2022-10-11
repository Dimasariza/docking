import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { routedComponents, TenderBateraRoutingModule } from './tender-batera-routing.module';
import { NumberCardModule } from '@swimlane/ngx-charts';
import { NbAccordionModule, NbAlertModule, NbButtonModule, NbCardModule, NbDatepickerModule, NbIconModule, NbInputModule, NbOptionModule, NbPopoverModule, NbSearchModule, NbSelectModule, NbTreeGridModule } from '@nebular/theme';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TablesRoutingModule } from '../tables/tables-routing.module';
import { MatDialogModule } from '@angular/material/dialog';
import { AddYardComponent } from './add-yard/add-yard.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    ThemeModule,
    NumberCardModule,
    TenderBateraRoutingModule,
    NbCardModule,
    NgxDatatableModule,
    NbPopoverModule,
    NbSearchModule,
    NbIconModule,
    NbAlertModule,
    NbButtonModule,
    NbTreeGridModule,
    NbInputModule,
    TablesRoutingModule,
    NbAccordionModule,
    MatDialogModule,
    NbInputModule,
    NbOptionModule,
    NbSelectModule,
    FormsModule,
    NbDatepickerModule
  ],
  entryComponents: [AddYardComponent],
  declarations: [
    ...routedComponents,
  ],
  providers: [
  ]
})
export class TenderBateraModule { }
