import { NgModule } from '@angular/core';
import { NbAlertModule, 
  NbButtonModule, 
  NbCardModule, 
  NbDialogModule, 
  NbIconModule, 
  NbInputModule, 
  NbPopoverModule, 
  NbSpinnerModule,
  NbToastrModule,
} from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { HomeBateraRoutingModule, routedComponents } from './home-batera-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    ThemeModule,
    HomeBateraRoutingModule,
    NbCardModule,
    NbIconModule,
    NbButtonModule,
    NbInputModule,
    HttpClientModule,
    CommonModule,
    NbPopoverModule,
    NbAlertModule,
    NbSpinnerModule,
    NbDialogModule,
    FormsModule,
  ],
  exports: [],
  declarations: [
    ...routedComponents,
  ],
})
export class HomeBateraModule { }
