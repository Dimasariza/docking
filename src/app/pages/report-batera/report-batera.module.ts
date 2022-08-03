import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NbCardModule, NbCheckboxModule, NbInputModule, NbListModule, NbRadioModule, NbRouteTabsetModule, NbSelectModule, NbStepperModule, NbTableModule, NbTabsetModule, NbUserModule } from '@nebular/theme';
import { ReportBateraComponent } from './report-batera.component';
import { ReportBateraRoutingModule } from './report-batera-routing.module';


@NgModule({
  declarations: [
    ReportBateraComponent
  ],
  imports: [
    CommonModule,
    NgxDatatableModule,
    NbCardModule,
    NbSelectModule,
    NbCheckboxModule,
    NbRadioModule,
    NbInputModule,
    NbTabsetModule,
    NbRouteTabsetModule,
    ReportBateraRoutingModule
    // FormsModule,
    // ReactiveFormsModule,
    // ThemeModule,
    // NbRouteTabsetModule,
    // NbStepperModule,
    // NbButtonModule,
    // NbListModule,
    // NbAccordionModule,
    // NbUserModule,
  ]
})
export class ReportBateraModule {

 }
