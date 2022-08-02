import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NgxAuthRoutingModule } from './auth-routing.module';
import { NbAuthModule } from '@nebular/auth';
import { 
  NbAlertModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
  NbMenuModule,
  NbSidebarHeaderComponent,
  NbSidebarModule,
  NbTreeGridModule
} from '@nebular/theme';
import { ThemeModule } from '../@theme/theme.module';
import { DialogAlertComponent, NgxLoginComponent } from './login/login.component';
import { TablesModule } from '../pages/tables/tables.module';
import { AuthComponent } from './auth.component';
import { TreeGridComponent } from '../pages/tables/tree-grid/tree-grid.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NbAlertModule,
    NbInputModule,
    NbButtonModule,
    NbCheckboxModule,
    NgxAuthRoutingModule,
    ThemeModule,
    NbMenuModule,
    NbAuthModule,
    NbLayoutModule,
    NbSidebarModule,
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NgxDatatableModule,
    NbFormFieldModule
  ],
  declarations: [
    NgxLoginComponent,
    AuthComponent,
    DialogAlertComponent
  ],
})
export class NgxAuthModule {
}