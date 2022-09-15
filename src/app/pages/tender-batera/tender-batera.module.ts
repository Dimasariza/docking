import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';
import { routedComponents, TenderBateraRoutingModule } from './tender-batera-routing.module';
import { NumberCardModule } from '@swimlane/ngx-charts';
import { NbAccordionModule, NbAlertModule, NbButtonModule, NbCardModule, NbIconModule, NbInputModule, NbPopoverModule, NbSearchModule, NbTreeGridModule } from '@nebular/theme';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TablesRoutingModule } from '../tables/tables-routing.module';
import { MatDialogModule } from '@angular/material/dialog';
import { YardDetailComponent } from './tender-batera.component';


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
    MatDialogModule
  ],
  entryComponents: [YardDetailComponent],
  declarations: [
    ...routedComponents,
    YardDetailComponent
  ],
  providers: [
  ]
})
export class TenderBateraModule { }
