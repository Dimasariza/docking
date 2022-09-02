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
  Projects: string;
  "Price A"?: string;
  "Price B"?: string;
  "Price C"?: string;
  kind: string;
}

@Component({
  selector: 'ngx-sub-menu-project',
  templateUrl: './sub-menu-project.component.html',
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
  defaultColumns = [ 'kind' ];
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
      data: { Projects: 'General Service', kind: 'dir' },
    },
    {
      data: { Projects: 'Projects', "Price A": '1.8 MB', "Price C": 'five', "Price B": 'dirt', kind: "dir" },
      children: [
        { data: { Projects: 'project-1.doc', "Price B": 'doc', "Price A": '240 KB', kind: 'doc' } },
        { data: { Projects: 'project-2.doc', "Price B": 'doc', "Price A": '290 KB', kind: 'doc' } },
        { data: { Projects: 'project-3', "Price B": 'txt', "Price A": '466 KB', kind: 'doc' } },
        { data: { Projects: 'project-4.docx', "Price B": 'docx', "Price A": '900 KB', kind: 'doc' } },
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

  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      
    })
  }
}


@Component ({
  selector: 'ngx-sub-project-data',
  templateUrl: './sub-project-data.component.html',
})
export class SubProjectDataComponent {
  orderOriginal = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
    return 0
  }
  objectKeys = Object.keys;
  reportData = {
    "Start/End": {
      type : 'text',
      value : '10.10.2022'
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
      value: ['Planning', 'Done']
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
      type : 'text',
      value : 'pertamana' 
    },
    "Estimate Cost": {
      type : 'edit',
      value : 'Rp 1.400.000.000',
    } 
  }
}

