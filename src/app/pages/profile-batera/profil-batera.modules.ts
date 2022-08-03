import { NgModule } from '@angular/core';
import { NbButtonGroupModule, NbButtonModule, NbCardModule, NbIconModule, NbInputModule } from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { ProfilBateraRoutingModule, routedComponents } from './profil-batera-routing.module';
import { ProfilBateraComponent } from './profil-batera.component';

@NgModule({
  imports: [
    NbIconModule,
    ThemeModule,
    NbCardModule,
    ProfilBateraRoutingModule,
    NbButtonGroupModule,
    NbButtonModule,
    NbInputModule,
  ],
  declarations: [
    ProfilBateraComponent
  ],
})
export class ProfilBateraModule{ 
}
