import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NgxAuthRoutingModule } from './auth-routing.module';
import { NbAuthJWTToken, NbAuthModule, NbPasswordAuthStrategy } from '@nebular/auth';
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
  NbSidebarModule,
  NbSpinnerModule,
  NbTreeGridModule
} from '@nebular/theme';
import { ThemeModule } from '../@theme/theme.module';
import { NgxLoginComponent } from './login/login.component';
import { AuthComponent } from './auth.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { environment } from '../../environments/environment';

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
    NbAuthModule.forRoot({
      strategies: [
        NbPasswordAuthStrategy.setup({
          name: 'email',

          token: {
            class: NbAuthJWTToken,

            key: 'data.access_token'
          },
         
          baseEndpoint: environment.apiUrl,
           login: {
             // ...
             endpoint: '/auth/login',
             redirect: {
              success: '/pages',
              failure: null,
             }
           },
           logout: {
             // ...
             endpoint: '/auth/logout',
             redirect: {
              success: '/'
             }
           }
        }),
      ],
      forms: {
        login: {
          redirectDelay: 0,
          showMessages: {
            success: true,
          },
        },
      },
    }),
    NbLayoutModule,
    NbSidebarModule,
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NgxDatatableModule,
    NbFormFieldModule,
    NbSpinnerModule
  ],
  declarations: [
    NgxLoginComponent,
    AuthComponent
  ],
})
export class NgxAuthModule {
}