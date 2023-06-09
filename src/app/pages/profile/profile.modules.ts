import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NbAlertComponent, NbAlertModule, NbButtonGroupModule, 
  NbButtonModule, 
  NbCardModule, 
  NbIconModule, 
  NbInputModule, 
  NbSelectModule 
} from '@nebular/theme';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ThemeModule } from '../../@theme/theme.module';
import { ProfilRoutingModule, routedComponents } from './profile-routing.module';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { UserActionComponent } from './user-action/user-action.component';

@NgModule({
  imports: [
    NbIconModule,
    ThemeModule,
    NbCardModule,
    ProfilRoutingModule,
    NbButtonGroupModule,
    NbButtonModule,
    NbInputModule,
    NgxDatatableModule,
    HttpClientModule,
    FormsModule,
    MatInputModule,
    MatDialogModule,
    NbSelectModule,
    NbAlertModule
  ],
  entryComponents: [UserActionComponent],
  declarations: [
    ...routedComponents
  ],
})
export class ProfileModule{ 
}
