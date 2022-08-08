import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';
import { routedComponents, TenderBateraRoutingModule } from './tender-batera-routing.module';
import { NumberCardModule } from '@swimlane/ngx-charts';
import { NbAlertModule, NbButtonModule, NbCardModule, NbIconModule, NbInputModule, NbPopoverModule, NbSearchModule, NbTreeGridModule } from '@nebular/theme';
import { CardComponent } from './card/card.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TablesRoutingModule } from '../tables/tables-routing.module';
import { FsIconComponent } from './tender-batera.component';
import { TableComponent } from './table/table.component';

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
  ],
  declarations: [
    ...routedComponents,
    CardComponent
  ],
  providers: [
  ]
})
export class TenderBateraModule { }
