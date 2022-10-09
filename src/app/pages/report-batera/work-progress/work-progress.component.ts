import { state } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { SubMenuProjectComponent } from '../../project-batera/sub-menu-project/sub-menu-project.component';
import { WorkAreaComponent } from '../../project-batera/work-area/work-area.component';
import { UpdateWorkprogressComponent } from './update-workprogress.component';


interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface FSEntry {}

@Component({
  providers : [SubMenuProjectComponent],
  selector: 'ngx-work-progress',
  templateUrl: './work-progress.component.html',
})

export class WorkProgressComponent {
  constructor(
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>,
    private dialog : MatDialog,
    private router : Router,
    private subMenuProject : SubMenuProjectComponent
    ) {
  }

  useButtons = useButtons

  @Input() worksData : any = ""

  ngOnChanges(){
    this.worksData ?
    this.dataSource = this.dataSourceBuilder.create(this.worksData.work_area.map(work => 
    this.populateData(work)) as TreeNode<FSEntry>[]) : null
  }

  populateData = (work) => {          
    const {items, sfi, pekerjaan, start, end, departemen, volume, harga_satuan, kontrak , type, updated_at, id , responsible, satuan, rank, kategori} = work  
      return {
      data: {
        "Job No": sfi,
        "Job": pekerjaan,
        "Dept": departemen,
        "Type" : type,
        "Start": start,
        "Stop": end,
        "Vol" : volume,
        "Unit" : satuan,
        "Unit Price": harga_satuan,
        "Total Price Budget" : kontrak,
        "Category" : kategori,
        "Remarks" : updated_at,
        "Responsible" : responsible,
        "rank": rank,
        "id" : id,
        "kind" : items?.length ? 'dir' : 'doc'
      },
      children: items?.length ? items.map(child => this.populateData(child)) : []
    }
  }

  defaultColumns = [ 'Type', 'Status', 'Start', 'Stop', 'Responsible', 'Last Change', 'Vol', 'Unit', 'Unit Price Actual', 'Total Price Actual' ];
  allColumns = ['Job' ,'rank' ,'%' , ...this.defaultColumns, 'Approved', "Comment", 'edit' ];
  dataSource: NbTreeGridDataSource<FSEntry>;
  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  updateSort(sortRequest: NbSortRequest): void {
    return  this.subMenuProject.updateSort(sortRequest)
  }

  getSortDirection(column: string): NbSortDirection {
    return this.subMenuProject.getSortDirection(column)
  }

  getShowOn(index: number) {
    return this.subMenuProject.getShowOn(index)
  }

  onClick(desc){
    switch (desc) {
      case 'Add Job' :
        this.addJobDial()
        break;
      case 'Add Phase' :
        this.navToSubReport(1)
        break;
    }
  }

  navToSubReport(index){
    const id = this.worksData.id_proyek
    this.router.navigateByUrl( '/pages/report-batera/' + id + '/sub-menu-report', {state : {data : index, work_area : this.worksData}})
  }

  addJobDial(){
    const dialogConfig = new MatDialogConfig();
    const dialogRef = this.dialog.open(WorkAreaComponent, {
      disableClose : true, autoFocus:true, 
    })
  }

  updateWorkProgress(){
    const dialogConfig = new MatDialogConfig();
    const dialogRef = this.dialog.open(UpdateWorkprogressComponent, {
      disableClose : true, autoFocus:true, 
    })
  }
}

const useButtons = [
  {
  icon: 'refresh',
  desc: 'Refresh'
  },
  {
    icon: 'plus',
    desc: 'Add Phase'
  },
  {
    icon: 'list',
    desc: 'Add Activity'
  },
  {
    icon: 'flag-outline',
    desc: 'Add Job'
  },
  {
    icon: 'external-link',
    desc: 'Export to Excel'
  },
  {
    icon: 'plus-square-outline',
    desc: 'Expand'
  },
  {
    icon: 'minus',
    desc: 'Send Notification'
  }
]


















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
