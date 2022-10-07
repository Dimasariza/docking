import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { WorkAreaComponent } from '../../project-batera/work-area/work-area.component';
import { ApprovalDetailComponent } from '../work-progress/work-progress.component';

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface FSEntry {
  Title: string;
  Type?: string;
  Status?:string;
  "%"?:string;
  Start: string;
  Stop?: string;
  Responsible?: string;
  'Last Change'?: string;
  Approval?: boolean;
  Comment?: string,
  kind: string;
}

@Component({
  selector: 'ngx-work-add',
  templateUrl: './work-add.component.html',
  styles: [
  ]
})
export class WorkAddComponent implements OnInit {
  title = "unit price add on"

  ngOnInit(): void {
  }
  evaIcons = [];
  constructor(
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>,
    private dialog : MatDialog,
    public activatedRoute: ActivatedRoute
    ) {
  }
  
  @Input() worksData : any = ""
  
  openDialog(){
    this.dialog.open(ApprovalDetailComponent)
  }

  ngOnChanges(){
    console.log(this.worksData)
    this.worksData?
    this.dataSource = this.dataSourceBuilder.create(this.worksData.work_area.map(work => 
    this.populateData(work)) as TreeNode<FSEntry>[]): ""
  }

  populateData = (work) => {          
    const {items, sfi, pekerjaan, start, end, departemen, volume, harga_satuan, kontrak , type, updated_at, id , responsible, satuan} = work  
    console.log(work)
    console.log(responsible)         
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
        "Category" : type,
        "Remarks" : updated_at,
        "Responsible" : responsible,
        "index" : id,
        "kind" : items?.length ? 'dir' : 'doc'
      },
      children: items?.length ? items.map(child => this.populateData(child)) : []
    }
  }

  defaultColumns = ['Job', 'Type', 'Status', '%', 'Start', 'Stop', 'Responsible', 'Last Change', 'Vol', 'Unit', 'Unit Price Add On', 'Total Price Add On' ];
  allColumns = [...this.defaultColumns, 'Approved', "Comment" ];
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

  onClick(desc){
    switch (desc) {
      case 'Add Job' :
        this.addJobDial()
        break;
    }
  }

  addJobDial(){
    const dialogConfig = new MatDialogConfig();
    const dialogRef = this.dialog.open(WorkAreaComponent, {
      disableClose : true, autoFocus:true, 
    })
  }

  useIcons = [
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

}
