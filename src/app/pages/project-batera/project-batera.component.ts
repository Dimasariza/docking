import { Component, EventEmitter, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { AddNewProjectComponent } from './add-new-project/add-new-project.component';
import { ProjectBateraService } from './project-batera.service';

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
  public allProjectDatas : any

  customColumn = 'Tasks';
  defaultColumns = [ 'Project/Asset', 'Customer', 'Status', 'Responsible', 'Due', 'Delete' ];
  allColumns = [ this.customColumn, ...this.defaultColumns ];

  dataSource: NbTreeGridDataSource<FSEntry>;

  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  constructor(
    public dialog : MatDialog,
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>,
    private service:ProjectBateraService,
    ) {
    this.dataSource = this.dataSourceBuilder.create(this.data);
  }

  openDialog(){
    const dialog = this.dialog.open(AddNewProjectComponent, { 
      disableClose : true,
      autoFocus : true,
      data : this.allProjectDatas[0].id_user
    })
  }

  ngOnInit() {
    this.service.getProjects()
      .subscribe(({data} : any) => {
        this.allProjectDatas = data
        console.log(this.allProjectDatas)
    });

    
    // this.service.getSubProjectData(id)
    // .subscribe(({data} : any) => {
    //   const {work_area, kapal} = data
    //   const populateData = (work, kind) => {          
    //     const {items, sfi, pekerjaan, start, end, departemen, volume, harga_satuan, kontrak , type, remarks, updated_at, id } = work           
    //     return {
    //       data: {
    //         "Job No": sfi,
    //         "Job": pekerjaan,
    //         "Dept": departemen,
    //         "Start": start,
    //         "Stop": end,
    //         "Vol" : volume,
    //         "Unit" : '',
    //         "Unit Price": harga_satuan,
    //         "Total Price Budget" : kontrak,
    //         "Category" : type,
    //         "Remarks" : updated_at,
    //         "id" : id,
    //         kind
    //       },
    //       children: items?.length ? items.map(child => populateData(child, 'doc')) : []
    //     } 
    //   }
    //   this.dataSource = this.dataSourceBuilder.create(work_area.map(work => 
    //     populateData(work, 'dir')) as TreeNode<FSEntry>[]
    //     )
    //   })
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

  deleteProject(row){
    let id_proyek = this.allProjectDatas[row].id_proyek
    this.service.deleteProject(id_proyek)
    .subscribe(
      res => console.log(res)
    )
  }

  private data: TreeNode<FSEntry>[] =
  [
    {
      data: { Tasks: 'Docking Preparation',  'Project/Asset': 'MT Salmon Mustafa', Status: 'Preparation', Customer: 'PILSM', Responsible: 'FDM', Due: '06.08.2022', kind: 'dir', },
      children:[
        { data: {
          Tasks: 'Preparation of Docking Block', 'Project/Asset': 'MT Salmon Mustafa', Status: 'Preparation', Customer: 'PILSM', Responsible: 'FDM', Due: '06.08.2022', kind: 'doc'},
          children : [
            { data: {
              Tasks: 'Docking/Undocking plus First & Last Day', 'Project/Asset': 'MT Salmon Mustafa', Status: 'Preparation', Customer: 'PILSM', Responsible: 'FDM', Due: '06.08.2022', kind: 'doc'}}
          ]
        },
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
  ]

  getShowOn(index: number) {
    const minWithForMultipleColumns = 400;
    const nextColumnStep = 100;
    return minWithForMultipleColumns + (nextColumnStep * index);
  }


  // allProjectDatas = [
  //   {
  //     "vessel": "MT Salmon Mustava-DD-2019",w
  //     "shortcuts": ['plus-square-outline', 'trash-2-outline', 'book-outline', 'checkmark-square', 'archive-outline'],
  //     "customer": "PT PI Logistik",
  //     "start": "15:09:19",
  //     "R": true,
  //     "P": true,
  //     "E": true
  //   },
  //   {
  //     "vessel": "KM-Fusri-Indonesia-I-DD-2019",
  //     "shortcuts": ['plus-square-outline', 'trash-2-outline', 'book-outline', 'checkmark-square', 'archive-outline'],
  //     "customer": "PT PI Logistik",
  //     "start": "15:08:19",
  //     "R": true,
  //     "P": true,
  //     "E": true
  //   },
  //   {
  //     "vessel": "KM-Ibrahim Zahir-DD-2019",
  //     "shortcuts": ['plus-square-outline', 'trash-2-outline', 'book-outline', 'checkmark-square', 'archive-outline'],
  //     "customer": "PT PI Logistik",
  //     "start": "15:07:19",
  //     "R": true,
  //     "P": true,
  //     "E": true
  //   },
  // ]

  testDropDown = [ 'repair', 'on dokc', 'done']
  chooseOption(id){
    console.log("index number :", id)
  }
}



