import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { TenderBateraService } from './tender-batera.service'

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
  kind?: string
}

@Component({
  selector: 'ngx-tender-batera',
  templateUrl: './tender-batera.component.html',
})

export class TenderBateraComponent implements OnInit {
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


  dataTenders : any
  constructor(
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>,
    private tenderBateraService : TenderBateraService,
    public dialog : MatDialog

    ) {
    this.dataSource = this.dataSourceBuilder.create(this.data);
  }

  ngOnInit(): void {
    this.tenderBateraService.getDataTender().subscribe(res => {
      console.log(res)
    })
  }

  getDataTender(){
    this.tenderBateraService.getDataTender().subscribe(res => {
      this.dataTenders = res
      console.log(res)
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

  openDialog(){
    this.dialog.open(YardDetailComponent),
    console.log("open dialog")
  }

  private data: TreeNode<FSEntry>[] = [
    {
      data: { Part: 'General Service', "Price B" : 'di', "Price A": '400 KB', "Price C": '2', kind : "dir" },
    },
    {
      data: { Part: 'Projects', "Price A": '1.8 MB', "Price C": 'five', "Price B": 'dirt' , kind: 'dir'},
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
  selector: 'ngx-yard-detail',
  template: `
    <nb-card>
      <nb-card-header>
        <h5>Yard Comment</h5>
      </nb-card-header>
      <nb-card-body>
        Lorem Ipusm Dolor Sitamet
      </nb-card-body>
    </nb-card>
  `,
})
export class YardDetailComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
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


