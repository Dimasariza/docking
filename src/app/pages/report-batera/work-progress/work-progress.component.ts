import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { SubMenuProjectComponent } from '../../project-batera/sub-menu-project/sub-menu-project.component';
import { WorkAreaComponent } from '../../project-batera/work-area/work-area.component';
import { JobSuplierComponent } from '../job-suplier/job-suplier.component';
import { ReportBateraService } from '../report-batera.service';
import { SubMenuReportComponent } from '../sub-menu-report/sub-menu-report.component';

interface TreeNode<T> {}
interface FSEntry {}

const useButtons = [
  {
  icon: 'refresh',
  desc: 'Refresh'
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
    icon: 'paper-plane-outline',
    desc: 'Send Notification'
  },
  {
    icon: 'person-add-outline',
    desc: 'Add Suplier'
  },
]

@Component({
  providers : [SubMenuProjectComponent],
  selector: 'ngx-work-progress',
  templateUrl: './work-progress.component.html',
})

export class WorkProgressComponent {
  constructor(private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>,
              private dialog : MatDialog,
              private datepipe : DatePipe,
              private subMenuProject : SubMenuProjectComponent,
              private activatedRoute : ActivatedRoute,
              private reportService : ReportBateraService
    ) {
  }
  defaultColumns = [ 'Status', 'Start', 'Stop', 'Last Change', 'Vol', 'Unit', 'Unit Price Actual', 'Total Price Actual' ];
  allColumns = ['Job' ,'rank' ,'%' , 'Responsible' , ...this.defaultColumns, 'Approved', "Comment", 'edit' ];
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

  @Input() workProgressData : any = ""
  useButtons = useButtons
  projectId : any
  shipYard : boolean = false
  shipOwner : boolean = false
  

  ngOnChanges(){
    this.projectId = this.activatedRoute.snapshot.paramMap.get('id')
    this.workProgressData ?
    this.dataSource = this.dataSourceBuilder.create(this.workProgressData.work_area.map(work => 
    this.populateData(work)) as TreeNode<FSEntry>[]) : null
  }

  populateData = (work) => {          
    const {items, jobName, start, end, volume, responsible, unit, status, unitPrice, last_update, rank} = work  
      return {
      data: {
        "Job": jobName,
        "Start": start,
        "Stop": end,
        "Vol" : volume,
        "Unit" : unit.name,
        "Responsible" : responsible,
        "Status" : status?.name,
        "Unit Price Actual" : unitPrice,
        "Total Price Actual" : volume * unitPrice,
        "Last Change" : this.datepipe.transform(last_update, 'yyyy-MM-dd'),
        "Rank" : rank?.name,
        "kind" : items?.length ? 'dir' : 'doc',
        ...work
      },
      children: items?.length ? items.map(child => this.populateData(child)) : []
    }
  }

  onClick(desc){
    switch (desc) {
      case 'Refresh' :
        this.reloadPage.emit('complete')
        break;
      case 'Add Suplier' :
        this.addJobSuplier()
        break;
    }
  }

  updateWorkAreaData = (data, parentIndex, newData) => {
    return data.map((w, i) => {
      if (parentIndex.length > 1 && i == parentIndex[0]) {
        parentIndex = parentIndex.slice(1)
        return {...w, items: this.updateWorkAreaData(w.items, parentIndex, newData)}
      } else if(i == parentIndex[0]) {
        let item
        w?.items ? item = w.items : item = null
        return {...w, ...newData, items : item}
      }
      return w
    })
  }

  approvedByYard(newData){
    this.shipYard = true
    let postData = { ...newData.data, yardApproval : this.shipYard}
    const parentIndex = postData.id.toString().split('')
    const approveData = this.updateWorkAreaData(this.workProgressData.work_area, parentIndex, postData)
    this.updateWorkApproval(approveData)
  }
  
  approvedByOwner(newData){
    this.shipOwner = true
    let postData = { ...newData.data, ownerApproval : this.shipOwner}
    const parentIndex = postData.id.toString().split('')
    const approveData = this.updateWorkAreaData(this.workProgressData.work_area, parentIndex, postData)
    this.updateWorkApproval(approveData)
  }

  @Output() reloadPage = new EventEmitter<string>();
  updateWorkApproval(work_area){
    this.reportService.updateWorkProgress({work_area}, this.projectId)
    .subscribe((res) =>{
      this.reloadPage.emit('complete')
    })
  }

  addJobSuplier(){
    const dialogRef = this.dialog.open(JobSuplierComponent, {
      autoFocus : true,
      disableClose : true,
      // data : data,
    })
    dialogRef.componentInstance.onSuccess.asObservable().subscribe(() => {
      this.reloadPage.emit('complete')
    });
  }

  jobMenuDial(row){
    const dialogRef = this.dialog.open(SubMenuReportComponent, {
      autoFocus : true,
      data : row,
    })
  }

  updateWorkProgress(row){
    console.log(row)
    const dialogRef = this.dialog.open(WorkAreaComponent, {
      disableClose : true, 
      autoFocus:true,
      data : {
        dial : "Work Progress",
        data : row,
        parentId : row.data.id,
        id : this.projectId,
      }
    })
    dialogRef.componentInstance.onSuccess.asObservable().subscribe(() => {
      this.reloadPage.emit('complete')
    });
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
