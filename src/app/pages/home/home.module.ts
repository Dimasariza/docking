import { NgModule } from '@angular/core';
import { NbAlertModule, 
  NbBadgeModule, 
  NbButtonModule, 
  NbCardModule, 
  NbDialogModule, 
  NbIconModule, 
  NbInputModule, 
  NbPopoverModule, 
  NbProgressBarModule, 
  NbSpinnerModule,
} from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { HomeRoutingModule, routedComponents } from './home-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    ThemeModule,
    HomeRoutingModule,
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
    NbBadgeModule,
    NbProgressBarModule
  ],
  exports: [],
  declarations: [
    ...routedComponents,
  ],
})
export class HomeModule { }
