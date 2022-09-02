import { KeyValue } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NbIconLibraries } from '@nebular/theme';

@Component({
  selector: 'ngx-report-batera',
  templateUrl: './report-batera.component.html',
  styleUrls: ['./report-batera.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportBateraComponent {
  evaIcons = [];

  constructor(iconsLibrary: NbIconLibraries) {
    this.evaIcons = Array.from(iconsLibrary.getPack('eva').icons.keys())
      .filter(icon => icon.indexOf('outline') === -1);

    iconsLibrary.registerFontPack('fa', { packClass: 'fa', iconClassPrefix: 'fa' });
    iconsLibrary.registerFontPack('far', { packClass: 'far', iconClassPrefix: 'fa' });
    iconsLibrary.registerFontPack('ion', { iconClassPrefix: 'ion' });
  }

  tabs: any[] = [
    {
      title: 'PIC',
      route: '/pages/report-batera/pic',
    },
    {
      title: 'Work Progress',
      route: '/pages/report-batera/work-progress',
    },
    {
      title: 'BAST*',
      route: '/pages/report-batera/bast',
    },
    {
      title: 'Surat Teguran*',
      route: '/pages/report-batera/surat-teguran',
    },
    {
      title: 'Close Out Report(COR)*',
      route: '/pages/report-batera/close-out',
    },
  ];

  buttonKey = [
    { icon : "menu-2-outline",
      menu : "New Log"
    },
    { icon : "checkmark-square-outline",
      menu : "New Task"
    },
    { icon : "people-outline",
      menu : "New Meeting"
    },
    { icon : "plus-circle-outline",
      menu : "New Project Status"
    },
  ];
}

@Component ({
  selector: 'ngx-report-data',
  template: `
    <div *ngFor = "let item of objectKeys(reportData) | keyvalue: orderOriginal">
      <div *ngIf="reportData[item.value].type === 'drop-down'; else editBlock;">
        <div class="w-50 float-left">
          <div class="row m-2">
            <div class="col-3"><strong>{{item.value}}</strong></div>

            <div class="dropdown" >
              <button class="btn btn-outline-primary dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false">
                {{reportData[item.value].value[0]}}
              </button>
              <div class="dropdown-menu">
                <a *ngFor = "let value of reportData[item.value].value" class="dropdown-item text-decoration-none">{{value}}</a>
              </div>
            </div>

          </div>
        </div>
      </div>  

      <ng-template #editBlock>
        <div class="w-50 float-left">
          <div class="row m-2">
            <div class="col-3"><strong>{{item.value}}</strong></div>
            <div class="col-3">{{reportData[item.value].value}}</div>
            <button nbButton status="primary" class="mx-1" outline size="small" ghost>
              <nb-icon icon="edit-outline" pack="eva"></nb-icon>
            </button>
          </div>
        </div>
      </ng-template>
    </div>
  `,
})
export class reportData {
  orderOriginal = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
    return 0
  }
  objectKeys = Object.keys;
  reportData = {
    "Start/End": {
      type : 'text',
      value : '10.10.2022'
    },
    "Master Plan": {
      type : 'drop-down',
      value: ['Dry Docking',]
    },
    "Status": {
      type : 'drop-down',
      value : ['In Progress', 'Done']
    },
    "State": {
      type : 'drop-down',
      value: ['Planning', 'Done']
    },
    "Project Type": {
      type : 'drop-down',
      value : ['Dry-Docking']
    },
    "Priority": {
      type : 'drop-down',
      value: ['2 Medium', '1 Hard']
    },
    "Company": {
      type : 'edit',
      value: 'Meratus Line', 
    } ,
    "Veseel/Asset": {
      type : 'edit',
      value : 'Meratus Batam',
    }, 
    "Responsible": {
      type: 'edit',
      value : 'Slamet Saputro', 
    },
    "Partner": {
      type : 'text',
      value : 'pertamana' 
    },
    "Estimate Cost": {
      type : 'edit',
      value : 'Rp 1.400.000.000',
    } 
  }
}


