import { Component, Input } from '@angular/core';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';

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
  Approval?: boolean
  kind: string;
}

@Component({
  selector: 'ngx-activity-table',
  templateUrl: './table.component.html',
})
export class ActivityTableComponent {
  customColumn = 'Title';
  defaultColumns = [ 'Type', 'Status', '%', 'Start', 'Stop', 'Responsible', 'Last Change' ];
  // approvalColumns = ['Approval']
  allColumns = [ this.customColumn, ...this.defaultColumns ];

  dataSource: NbTreeGridDataSource<FSEntry>;

  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  constructor(private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>) {
    this.dataSource = this.dataSourceBuilder.create(this.data);
  }

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
      data: { Title: 'Plan Docking', Type: 'Phase', Status: '', '%':'', Start: '15-09-2018', Stop:'15-12-2018' , Responsible:'', 'Last Change': '22-11-18 22:07 SS' , kind: 'dir' },
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
    data: { Title: 'Quote', Type: 'Phase', Status: '', Start: '15-09-2018',  Stop:"15-12-2018", Responsible:'', 'Last Change': '22-11-18 22:07 SS', kind: 'dir'},
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
