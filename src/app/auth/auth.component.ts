import { Component } from '@angular/core';
import { NbAuthComponent } from '@nebular/auth';

@Component({
    selector: 'auth',
    styleUrls: ['./auth.component.scss'],
    template: `
    <nb-layout>
      <nb-layout-column class="pt-0">
        <ngx-login></ngx-login>
        <!-- <nb-card>
          <nb-card-body>
            <nb-auth-block>
              <router-outlet></router-outlet>
            </nb-auth-block>
          </nb-card-body>
        </nb-card> -->
      </nb-layout-column>
    </nb-layout>
  `,
})
export class AuthComponent extends NbAuthComponent {
}