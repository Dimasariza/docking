import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NbIconLibraries } from '@nebular/theme';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { WorkAreaComponent } from '../../project-batera/work-area/work-area.component';


interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface FSEntry {
  Title: string;
  Type?: string;
  Status?:string;
  "%"?:string;
  Start: string;
  Stop?: string;
  Responsible?: string;
  'Last Change'?: string;
  Approval?: boolean;
  Comment?: string,
  kind: string;
}

@Component({
  selector: 'ngx-work-progress',
  templateUrl: './work-progress.component.html',
})

export class WorkProgressComponent {
  evaIcons = [];
  constructor(
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>,
    private iconsLibrary: NbIconLibraries,
    private dialog : MatDialog,
    public activatedRoute: ActivatedRoute
    ) {
    this.evaIcons = Array.from(iconsLibrary.getPack('eva').icons.keys())
      .filter(icon => icon.indexOf('outline') === -1);
    iconsLibrary.registerFontPack('fa', { packClass: 'fa', iconClassPrefix: 'fa' });
    iconsLibrary.registerFontPack('far', { packClass: 'far', iconClassPrefix: 'fa' });
    iconsLibrary.registerFontPack('ion', { iconClassPrefix: 'ion' });
    this.dataSource = this.dataSourceBuilder.create(this.data);
  }
  
  @Input() worksData = []

  openDialog(){
    this.dialog.open(ApprovalDetailComponent)
  }

  ngOnInit(){
    const id = this.activatedRoute.snapshot.paramMap.get('id')
  }

  populateData = (work) => {          
    const {items, sfi, pekerjaan, start, end, departemen, volume, harga_satuan, kontrak , type, remarks, updated_at, id } = work           
      return {
      data: {
        "Job No": sfi,
        "Job": pekerjaan,
        "Dept": departemen,
        "Start": start,
        "Stop": end,
        "Vol" : volume,
        "Unit" : '',
        "Unit Price": harga_satuan,
        "Total Price Budget" : kontrak,
        "Category" : type,
        "Remarks" : updated_at,
        "index" : id,
        kind: items?.length ? 'dir' : 'doc'
      },
      children: items?.length ? items.map(child => this.populateData(child)) : []
    }
  }

  defaultColumns = ['Job', 'Type', 'Status', '%', 'Start', 'Stop', 'Responsible', 'Last Change', 'Vol', 'Unit', 'Unit Price Actual', 'Total Price Actual' ];
  allColumns = [...this.defaultColumns, 'Approved', "Comment" ];

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
      data: { Title: 'Plan Docking', Type: 'Phase', Status: '', '%':'', Start: '15-09-2018', Stop:'15-12-2018' , Responsible:'', 'Last Change': '22-11-18 22:07 SS' , Approval: true ,kind: 'dir' },
    },
    {
      data: { Title: 'Spesifications', Type: 'Phase', Status: '', '%':'', Start: '15-09-2018', Stop:"15-12-2018" , Responsible:'', 'Last Change': '22-11-18 22:07 SS', kind: 'dir', },
      children: [
        { data: { Title: 'D-12 Registration dock jobs', Type: 'Activity', Status: '', Start: '15-09-2018', Stop:"15-12-2018", Responsible:'', 'Last Change': '22-11-18 22:07 SS',kind: 'doc'} },
        { data: { Title: 'D-10 1st inspection', Type: 'Activity', Status: '',  Start: '15-09-2018', Stop:"15-12-2018", Responsible:'', 'Last Change': '22-11-18 22:07 SS', kind: 'doc' } },
        { data: { Title: 'D-9 to D-6 Draft docking spec', Type: 'Activity', Status: '', Start: '15-09-2018', Stop:"15-12-2018", Responsible:'', 'Last Change': '22-11-18 22:07 SS' , kind: 'doc'} },
        { data: { Title: 'D-9 to D-6 Produce Spares stores and services', Type: 'Activity', Status: '', Start: '15-09-2018', Stop:"15-12-2018", Responsible:'', 'Last Change': '22-11-18 22:07 SS' , kind: 'doc'} },
        { data: { Title: 'D-5 Prepare docking spec', Type: 'Activity', Status: '', Start: '15-09-2018', Stop:"15-12-2018", Responsible:'', 'Last Change': '22-11-18 22:07 SS', kind: 'doc'} },
        { data: { Title: 'D-5 Spesification approved', Type: 'Milestone', Status: '', Start: '15-09-2018', Stop:"15-12-2018", Responsible:'', 'Last Change': '22-11-18 22:07 SS', kind: 'doc'} },
      ],
    },
    {
    data: { Title: 'Quote', Type: 'Phase', Status: '', Start: '15-09-2018',  Stop:"15-12-2018", Responsible:'', 'Last Change': '22-11-18 22:07 SS', kind: 'dir', Approval: true},
      children: [
        { data: { Title: 'D-12 Registration dock jobs', Type: 'Active', Status: '', Start: '15-09-2018', Stop:"15-12-2018", Responsible:'', 'Last Change': '22-11-18 22:07 SS',  kind: 'doc' } },
        { data: { Title: 'D-12 Registration dock jobs', Type: 'Active', Status: '', Start: '15-09-2018', Stop:"15-12-2018", Responsible:'', 'Last Change': '22-11-18 22:07 SS',  kind: 'doc' } },
      ],
    },
  ];

  getShowOn(index: number) {
    const minWithForMultipleColumns = 400;
    const nextColumnStep = 100;
    return minWithForMultipleColumns + (nextColumnStep * index);
  }

  onClick(desc){
    switch (desc) {
      case 'Add Job' :
        this.addJobDial()
        break;
    }
  }

  addJobDial(){
    const dialogConfig = new MatDialogConfig();
    const dialogRef = this.dialog.open(WorkAreaComponent, {
      disableClose : true, autoFocus:true, 
    })
    console.log("open dialog")
  }

  useIcons = [
    {
    icon: 'refresh',
    desc: 'Refresh'
    },
    {
      icon: 'plus',
      desc: 'Add Phase'
    },
    {
      icon: 'list',
      desc: 'Add Activity'
    },
    {
      icon: 'flag-outline',
      desc: 'Add Job'
    },
    {
      icon: 'external-link',
      desc: 'Export to Excel'
    },
    {
      icon: 'plus-square-outline',
      desc: 'Expand'
    },
    {
      icon: 'minus',
      desc: 'Send Notification'
    }
  ]
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

@Component({
  selector: 'ngx-approval-icon',
  template: `
    <nb-tree-grid-row-toggle [approval]="expanded" *ngIf="isCheck(); else fileIcon"></nb-tree-grid-row-toggle>
    <ng-template #fileIcon>
      <nb-icon icon="check"></nb-icon>
    </ng-template>
  `,
})
export class approvalIconComponent {
  @Input() approval: boolean;
  isCheck(): boolean {
    return this.approval === true;
  }
}

@Component({
  selector: 'ngx-approval-detail',
  template: `
    <nb-card>
      <nb-card-header>
        <h5>Approval Detail</h5>
      </nb-card-header>
      <nb-card-body>
        Lorem Ipusm Dolor Sitamet
      </nb-card-body>
    </nb-card>
  `,
})
export class ApprovalDetailComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }
}