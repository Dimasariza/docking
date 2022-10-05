import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { AddYardComponent } from './add-yard/add-yard.component';
import { TenderBateraService } from './tender-batera.service'


interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface FSEntry {
}


@Component({
  selector: 'ngx-tender-batera',
  templateUrl: './tender-batera.component.html',
})

export class TenderBateraComponent implements OnInit {
  triggerSelectFile(fileInput: HTMLInputElement) {
    fileInput.click()
  }

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

  constructor(
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>,
    private tenderBateraService : TenderBateraService,
    public dialog : MatDialog
    ) {
  }

  ngOnInit(): void {
    this.tenderBateraService.getDataTender()
      .subscribe(({data} : any) => {
    })

    this.tenderBateraService.getProjectWorkArea()
    .subscribe(({data} : any) => {
      console.log(data)
      const {work_area} = data
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

  addYard(){
    const dialogConfig = new MatDialogConfig();
    this.dialog.open(AddYardComponent, 
      {disableClose : true},
      )
    dialogConfig.autoFocus = true;
  }
  public selectedYard = ""
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


