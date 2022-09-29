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
  "Price A"?: string;
  "Price B"?: string;
  "Price C"?: string;
  "Job No": string;
  Job? : string;
  Dept?: string;
  Resp? : string;
  Start? : string;
  Stop? : string;
  "Unit Price Contract"?: string;
  "Total Price Contract"? : string;
  "Category"?: string;
  Remarks?: string;
  Edit?: boolean
  kind: string;
}


@Component({
  selector: 'ngx-tender-batera',
  templateUrl: './tender-batera.component.html',
})

export class TenderBateraComponent implements OnInit {
  menuButton = [
    {
      position: 'top',
      icon: 'list-outline',
      text : 'List'
    },
    {
      position: 'top',
      icon: 'calendar-outline',
      text: 'Schedule'
    },
    {
      position: 'top',
      icon: 'file-add-outline',
      text: 'Extract Data File'
    },
    {
      position: 'top',
      icon: 'clipboard-outline',
      text: 'Gant'
    },
    {
      position: 'bottom',
      text : 'Add Job'
    },
    {
      position: 'bottom',
      text : 'Export To PDF'
    },
    {
      position: 'bottom',
      text : 'Expand All'
    },
    {
      position: 'bottom',
      text : 'Refresh'
    },
    {
      position: 'bottom',
      text : 'Show Budget'
    },
    {
      position: 'bottom',
      text: 'Show Contract'
    }
  ]

  customColumn = "Job No";
  defaultColumns = [ 'Job', 'Dept', 'Resp', 'Start', 'Stop', 'Vol', 'Unit', 'Unit Price Contract','Total Price Contract', 'Category', 'Remarks' ];
  editColumn = 'Edit'
  allColumns = [ this.customColumn, ...this.defaultColumns, this.editColumn];

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

  dataTenders : any
  constructor(
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>,
    private tenderBateraService : TenderBateraService,
    public dialog : MatDialog
    ) {
  }

  public scrollVisibility: any = { horizontal: false, vertical: false }

  public tenderLoadDetails : TreeNode<FSEntry> []
  ngOnInit(): void {
    this.tenderBateraService.getDataTender()
      .subscribe(({data} : any) => {
        const {work_area} = data
        console.log(data)
        const populateData = (work, kind) => {          
          const {items, sfi, pekerjaan, start, end, departemen, volume, harga_satuan, kontrak , type, remarks} = work           
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
              "Remarks" : remarks,
              kind
            },
            children: items?.length ? items.map(child => populateData(child, 'doc')) : []
          }
        }
        this.dataSource = this.dataSourceBuilder.create(work_area.map(work => populateData(work, 'dir')) as TreeNode<FSEntry>[])
      })
  }

  getDataTender(){
    this.tenderBateraService.getDataTender().subscribe(res => {
      this.dataTenders = res
      console.log(res)
    }) 
  }


  openDialog(){
    this.dialog.open(YardDetailComponent),
    console.log("open dialog")
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


