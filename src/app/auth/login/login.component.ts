import { Component, OnInit } from '@angular/core';
import { NbAuthResult, NbLoginComponent } from '@nebular/auth';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
})
export class NgxLoginComponent extends NbLoginComponent {

  login(): void {
    this.errors = [];
    this.messages = [];
    this.submitted = true;

    this.service.authenticate(this.strategy, this.user).subscribe((result: NbAuthResult) => {
      this.submitted = false;

      if (result.isSuccess()) {
        this.messages = result.getMessages();
      } else {
        this.errors = result.getErrors();
      }

      const redirect = result.getRedirect();
      console.log(redirect);
      
      if (redirect) {
        setTimeout(() => {
          return this.router.navigateByUrl(/*redirect*/'/pages');
        }, this.redirectDelay);
      }
      this.cd.detectChanges();
    });
  }

}