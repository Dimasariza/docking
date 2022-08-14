import { Component, Input } from '@angular/core';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface FSEntry {
  Tasks: string;
  'Project/Asset'?: string;
  Status?:string;
  Customer?: string;
  kind: string;
  Responsible?: string;
  Due?: string
}

@Component({
  selector: 'ngx-project-batera',
  templateUrl: './project-batera.component.html',
  styleUrls: ['./project-batera.component.scss']
})
export class ProjectBateraComponent {
  customColumn = 'Tasks';
  defaultColumns = [ 'Project/Asset', 'Customer', 'Status', 'Responsible', 'Due' ];
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
      data: { Tasks: 'Docking Preparation',  'Project/Asset': 'MT Salmon Mustafa', Status: 'Preparation', Customer: 'PILSM', Responsible: 'FDM', Due: '06.08.2022', kind: 'dir', },
      children:[
        { data: {
          Tasks: 'Preparation of Docking Block', 'Project/Asset': 'MT Salmon Mustafa', Status: 'Preparation', Customer: 'PILSM', Responsible: 'FDM', Due: '06.08.2022', kind: 'doc'}},
        { data: {
          Tasks: 'Docking/Undocking plus First & Last Day', 'Project/Asset': 'MT Salmon Mustafa', Status: 'Preparation', Customer: 'PILSM', Responsible: 'FDM', Due: '06.08.2022', kind: 'doc'}},
        { data: {
          Tasks: 'Keel Block Removal', 'Project/Asset': 'MT Salmon Mustafa', Status: 'Preparation', Customer: 'PILSM', Responsible: 'FDM', Due: '06.08.2022', kind: 'doc'}},
        { data: {
          Tasks: 'Side Block Removal', 'Project/Asset': 'MT Salmon Mustafa', Status: 'Preparation', Customer: 'PILSM', Responsible: 'FDM', Due: '06.08.2022', kind: 'doc'}},
      ]
    },
    {
      data: { Tasks: 'Mooring and Unmooring', 'Project/Asset':'KM Abusamah', Status: 'In-Progress', kind: 'dir', Customer: 'PILSM', Responsible:'SHY', Due: '28.08.2022'},
      children: [{
        data: { Tasks: 'Riggers/line handlers assistance when Vessel arrival Shipyard area', 'Project/Asset':'KM Abusamah', Status: 'In-Progress', kind: 'dir', Customer: 'PILSM', Responsible:'SHY', Due: '28.08.2022'},
      },
      {data: { Tasks: 'Riggers/line handlers assistance provide for enter to Dry-dock area', 'Project/Asset':'KM Abusamah', Status: 'In-Progress', kind: 'dir', Customer: 'PILSM', Responsible:'SHY', Due: '28.08.2022'},
      },
      {data: { Tasks: 'Riggers/line handlers assistance provide for undocking from Dry-dock area', 'Project/Asset':'KM Abusamah', Status: 'In-Progress', kind: 'dir', Customer: 'PILSM', Responsible:'SHY', Due: '28.08.2022'},
      },
      {data: { Tasks: 'Riggers/line handlers assistance when Vessel departure Shipyard area', 'Project/Asset':'KM Abusamah', Status: 'In-Progress', kind: 'dir', Customer: 'PILSM', Responsible:'SHY', Due: '28.08.2022'},
      },
      ],
    },
    {
    data: { Tasks: 'Shore Power Supply', 'Project/Asset': 'KM PUSRI INDONESIA I', Status: 'In-Progress', kind: 'dir', Customer: 'PILSM', Responsible: 'SHY', Due: '17.08.2022'},
      children: [
      {
      data: { Tasks: 'Connection and disconnection', 'Project/Asset': 'KM PUSRI INDONESIA I', Status: 'In-Progress', kind: 'dir', Customer: 'PILSM', Responsible: 'SHY', Due: '17.08.2022'},
      },
      {
        data: { Tasks: 'Per day', 'Project/Asset': 'KM PUSRI INDONESIA I', Status: 'In-Progress', kind: 'dir', Customer: 'PILSM', Responsible: 'SHY', Due: '17.08.2022'},
      },
      {
        data: { Tasks: 'Per kWh unit', 'Project/Asset': 'KM PUSRI INDONESIA I', Status: 'In-Progress', kind: 'dir', Customer: 'PILSM', Responsible: 'SHY', Due: '17.08.2022'},
      },
      ],
    },
    {
      data: { Tasks: 'Coolling Water Supply', 'Project/Asset': 'KM IBRAHIM ZAHIER', Status: 'In-Progress', kind: 'dir', Customer: 'PILSM', Responsible: 'SHY', Due: '17.08.2022'},
        children: [
        {
          data: { Tasks: 'Connection & Disconnection', 'Project/Asset': 'KM IBRAHIM ZAHIER', Status: 'In-Progress', kind: 'dir', Customer: 'PILSM', Responsible: 'SHY', Due: '17.08.2022'},
        },
        {
          data: { Tasks: 'Per day connected and under pressure', 'Project/Asset': 'KM IBRAHIM ZAHIER', Status: 'In-Progress', kind: 'dir', Customer: 'PILSM', Responsible: 'SHY', Due: '17.08.2022'},
        },
        ],
    },
    {
      data: { Tasks: 'Shore Cranage', 'Project/Asset': 'KM JULIANTO MOELIODIHARDJO', Status: 'Preparation', kind: 'dir', Customer: 'PILSM', Responsible: 'SHY', Due: '17.08.2022'},
        children: [
        {
          data: { Tasks: 'Cranage usage', 'Project/Asset': 'KM JULIANTO MOELIODIHARDJO', Status: 'Preparation', kind: 'doc', Customer: 'PILSM', Responsible: 'SHY', Due: '17.08.2022'},
        }
        ],
    }, 
  ];

  getShowOn(index: number) {
    const minWithForMultipleColumns = 400;
    const nextColumnStep = 100;
    return minWithForMultipleColumns + (nextColumnStep * index);
  }

  shipData = [
    {
      "vessel": "Batera Batam-DD-2019",
      "shortcuts": ['plus-square-outline', 'trash-2-outline', 'book-outline', 'checkmark-square', 'archive-outline'],
      "customer": "Batera Line",
      "start": "15:09:19",
      "phases": [true, true, true]
    },
    {
      "vessel": "Batera Project3-DD-2019",
      "shortcuts": ['plus-square-outline', 'trash-2-outline', 'book-outline', 'checkmark-square', 'archive-outline'],
      "customer": "Batera Line",
      "start": "15:08:19",
      "phases": [true, false, true]
    },
    {
      "vessel": "Batera Kapuas-DD-2019",
      "shortcuts": ['plus-square-outline', 'trash-2-outline', 'book-outline', 'checkmark-square', 'archive-outline'],
      "customer": "Batera Line",
      "start": "15:07:19",
      "phases": [true, false, true]
    },
    {
      "vessel": "Batera Medan-1-DD-2019",
      "shortcuts": ['plus-square-outline', 'trash-2-outline', 'book-outline', 'checkmark-square', 'archive-outline'],
      "customer": "Batera Line",
      "start": "15:06:19",
      "phases": [true, false, true]
    },
    {
      "vessel": "Batera Express-DD-2019",
      "shortcuts": ['plus-square-outline', 'trash-2-outline', 'book-outline', 'checkmark-square', 'archive-outline'],
      "customer": "Batera Line",
      "start": "15:05:19",
      "phases": [true, false, true]
    },
    {
      "vessel": "Relance-DD-2019",
      "shortcuts": ['plus-square-outline', 'trash-2-outline', 'book-outline', 'checkmark-square', 'archive-outline'],
      "customer": "Batera Line",
      "start": "15:04:19",
      "phases": [true, false, true]
    },
    {
      "vessel": "Batera Gorontalo-DD-2019",
      "shortcuts": ['plus-square-outline', 'trash-2-outline', 'book-outline', 'checkmark-square', 'archive-outline'],
      "customer": "Batera Line",
      "start": "15:03:19",
      "phases": [true, false, true]
    }
  ]

  projectsData = [
    {
      tasks: 'Docking Preparation',
      asset: 'MT Salmon Mustafa',
      customer : 'PILSM',
      status : 'Preparation',
      responsible : 'FDM',
      due : '06.08.2022'
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