import { Component, Input } from '@angular/core';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface FSEntry {
  Projects: string;
  "Price A"?: string;
  "Price B"?: string;
  "Price C"?: string;
}


@Component({
  selector: 'ngx-sub-menu-project',
  templateUrl: './sub-menu-project.component.html',
  styleUrls: ['./sub-menu-project.component.scss']
})


export class SubMenuProjectComponent  {
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

  customColumn = 'Projects';
  defaultColumns = [  ];
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
      data: { Projects: 'General Service', },
    },
    {
      data: { Projects: 'Projects', "Price A": '1.8 MB', "Price C": 'five', "Price B": 'dirt' },
      children: [
        { data: { Projects: 'project-1.doc', "Price B": 'doc', "Price A": '240 KB' } },
        { data: { Projects: 'project-2.doc', "Price B": 'doc', "Price A": '290 KB' } },
        { data: { Projects: 'project-3', "Price B": 'txt', "Price A": '466 KB' } },
        { data: { Projects: 'project-4.docx', "Price B": 'docx', "Price A": '900 KB' } },
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
