import { NgModule } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { NbButtonModule, NbCardModule, NbFormFieldModule, NbIconModule, NbInputModule } from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { HomeBateraRoutingModule, routedComponents } from './home-batera-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { AddShipComponent } from './add-ship/add-ship.component';
import { FormsModule } from '@angular/forms';


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
    FormsModule
  ],
  entryComponents: [AddShipComponent],
  exports: [],
  declarations: [
    ...routedComponents,
    AddShipComponent
  ],
})
export class HomeBateraModule { }
