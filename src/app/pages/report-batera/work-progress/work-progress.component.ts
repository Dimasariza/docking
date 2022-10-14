import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { SubMenuProjectComponent } from '../../project-batera/sub-menu-project/sub-menu-project.component';
import { ReportBateraService } from '../report-batera.service';
import { SubMenuReportComponent } from '../sub-menu-report/sub-menu-report.component';
import { JobSuplierComponent } from './job-suplier.component';
import { UpdateWorkprogressComponent } from './update-workprogress.component';

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
    icon: 'minus',
    desc: 'Send Notification'
  }
]

@Component({
  providers : [SubMenuProjectComponent],
  selector: 'ngx-work-progress',
  templateUrl: './work-progress.component.html',
})

export class WorkProgressComponent {
  constructor(private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>,
              private dialog : MatDialog,
              private subMenuProject : SubMenuProjectComponent,
              private activatedRoute : ActivatedRoute,
              private reportService : ReportBateraService
    ) {
  }
  defaultColumns = ['Status', 'Start', 'Stop', 'Last Change', 'Vol', 'Unit', 'Unit Price Actual', 'Total Price Actual' ];
  allColumns = ['Job' ,'rank' ,'%' , 'Responsible' , ...this.defaultColumns, 'Approved', "Comment", 'suplier', 'edit' ];
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
    const {items, jobNumber, jobName, start, end, departement, volume, unitPrice, kontrak , type, remarks, id , responsible, unit, rank, kategori, progress, 
      status, unit_price_actual, total_price_actual, last_update, yardApproval, ownerApproval, workProggressRemarks} = work  
      return {
      data: {
        "Job": jobName,
        "Dept": departement,
        "Start": start,
        "Stop": end,
        "Vol" : volume,
        "Unit" : unit,
        "Total Price Budget" : kontrak,
        "Category" : kategori,
        "Remarks" : remarks,
        "Responsible" : responsible,
        "id" : id,
        "progress" : progress,
        "kind" : items?.length ? 'dir' : 'doc',
        "Status" : status,
        "Unit Price Actual" : unit_price_actual,
        "Total Price Actual" : total_price_actual,
        "Last Change" : last_update,
        yardApproval,
        ownerApproval,
        rank,
        unitPrice,
        type,
        workProggressRemarks,
        jobNumber,
        unit_price_actual,
        total_price_actual
      },
      children: items?.length ? items.map(child => this.populateData(child)) : []
    }
  }

  onClick(desc){
    switch (desc) {
      case 'Refresh' :
        this.reloadPage.emit('complete')
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
    .subscribe(() =>
    this.reloadPage.emit('complete')
    )
  }

  addJobSuplier(data){
    const dialogRef = this.dialog.open(JobSuplierComponent, {
      autoFocus : true,
      data : data,
    })
  }

  jobMenuDial(row){
    const dialogRef = this.dialog.open(SubMenuReportComponent, {
      autoFocus : true,
      data : row,
    })
  }

  updateWorkProgress(row){
    const dialogRef = this.dialog.open(UpdateWorkprogressComponent, {
      disableClose : true, 
      autoFocus:true,
      data : {
        job : row,
        id : this.projectId,
        work : this.workProgressData
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
