import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { routedComponents, TenderBateraRoutingModule } from './tender-batera-routing.module';
import { NumberCardModule } from '@swimlane/ngx-charts';
import { NbAccordionModule, NbAlertModule, NbButtonModule, NbCardModule, NbDatepickerModule, NbDialogModule, NbIconModule, NbInputModule, NbListModule, NbMenuModule, NbOptionModule, NbPopoverModule, NbSearchModule, NbSelectModule, NbTreeGridModule } from '@nebular/theme';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatDialogModule } from '@angular/material/dialog';
import { ContractActionComponent } from './contract-action/contract-action.component';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { TenderBateraComponent } from './tender-batera.component';
import { WorkAreasModule } from '../../component/work-areas/work-areas.module';

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
    NbAccordionModule,
    MatDialogModule,
    NbInputModule,
    NbOptionModule,
    NbSelectModule,
    FormsModule,
    NbDatepickerModule,
    NbDialogModule,
    NbListModule,
    NbMenuModule,
    WorkAreasModule
  ],
  entryComponents: [ContractActionComponent],
  declarations: [
    ...routedComponents,
  ],
  providers: [CurrencyPipe],
  bootstrap: [TenderBateraComponent]
})
export class TenderBateraModule { }
