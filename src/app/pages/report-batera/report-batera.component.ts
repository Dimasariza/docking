import { KeyValue } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NbDateService, NbIconLibraries, } from '@nebular/theme';
import { PagesRoutingModule } from '../pages-routing.module';
import { WorkAreaComponent } from '../project-batera/work-area/work-area.component';
import { ReportBateraService } from './report-batera.service';

@Component({
  selector: 'ngx-report-batera',
  templateUrl: './report-batera.component.html',
})
export class ReportBateraComponent {
  evaIcons = [];
  dataReport : any

  constructor(iconsLibrary: NbIconLibraries,
    private reportBateraService : ReportBateraService,
    private dialog : MatDialog,
    public activatedRoute : ActivatedRoute,
    public pageService : PagesRoutingModule
    ) {
    this.evaIcons = Array.from(iconsLibrary.getPack('eva').icons.keys())
      .filter(icon => icon.indexOf('outline') === -1);
    iconsLibrary.registerFontPack('fa', { packClass: 'fa', iconClassPrefix: 'fa' });
    iconsLibrary.registerFontPack('far', { packClass: 'far', iconClassPrefix: 'fa' });
    iconsLibrary.registerFontPack('ion', { iconClassPrefix: 'ion' });
  }

  projectData : any
  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id')
    this.reportBateraService.getProjectData(id)
    .subscribe(({data} : any) => {
      this.projectData = data
      console.log(data)
    })

  }

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

  addJobDial(){
    const dialogConfig = new MatDialogConfig();
    const dialogRef = this.dialog.open(WorkAreaComponent, {
      disableClose : true, autoFocus:true, 
    })
  }
}

@Component ({
  selector: 'ngx-report-data',
  template: `
  <div class="d-flex flex-column col-xl-6 col-lg-6 col-md-6">
    <div *ngFor = "let item of objectKeys(reportData) | keyvalue: orderOriginal">
      <div class="mt-2 row" *ngIf="reportData[item.value].type === 'date';" > 
        <div class="col-6"><strong>{{item.value}}</strong></div>
        <input class="col-3" type="text" fieldSize="small" nbInput shape="rectangle" placeholder="Pick Date" [nbDatepicker]="datepicker">
        <nb-datepicker #datepicker [min]="min"></nb-datepicker>  
      </div>

      <div class="mt-2 row" *ngIf="reportData[item.value].type === 'drop-down';">
        <div class="col-6"><strong>{{item.value}}</strong></div>
        <nb-select selected="1" class="" size="tiny" status="primary">
          <nb-option value="1" *ngFor = "let value of reportData[item.value].value">{{value}}</nb-option>
        </nb-select>
      </div>

    </div>
  </div>

  <div class="d-flex flex-column col-xl-6 col-lg-6 col-md-6" >
    <div *ngFor = "let item of objectKeys(reportData) | keyvalue: orderOriginal">
      <div class="mt-2 row" *ngIf="reportData[item.value].type === 'edit';">
        <div class="col-6"><strong>{{item.value}}</strong></div>
        <div class="col-4">{{reportData[item.value].value}}</div>
        <button nbButton status="primary" class="mx-1 col-auto" outline size="small" ghost (click)="onEdit(reportData[item.value])">
          <nb-icon icon="edit-outline" pack="eva"></nb-icon>
        </button>
      </div>

      <div class="mt-2 row" *ngIf="reportData[item.value].type === 'onEdit';">
        <div class="col-6"><strong>{{item.value}}</strong></div>
          <form #dataForms (ngSubmit)="onSubmit(dataForms)" [formGroup]="myform">
            <input class="col-4" type="text" nbInput placeholder="{{reportData[item.value].value}}" fieldSize="tiny" [(ngModel)]="inputData" (keydown.enter)="handleKeyEnter($event)">
            <button nbButton type="submit" status="primary" class="mx-1 col-auto" outline size="small" ghost (click)="onEdit(reportData[item.value])">
            <nb-icon icon="checkmark-square-2-outline" pack="eva"></nb-icon>
            </button>
        </form> 
      </div>

    </div>
  </div>

      `,
})
export class reportData implements OnInit{
  min: Date;
  myform : FormGroup;

  constructor(
    public ReportBateraService: ReportBateraService,
    protected dateService: NbDateService<Date>,
  )
  {
    this.min = this.dateService.addMonth(this.dateService.today(), 0);
  }

  ngOnInit(): void {  }

  onEdit(item : any){
    item.type === "edit" ? item.type = "onEdit" : item.type = "edit"
    console.log(item.type)
  }


  onSubmit(data){
    console.log(data)
    if (this.myform.valid) {
      console.log("Form Submitted!");
    }
  }

  handleKeyEnter(event) {
    event.preventDefault();
    console.log("done")
  }

  updateStatus(){
    const newFormData = { status: "on Progress"}
    this.ReportBateraService.createStatus(newFormData).subscribe(data => {
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
    "End": {
      type: 'date',
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
    "Vessel/Asset": {
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





