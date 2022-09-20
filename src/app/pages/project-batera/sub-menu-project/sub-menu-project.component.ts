import { KeyValue } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface FSEntry {
  "Price A"?: string;
  "Price B"?: string;
  "Price C"?: string;
  "Job No": string;
  Job? : string;
  Dept?: string;
  Resp? : string;
  Start? : string;
  Stop? : string;
  Budget?: string;
  Contract? : string;
  Additional?: string;
  Total?: string;
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
    private route: ActivatedRoute
    ) {
    this.dataSource = this.dataSourceBuilder.create(this.data);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
    console.log(params)
      this.vesselName = params.data
    })
  }
  
  vesselName : string
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
      text : 'Add Job'
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

  dataTable = [
    {
      "vessel": "General Service",
      "customer": "Batera Line",
      "start": "15:09:19"
    },
    {
      "vessel": "Hull",
      "customer": "Batera Line",
      "start": "15:08:19"
    },
  ]

  customColumn = "Job No";
  defaultColumns = [ 'Job', 'Dept', 'Resp', 'Start', 'Stop', 'Vol', 'Unit', 'Budget','Contract', 'Additional', 'Total' ];
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

  private data: TreeNode<FSEntry>[] = [
    {
      data: { "Job No": '2.20.1', kind: 'dir' },
    },
    {
      data: { "Job No": '2.20.2', "Price A": '1.8 MB', "Price C": 'five', "Price B": 'dirt', kind: "dir" },
      children: [
        { data: { "Job No": 'project-1.doc', "Price B": 'doc', "Price A": '240 KB', kind: 'doc' } },
        { data: { "Job No": 'project-2.doc', "Price B": 'doc', "Price A": '290 KB', kind: 'doc' } },
        { data: { "Job No": 'project-3', "Price B": 'txt', "Price A": '466 KB', kind: 'doc' } },
        { data: { "Job No": 'project-4.docx', "Price B": 'docx', "Price A": '900 KB', kind: 'doc' } },
      ],
    },
  ];

  getShowOn(index: number) {
    const minWithForMultipleColumns = 400;
    const nextColumnStep = 100;
    return minWithForMultipleColumns + (nextColumnStep * index);
  }
}

@Component ({
  selector: 'ngx-sub-project-data',
  templateUrl: './sub-project-data.component.html',
})
export class SubProjectDataComponent implements OnInit{
  constructor(private route: ActivatedRoute ) {}
  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
    console.log(params)
      this.reportData.Vessel.value = params.data
    })
  }
  orderOriginal = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
    return 0
  }
  objectKeys = Object.keys;
  reportData = {
    "Vessel": {
      type : 'text',
      value : 'Batera Ship 01'
    },
    "Phase": {
      type : 'drop-down',
      value: ['Perencanaan','Pelaksanaan', 'Evaluasi']
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
      type : 'date range',
      value: ['2 Medium', '1 Hard']
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
      value : '	282000000 / day.',
      subvalue : '1.128.000.000'
    }, 
    "Repair Period": {
      type: 'date range',
      value : 'Slamet Saputro', 
    },
    "-In Dock": {
      type : 'date range',
      value : 'pertamana' 
    },
    "-Additional Days": {
      type : 'date',
      value : '0 days',
    } 
  }
}

@Component({
  selector: 'ngx-sub-price-data',
  templateUrl: './sub-price-data.component.html'
})
export class SubPriceDataComponent {
  orderOriginal = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
    return 0
  }
  objectKeys = Object.keys;
  priceHeadData = [
    'Totals', 'Budget', 'Contact', 'Actual'
  ]
  priceData = {
    'Offhire Days' : {
      type : 'title',
      Budget: 20,
      Contact: '_',
      Actual: 0,
    },
    'Owner Exp': {
      type : 'title',
      Budget: '1.412.000.000',
      Contact: '1.412.000.000',
      Actual: 0,
    },
    Supplies: {
      type : 'subTitle',
      Budget: '877.000.000',
      Contact: '877.000.000',
      Actual: 0,
    },
    Services: {
      type : 'subTitle',
      Budget: '350.000.000',
      Contact: '350.000.000',
      Actual: 0,
    },
    Class: {
      type : 'subTitle',
      Budget: 0,
      Contact: 0,
      Actual: 0,
    },
    Other: {
      type : 'subTitle',
      Budget: '185.000.000',
      Contact: '185.000.000',
      Actual: 0,
    },
    'Owner Canceled Jobs': {
      type : 'highlight',
      Budget: '_',
      Contact: 0,
      Actual: '_',
    },
    'Yard Cost': {
      type : 'title',
      Budget: '5.056.566.061',
      Contact: '4.541.787.983',
      Actual: 0,
    },
    'Yard Canceled Jobs' : {
      type : 'highlight',
      Budget: '_',
      Contact: 0,
      Actual: '_',
    },
    'Total Cost' : {
      type : 'title',
      Budget: '6.468.566.061',
      Contact: '5.953.787.983',
      Actual: 0,
    }
  } 
}


@Component({
  selector: 'ngx-sub-menu-icon',
  template: `
  <nb-tree-grid-row-toggle [expanded]="expanded" *ngIf="isDir(); else fileIcon">
  </nb-tree-grid-row-toggle>
  <ng-template #fileIcon>
    <nb-icon icon="file-text-outline"></nb-icon>
  </ng-template>
`,
})
export class SubMenuIconComponent implements OnInit{
  @Input() kind: string;
  @Input() expanded: boolean;
  isDir(): boolean {
    return this.kind === 'dir';
  }
  constructor(  ) {}
  ngOnInit(): void {  }
}