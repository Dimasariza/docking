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
  }
  
  @Input() worksData : any = ""
  
  openDialog(){
    this.dialog.open(ApprovalDetailComponent)
  }

  ngOnChanges(){
    console.log(this.worksData)
    this.worksData?
    this.dataSource = this.dataSourceBuilder.create(this.worksData.work_area.map(work => 
    this.populateData(work)) as TreeNode<FSEntry>[]): ""
  }

  populateData = (work) => {          
    const {items, sfi, pekerjaan, start, end, departemen, volume, harga_satuan, kontrak , type, updated_at, id } = work           
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
        "kind" : items?.length ? 'dir' : 'doc'
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