import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NbMenuItem, NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { AddNewProjectComponent } from './add-new-project/add-new-project.component';
import { PostService } from './project-batera.service';

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
})
export class ProjectBateraComponent {
  posts:any;

  customColumn = 'Tasks';
  defaultColumns = [ 'Project/Asset', 'Customer', 'Status', 'Responsible', 'Due' ];
  allColumns = [ this.customColumn, ...this.defaultColumns ];

  dataSource: NbTreeGridDataSource<FSEntry>;

  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  constructor(
    public dialog : MatDialog,
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>,
    private route : Router,
    private service:PostService,
    ) {
    this.dataSource = this.dataSourceBuilder.create(this.data);
  }

  openDialog(){
    const dialogConfig = new MatDialogConfig();
    this.dialog.open(AddNewProjectComponent, {disableClose : true})
    dialogConfig.autoFocus = true;
  }

  ngOnInit() {
    this.service.getPosts()
      .subscribe(response => {
        this.posts = response;
        console.log(response)
      });
  }

  postDataProject(){
    this.service.addDataProject()
    .subscribe(res => {
      console.log(res)
      console.log("send data project")
    })
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
        data: { Tasks: 'Riggers/line handlers assistance when Vessel arrival Shipyard area', 'Project/Asset':'KM Abusamah', Status: 'In-Progress', kind: 'doc', Customer: 'PILSM', Responsible:'SHY', Due: '28.08.2022'},
      },
      {data: { Tasks: 'Riggers/line handlers assistance provide for enter to Dry-dock area', 'Project/Asset':'KM Abusamah', Status: 'In-Progress', kind: 'doc', Customer: 'PILSM', Responsible:'SHY', Due: '28.08.2022'},
      },
      {data: { Tasks: 'Riggers/line handlers assistance provide for undocking from Dry-dock area', 'Project/Asset':'KM Abusamah', Status: 'In-Progress', kind: 'doc', Customer: 'PILSM', Responsible:'SHY', Due: '28.08.2022'},
      },
      {data: { Tasks: 'Riggers/line handlers assistance when Vessel departure Shipyard area', 'Project/Asset':'KM Abusamah', Status: 'In-Progress', kind: 'doc', Customer: 'PILSM', Responsible:'SHY', Due: '28.08.2022'},
      },
      ],
    },
    {
    data: { Tasks: 'Shore Power Supply', 'Project/Asset': 'KM PUSRI INDONESIA I', Status: 'In-Progress', kind: 'dir', Customer: 'PILSM', Responsible: 'SHY', Due: '17.08.2022'},
      children: [
      {
      data: { Tasks: 'Connection and disconnection', 'Project/Asset': 'KM PUSRI INDONESIA I', Status: 'In-Progress', kind: 'doc', Customer: 'PILSM', Responsible: 'SHY', Due: '17.08.2022'},
      },
      {
        data: { Tasks: 'Per day', 'Project/Asset': 'KM PUSRI INDONESIA I', Status: 'In-Progress', kind: 'doc', Customer: 'PILSM', Responsible: 'SHY', Due: '17.08.2022'},
      },
      {
        data: { Tasks: 'Per kWh unit', 'Project/Asset': 'KM PUSRI INDONESIA I', Status: 'In-Progress', kind: 'doc', Customer: 'PILSM', Responsible: 'SHY', Due: '17.08.2022'},
      },
      ],
    },
    {
      data: { Tasks: 'Coolling Water Supply', 'Project/Asset': 'KM IBRAHIM ZAHIER', Status: 'In-Progress', kind: 'dir', Customer: 'PILSM', Responsible: 'SHY', Due: '17.08.2022'},
        children: [
        {
          data: { Tasks: 'Connection & Disconnection', 'Project/Asset': 'KM IBRAHIM ZAHIER', Status: 'In-Progress', kind: 'doc', Customer: 'PILSM', Responsible: 'SHY', Due: '17.08.2022'},
        },
        {
          data: { Tasks: 'Per day connected and under pressure', 'Project/Asset': 'KM IBRAHIM ZAHIER', Status: 'In-Progress', kind: 'doc', Customer: 'PILSM', Responsible: 'SHY', Due: '17.08.2022'},
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
      "vessel": "MT Salmon Mustava-DD-2019",
      "shortcuts": ['plus-square-outline', 'trash-2-outline', 'book-outline', 'checkmark-square', 'archive-outline'],
      "customer": "PT PI Logistik",
      "start": "15:09:19",
      "R": true,
      "P": true,
      "E": true
    },
    {
      "vessel": "KM-Fusri-Indonesia-I-DD-2019",
      "shortcuts": ['plus-square-outline', 'trash-2-outline', 'book-outline', 'checkmark-square', 'archive-outline'],
      "customer": "PT PI Logistik",
      "start": "15:08:19",
      "R": true,
      "P": true,
      "E": true
    },
    {
      "vessel": "KM-Ibrahim Zahir-DD-2019",
      "shortcuts": ['plus-square-outline', 'trash-2-outline', 'book-outline', 'checkmark-square', 'archive-outline'],
      "customer": "PT PI Logistik",
      "start": "15:07:19",
      "R": true,
      "P": true,
      "E": true
    },
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

  @ViewChild('teams') teams!: ElementRef;
	selectedTeam = '';
  selecTeam = ""
	onSelected():void {
		this.selectedTeam = this.teams.nativeElement.value;
	}
  
  navToSubProject(row){
    this.route.navigate(['/pages/project-batera/sub-menu-project'], {queryParams:{data : this.shipData[row].vessel}})
  }

  testDropDown = [ 'repair', 'on dokc', 'done']
  chooseOption(id){
    console.log("index number :", id)
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