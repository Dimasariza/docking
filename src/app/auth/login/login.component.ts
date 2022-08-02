import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NbAuthService, NbLoginComponent,} from '@nebular/auth';
import { NbDialogRef, NbDialogService} from '@nebular/theme';


@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class NgxLoginComponent extends NbLoginComponent {

  showPassword = true;

  getInputType() {
    if (this.showPassword) {
      return 'text';
    }
    return 'password';
  }

  toggleShowPass() {
    this.showPassword = !this.showPassword
  }
  

  dataTable = [
    {
      "name": "Diklat Prajabatan",
      "time": "12 Mei 2022 - 20 Mei 2022",
      "place": "Blended Learning"
    },
    {
      "name": "Diklat Prajabatan",
      "time": "12 Mei 2022 - 20 Mei 2022",
      "place": "Blended Learning"
    },
    {
      "name": "Diklat Prajabatan",
      "time": "12 Mei 2022 - 20 Mei 2022",
      "place": "Blended Learning"
    },
    {
      "name": "Diklat Prajabatan",
      "time": "10 Juni 2022 - 22 Juni 2022",
      "place": "Blended Learning"
    },
    {
      "name": "Diklat Prajabatan",
      "time": "12 Mei 2022 - 20 Mei 2022",
      "place": "Blended Learning"
    },
    {
      "name": "Diklat Prajabatan",
      "time": "10 Juni 2022 - 22 Juni 2022",
      "place": "Blended Learning"
    },
    {
      "name": "Diklat Prajabatan",
      "time": "12 Mei 2022 - 20 Mei 2022",
      "place": "Blended Learning"
    }
  ]


  constructor(public service: NbAuthService, public cd: ChangeDetectorRef, public router: Router, private dialogService: NbDialogService) {
    super(service, {}, cd, router)
  }

  open() {
    this.dialogService.open(DialogAlertComponent)
  }

  
}

  @Component ({
    selector: 'ngx-dialog-alert',
    template: `
      <nb-card>
        <nb-card-header>
          <div class="text-center">
            <nb-icon icon="alert-triangle"></nb-icon> &nbsp;
            <strong>PERHATIAN!</strong>
          </div>
        </nb-card-header>
        <nb-card-body class="d-inline-block">
          <div>
            <p>Anda harus login terlebih dahulu sebelum melakukan pendaftaran</p>
          </div>
        </nb-card-body>
        <nb-card-footer class="d-flex justify-content-end">
          <button class="cancel" nbButton status="danger" (click)="cancel()">Tutup</button>
        </nb-card-footer>
      </nb-card>
    `,
  })
  
  export class DialogAlertComponent {
    constructor(protected ref: NbDialogRef<DialogAlertComponent>) {}
  
    cancel() {
      this.ref.close();
    }
  
  }