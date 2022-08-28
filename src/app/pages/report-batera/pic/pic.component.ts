import { Component, Input } from '@angular/core';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}
interface FSEntry {
  Title: string;
  Date?: string;
  'Last Change'?: string;
  kind?: string;
}
@Component({
  selector: 'ngx-pic',
  templateUrl: './pic.component.html',
})
export class PicComponent  {
  customColumn = 'Title';
  defaultColumns = [ 'Date', 'Last Change' ];
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
      data: { Title: 'Plan Docking', Date: '10.10.2022', 'Last Change': '22-11-18 22:07 SS' , kind: 'dir' },
    },
    {
      data: { Title: 'Spesifications', Date: '10.10.2022', 'Last Change': '22-11-18 22:07 SS', kind: 'dir', },
      children: [
        { data: { Title: 'D-12 Registration dock jobs',  Date: '10.10.2022', 'Last Change': '22-11-18 22:07 SS',kind: 'doc'} },
        { data: { Title: 'D-10 1st inspection', Date: '10.10.2022', 'Last Change': '22-11-18 22:07 SS', kind: 'doc' } },
        { data: { Title: 'D-9 to D-6 Draft docking spec',  Date: '10.10.2022', 'Last Change': '22-11-18 22:07 SS' , kind: 'doc'} },
        { data: { Title: 'D-9 to D-6 Produce Spares stores and services',  Date: '10.10.2022', 'Last Change': '22-11-18 22:07 SS' , kind: 'doc'} },
        { data: { Title: 'D-5 Prepare docking spec',  Date: '10.10.2022', 'Last Change': '22-11-18 22:07 SS', kind: 'doc'} },
        { data: { Title: 'D-5 Spesification approved',  Date: '10.10.2022', 'Last Change': '22-11-18 22:07 SS', kind: 'doc'} },
      ],
    },
    {
    data: { Title: 'Quote', Date: '10.10.2022', 'Last Change': '22-11-18 22:07 SS', kind: 'dir'},
      children: [
        { data: { Title: 'D-12 Registration dock jobs', Date: '10.10.2022', 'Last Change': '22-11-18 22:07 SS',  kind: 'doc' } },
        { data: { Title: 'D-12 Registration dock jobs', Date: '10.10.2022', 'Last Change': '22-11-18 22:07 SS',  kind: 'doc' } },
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
