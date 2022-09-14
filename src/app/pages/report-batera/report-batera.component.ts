import { KeyValue } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { NbIconLibraries, NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { ReportBateraService } from './report-batera.service';



@Component({
  selector: 'ngx-report-batera',
  templateUrl: './report-batera.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportBateraComponent {
  evaIcons = [];
  dataReport : any

  constructor(iconsLibrary: NbIconLibraries,
    private tenderBateraService : ReportBateraService,
    ) {
    this.evaIcons = Array.from(iconsLibrary.getPack('eva').icons.keys())
      .filter(icon => icon.indexOf('outline') === -1);

    iconsLibrary.registerFontPack('fa', { packClass: 'fa', iconClassPrefix: 'fa' });
    iconsLibrary.registerFontPack('far', { packClass: 'far', iconClassPrefix: 'fa' });
    iconsLibrary.registerFontPack('ion', { iconClassPrefix: 'ion' });

  }

  ngOnInit(): void {
    this.getDataReport()
  }

  getDataReport(){
    this.tenderBateraService.getDataReport().subscribe(res => {
      this.dataReport = res
      console.log(res)
    }) 
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
      <div *ngIf="reportData[item.value].type === 'date';"> 
        <div class="w-50 float-left my-1">
          <div class="row">
            <div class="col-3"><strong>{{item.value}}</strong></div>
            <input type="text" fieldSize="small" nbInput shape="rectangle" placeholder="Pick Date" [nbDatepicker]="datepicker">
            <nb-datepicker format="" #datepicker></nb-datepicker>  
          </div>
        </div>
      </div>

      <div *ngIf="reportData[item.value].type === 'drop-down';">
        <div class="w-50 float-left my-1">
          <div class="row">
            <div class="col-3"><strong>{{item.value}}</strong></div>
            <div class="dropdown" >
              <button class="btn btn-outline-primary dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false">
                DropDown
              </button>
              <div class="dropdown-menu">
                <a *ngFor = "let value of reportData[item.value].value" class="dropdown-item text-decoration-none"
                (click)="updateStatus()"
                >{{value}}</a>
              </div>
            </div>
          </div>
        </div>
      </div>  

      <div *ngIf="reportData[item.value].type === 'edit';">
        <div class="w-50 float-left my-1">
          <div class="row">
            <div class="col-3"><strong>{{item.value}}</strong></div>
            <div class="col-3">{{reportData[item.value].value}}</div>
            <button nbButton status="primary" class="mx-1" outline size="small" ghost>
              <nb-icon icon="edit-outline" pack="eva"></nb-icon>
            </button>
          </div>
        </div>
      </div>

    </div>
  `,
})
export class reportData implements OnInit{
  constructor(public ReportBateraService: ReportBateraService){}
  ngOnInit(): void {  }
  updateStatus(){
    const newFormData = { status: "on Progress"}

    this.ReportBateraService.createStatus(newFormData).subscribe(data => {
      console.log(data)
    })
  }
  orderOriginal = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
    return 0
  }
  objectKeys = Object.keys;
  
  reportData = {
    "Start": {
      type : 'date',
    },
    "Master Plan": {
      type : 'drop-down',
      value: ['Dry Docking',]
    },
    "End": {
      type: 'date',
    },
    "Status": {
      type : 'drop-down',
      value : ['In Progress', 'Done']
    },
    "State": {
      type : 'drop-down',
      value: ['Reposition', 'Plan','Evaluation']
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
      type : 'edit',
      value : 'pertamana' 
    },
    "Estimate Cost": {
      type : 'edit',
      value : 'Rp 1.400.000.000',
    } 
  }
}


@Component({
  selector: 'nb-rangepicker-showcase',
  template: `
    <nb-card size="large">
      <nb-card-body>
        <input nbInput placeholder="Pick Date" [nbDatepicker]="dateTimePicker">
        <nb-datepicker #dateTimePicker></nb-datepicker>
      </nb-card-body>
    </nb-card>
  `,
})
export class RangepickerShowcaseComponent {
}

@Component({
  selector: 'ngx-fs-icon',
  template: `
    <nb-tree-grid-row-toggle [expanded]="expanded" *ngIf="isDir(); else fileIcon">
    </nb-tree-grid-row-toggle>
    <ng-template #fileIcon>
      <nb-icon icon="file-text-outline"></nb-icon>
    </ng-template>
  `,
})
export class FsIconComponent {
  @Input() kind: string;
  @Input() expanded: boolean;

  isDir(): boolean {
    return this.kind === 'dir';
  }
}





