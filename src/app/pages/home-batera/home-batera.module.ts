import { NgModule } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { NbButtonModule, NbCardModule, NbFormFieldModule, NbIconModule, NbInputModule } from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { HomeBateraRoutingModule, routedComponents } from './home-batera-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { AddShipComponent } from './add-ship/add-ship.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';


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
  ],
  entryComponents: [AddShipComponent],
  exports: [],
  declarations: [
    ...routedComponents,
    AddShipComponent
  ],
})
export class HomeBateraModule { }
