import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NbButtonGroupModule, NbButtonModule, NbCardModule, NbIconModule, NbInputModule } from '@nebular/theme';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ThemeModule } from '../../@theme/theme.module';
import { ProfilBateraRoutingModule, routedComponents } from './profil-batera-routing.module';
import { ProfilBateraComponent } from './profil-batera.component';
import { MatInputModule } from '@angular/material/input';
import { ChangeLogoComponent } from './change-logo/change-logo.component';
import { MatDialogModule } from '@angular/material/dialog';
import { AddUserComponent } from './add-user/add-user.component';


@NgModule({
  imports: [
    NbIconModule,
    ThemeModule,
    NbCardModule,
    ProfilBateraRoutingModule,
    NbButtonGroupModule,
    NbButtonModule,
    NbInputModule,
    NgxDatatableModule,
    HttpClientModule,
    FormsModule,
    MatInputModule,
    MatDialogModule,
  ],
  entryComponents: [ChangeLogoComponent],
  declarations: [
    ...routedComponents
  ],
})
export class ProfilBateraModule{ 
}
