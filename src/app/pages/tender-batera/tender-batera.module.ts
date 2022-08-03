import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';
import { routedComponents, TenderBateraRoutingModule } from './tender-batera-routing.module';
import { NumberCardModule } from '@swimlane/ngx-charts';
import { NbAlertModule, NbCardBodyComponent, NbCardComponent, NbCardModule, NbIconModule, NbInputModule, NbOptionModule, NbPopoverModule, NbSearchModule, NbSelectModule, NbTreeGridColumnDefDirective } from '@nebular/theme';

@NgModule({
  imports: [
    ThemeModule,
    NumberCardModule,
    TenderBateraRoutingModule,
    NbCardModule,

    NbPopoverModule,
    NbSearchModule,
    NbIconModule,
    NbAlertModule,
    // NbTreeGridColumnDefDirective
  ],
  declarations: [
    ...routedComponents,
  ],
})
export class TenderBateraModule { }
