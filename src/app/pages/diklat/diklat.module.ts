import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiklatRoutingModule } from './diklat-routing.module';
import { DiklatComponent } from './diklat.component';
import { KalenderComponent } from './kalender/kalender.component';
import { NbButtonModule, NbCardModule, NbIconModule, NbLayoutModule } from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { StatusComponent } from './status/status.component';

import { FullCalendarModule } from '@fullcalendar/angular'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction'; // a plugin!

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin
]);

@NgModule({
  declarations: [
    DiklatComponent,
    KalenderComponent,
    StatusComponent
  ],
  imports: [
    NgxDatatableModule,
    NbCardModule,
    ThemeModule,
    CommonModule,
    NbIconModule,
    NbButtonModule,
    NbLayoutModule,
    DiklatRoutingModule,
    FullCalendarModule, // register FullCalendar with you app
  ]
})
export class DiklatModule { }
