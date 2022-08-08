import { Component, Input } from '@angular/core';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface FSEntry {
  Part: string;
  "Price A": string;
  "Price B": string;
  "Price C"?: string;
}

@Component({
  selector: 'ngx-tender-batera',
  templateUrl: './tender-batera.component.html',
  styleUrls: ['./tender-batera.component.scss']
})

export class TenderBateraComponent {
  
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

  customColumn = 'Part';
  defaultColumns = [  'Price A', "Price B" ,'Price C' ];
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
      data: { Part: 'General Service', "Price B" : 'di', "Price A": '400 KB', "Price C": '2' },
    },
    {
      data: { Part: 'Projects', "Price A": '1.8 MB', "Price C": 'five', "Price B": 'dirt' },
      children: [
        { data: { Part: 'project-1.doc', "Price B": 'doc', "Price A": '240 KB' } },
        { data: { Part: 'project-2.doc', "Price B": 'doc', "Price A": '290 KB' } },
        { data: { Part: 'project-3', "Price B": 'txt', "Price A": '466 KB' } },
        { data: { Part: 'project-4.docx', "Price B": 'docx', "Price A": '900 KB' } },
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
    <nb-tree-grid-row-toggle [expanded]="expanded" >
    </nb-tree-grid-row-toggle>
    `,
})
  
export class FsIconComponent {
  @Input() expanded: boolean;
}
