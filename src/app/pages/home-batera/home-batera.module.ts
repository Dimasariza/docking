import { NgModule } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { NbAlertModule, 
  NbButtonModule, 
  NbCardModule, 
  NbFormFieldModule, 
  NbIconModule, 
  NbInputModule, 
  NbPopoverModule } from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { HomeBateraRoutingModule, routedComponents } from './home-batera-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UpdateShipComponent } from './update-ship/update-ship.component';
import { ShipActionComponent } from './ship-action/ship-action.component';


@NgModule({
  imports: [
    ThemeModule,
    HomeBateraRoutingModule,
    NgxEchartsModule,
    NbCardModule,
    NbIconModule,
    NbButtonModule,
    NbInputModule,
    HttpClientModule,
    MatDialogModule,
    NbFormFieldModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    NbPopoverModule,
    NbAlertModule,
  ],
  entryComponents: [ShipActionComponent, UpdateShipComponent],
  exports: [],
  declarations: [
    ...routedComponents,
  ],
})
export class HomeBateraModule { }
