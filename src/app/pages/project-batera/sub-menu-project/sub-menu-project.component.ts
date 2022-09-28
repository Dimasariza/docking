import { KeyValue } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { ProjectBateraService } from '../project-batera.service';
import { HttpResponse } from '@angular/common/http';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { WorkAreaComponent } from '../work-area/work-area.component';

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface FSEntry {
  "Job No": string;
  Job? : string;
  Dept?: string;
  Resp? : string;
  Start? : string;
  Stop? : string;
  "Unit Price Budget"?: string;
  "Total Price Budget"? : string;
  "Category"?: string;
  Remarks?: string;
  Edit?: boolean
  kind: string;
}

@Component({
  selector: 'ngx-sub-menu-project',
  templateUrl: './sub-menu-project.component.html',
})

export class SubMenuProjectComponent implements OnInit {
  constructor(
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>,
    private route: ActivatedRoute,
    public dialog : MatDialog,
    private service : ProjectBateraService){
    this.dataSource = this.dataSourceBuilder.create(this.datas);
  }
  public subProjectMenu
  public workArea : TreeNode<FSEntry> []

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id')

    this.service.getSubProjectData(id)
      .subscribe(({data} : any) => {
        const {work_area} = data
        const populateData = (work, kind) => {          
          const {items, sfi, pekerjaan, start, end, departemen, } = work           
          return {
            data: {
              "Job No": sfi,
              "Job": pekerjaan,
              "Start": start,
              "Stop": end,
              "Dept": departemen,
              kind
            },
            children: items?.length ? items.map(child => populateData(child, 'doc')) : []
          }
        }
        this.dataSource = this.dataSourceBuilder.create(work_area.map(work => populateData(work, 'dir')) as TreeNode<FSEntry>[])
      })
  }

  customColumn = "Job No";
  defaultColumns = [ 'Job', 'Dept', 'Resp', 'Start', 'Stop', 'Vol', 'Unit', 'Unit Price','Total Price Budget', 'Category', 'Remarks' ];
  editColumn = 'Edit'
  allColumns = [ this.customColumn, ...this.defaultColumns, this.editColumn];

  dataSource: NbTreeGridDataSource<FSEntry>; 
  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  updateSort(sortRequest: NbSortRequest): void {
    this.sortColumn = sortRequest.column;
    this.sortDirection = sortRequest.direction;
  }

  getSortDirection(column: string): NbSortDirection {
    if (this.sortColumn === column) {
      return this.sortDirection;
    }
    return NbSortDirection.NONE;
  }

  private datas: TreeNode<FSEntry>[] =   
    [
      {
        data: { "Job No": '2.20.1', kind: 'dir' },
      },
      {
        data: { "Job No": '2.20.2', kind: "dir" },
        children: [
          { data: { "Job No": 'project-1.doc', kind: 'doc' } },
          { data: { "Job No": 'project-2.doc', kind: 'doc' } },
          { data: { "Job No": 'project-3', kind: 'doc' } },
          { data: { "Job No": 'project-4.docx', kind: 'doc' } },
        ],
      },
    ];

  getShowOn(index: number) {
    const minWithForMultipleColumns = 400;
    const nextColumnStep = 100;
    return minWithForMultipleColumns + (nextColumnStep * index);
  }
  
  menuButton = [
    {
      position: 'top',
      icon: 'list-outline',
      text : 'List'
    },
    {
      position: 'top',
      icon: 'calendar-outline',
      text: 'Schedule'
    },
    {
      position: 'top',
      icon: 'file-add-outline',
      text: 'Extract Data File'
    },
    {
      position: 'top',
      icon: 'clipboard-outline',
      text: 'Gant'
    },
    {
      position: 'bottom',
      text : 'Add Job',
    },
    {
      position: 'bottom',
      text : 'Export To PDF'
    },
    {
      position: 'bottom',
      text : 'Expand All'
    },
    {
      position: 'bottom',
      text : 'Refresh'
    },
    {
      position: 'bottom',
      text : 'Show Budget'
    },
    {
      position: 'bottom',
      text: 'Show Contract'
    }
  ]

  btnAct(e){
    switch(e) {
      case 'Add Job':
        this.addWorkAreaDial()
        break;
    }
  }

  addWorkAreaDial(){
    const dialogConfig = new MatDialogConfig();
    const dialogRef = this.dialog.open(WorkAreaComponent, {
      disableClose : true, autoFocus:true, 
    })
  }

}








@Component ({
  selector: 'ngx-sub-project-data',
  templateUrl: './sub-project-data.component.html',
})
export class SubProjectDataComponent implements OnInit{
  @Input() dataProyek : any

  constructor(private route: ActivatedRoute, private service : ProjectBateraService ) {}
  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      this.service.getSubProjectData(params.data)
      .subscribe((res) => {
        this.dataProyek = res
        this.reportData.Vessel.value = this.dataProyek.data.kapal.nama_kapal
        this.reportData["Base Currency"].value = this.dataProyek.data.mata_uang
        this.reportData["-Bunker"].value = this.dataProyek.data.off_hire_bunker_per_day + ' / day'
        this.reportData["-Rate"].value = this.dataProyek.data.off_hire_rate_per_day + ' / day'
        this.reportData["-Deviation"].value = this.dataProyek.data.off_hire_deviasi + 'days'
        this.reportData["Off Hire Period"].value = this.dataProyek.data.off_hire_period + ' days'
        this.reportData["Repair Period"].value = this.dataProyek.data.repair_period + ' days'
        this.reportData["-In Dock"].value = this.dataProyek.data.repair_in_dock_period + ' days'
        this.reportData["-Additional Days"].value = this.dataProyek.data.repair_additional_day + ' days'
      })
    })
  }
  orderOriginal = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
    return 0
  }
  objectKeys = Object.keys;

  reportData = {
    "Vessel": {
      type : 'text',
      value : ''
    },
    "Phase": {
      type : 'drop-down',
      value: ['Requisition','In Progress', 'Evaluation', 'Finish']
    },
    "Selected Yard": {
      type : 'text',
      value : 'Batera Yard 01'
    },
    "Base Currency": {
      type : 'text',
      value : '*IDR'
    },
    "Off Hire Period": {
      type : 'text',
      value: ''
    },
    "-Deviation": {
      type : 'date',
      value: '4 days'
    },
    "-Rate": {
      type : 'price',
      value: '71050000 / day.', 
      subvalue : '1.421.000.000'
    } ,
    "-Bunker": {
      type : 'price',
      value : '',
      subvalue : '1.128.000.000'
    }, 
    "Repair Period": {
      type: 'text',
      value : '', 
    },
    "-In Dock": {
      type : 'text',
      value : '' 
    },
    "-Additional Days": {
      type : 'text',
      value : '',
    } 
  }
}




@Component({
  selector: 'ngx-sub-price-data',
  templateUrl: './sub-price-data.component.html'
})
export class SubPriceDataComponent implements OnInit {
  constructor(private route: ActivatedRoute, private service : ProjectBateraService ) {}

  private dataPrice : any
  ngOnInit() : void {
    this.route.queryParams.subscribe((params: any) => {
      this.service.getSubProjectData(params.data)
      .subscribe((res) => {
        this.dataPrice = res
        this.dataPrice = this.dataPrice.data
        this.priceData['Owner Canceled Jobs'].Budget = this.dataPrice.owner_cancel_job
      })
    })

  }
  

  orderOriginal = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
    return 0
  }
  objectKeys = Object.keys;
  priceHeadData = [
    'Totals', 'Budget', 'Contract', 'Actual'
  ]
  priceData = {
    'Offhire Days' : {
      type : 'title',
      Budget: 20,
      Contract: '_',
      Actual: 0,
    },
    'Owner Exp': {
      type : 'title',
      Budget: '1.412.000.000',
      Contract: '1.412.000.000',
      Actual: 0,
    },
    Supplies: {
      type : 'subTitle',
      Budget: '877.000.000',
      Contract: '877.000.000',
      Actual: 0,
    },
    Services: {
      type : 'subTitle',
      Budget: '350.000.000',
      Contract: '350.000.000',
      Actual: 0,
    },
    Class: {
      type : 'subTitle',
      Budget: 0,
      Contract: 0,
      Actual: 0,
    },
    Other: {
      type : 'subTitle',
      Budget: '185.000.000',
      Contract: '185.000.000',
      Actual: 0,
    },
    'Owner Canceled Jobs': {
      type : 'highlight',
      Budget: '_',
      Contract: 0,
      Actual: '_',
    },
    'Yard Cost': {
      type : 'title',
      Budget: '5.056.566.061',
      Contract: '4.541.787.983',
      Actual: 0,
    },
    'Yard Canceled Jobs' : {
      type : 'highlight',
      Budget: '_',
      Contract: 0,
      Actual: '_',
    },
    'Total Cost' : {
      type : 'title',
      Budget: '6.468.566.061',
      Contract: '5.953.787.983',
      Actual: 0,
    }
  } 
}
