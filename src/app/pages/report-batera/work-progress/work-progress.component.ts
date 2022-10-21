import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { FunctionCollection } from '../../function-collection-batera/function-collection.component';
import { PdfGeneratorBateraComponent } from '../../pdf-generator-batera/pdf-generator-batera.component';
import { ProjectBateraService } from '../../project-batera/project-batera.service';
import { SubMenuProjectComponent } from '../../project-batera/sub-menu-project/sub-menu-project.component';
import { WorkAreaComponent } from '../../project-batera/work-area/work-area.component';
import { JobSuplierComponent } from '../job-suplier/job-suplier.component';
import { SubMenuReportComponent } from '../sub-menu-report/sub-menu-report.component';

interface TreeNode<T> {}
interface FSEntry {}

const useButtons = [{
  icon: 'refresh',
  desc: 'Refresh'
  }, {
    icon: 'external-link',
    desc: 'Export to Excel'
  }, {
    icon: 'plus-square-outline',
    desc: 'Expand'
  },{
    icon: 'paper-plane-outline',
    desc: 'Send Notification'
  }, {
    icon: 'person-add-outline',
    desc: 'Add Suplier'
  }]

@Component({
  providers : [SubMenuProjectComponent],
  selector: 'ngx-work-progress',
  templateUrl: './work-progress.component.html',
})

export class WorkProgressComponent implements OnInit, OnDestroy {
  constructor(private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>,
              private dialog : MatDialog,
              private datepipe : DatePipe,
              private subMenuProject : SubMenuProjectComponent,
              private activatedRoute : ActivatedRoute,
              private projectService : ProjectBateraService,
              public FNCOL : FunctionCollection,
              public pdfExporter : PdfGeneratorBateraComponent
    ) {
  }

  defaultColumns = ['Responsible', 'Status', 'Start', 'Stop', 'Last Update', 'Vol', 'Unit', 'Unit Price Actual', 'Total Price Actual' ];
  allColumns = ['jobName' ,'rank' ,'%' , ...this.defaultColumns, 'Approved', 'edit' ];
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
  subscription : Subscription [] = []
  
  ngOnInit(){}

  ngOnChanges(){
    this.projectId = this.activatedRoute.snapshot.paramMap.get("id")
    const _subs1 = this.projectService.getSubProjectData(this.projectId)
    .pipe(take(1))
    .subscribe(({data} : any) => {
      this.workProgressData = data
    })
    
    this.workProgressData?.work_area === null ||
    this.workProgressData?.work_area === undefined ||
    this.workProgressData?.work_area[0] === null ? null : 
    this.dataSource = this.dataSourceBuilder.create(this.workProgressData.work_area.map(work => {
      const {volume, responsible, status, last_update, rank} = work  
      const workItem = {
        "Last Update": this.datepipe.transform(last_update, 'yyyy-MM-dd'),
        "Responsible" : responsible?.name,
        "Status" : status?.name,
        "Unit Price Actual" : work['Price Actual'],
        "Total Price Actual" : volume * work['Price Actual'],
        "Last Change" : this.datepipe.transform(last_update, 'yyyy-MM-dd'),
        "Rank" : rank?.name,
      }
      return this.FNCOL.populateData(work, workItem)
    }) as TreeNode<FSEntry>[])

    this.subscription.push(_subs1)
  }

  parentIndex(row){
    const parentIndex = row.data.id.toString().split('')
    if(parentIndex.length == 1) return true
  }

  generatePDF(row){
    console.log(row.data, this.workProgressData)
    this.pdfExporter.generatePDFBasedOnJob(row.data, this.workProgressData)
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

  approvedByYard(newData) {
    this.shipYard = true
    let postData = { ...newData.data, yardApproval : this.shipYard}
    this.updateWorkApproval(postData)
  }
  
  approvedByOwner(newData){
    this.shipOwner = true
    let postData = { ...newData.data, ownerApproval : this.shipOwner}
    this.updateWorkApproval(postData)
  }

  @Output() reloadPage = new EventEmitter<string>();
  updateWorkApproval(postData){
    const parentIndex = postData.id.toString().split('')
    const work_area = this.FNCOL.updateWorkAreaData(this.workProgressData.work_area, parentIndex, postData)
    this.projectService.workArea({work_area}, this.projectId)
    .pipe(take(1))
    .subscribe(() =>{
      this.reloadPage.emit('complete')
    })
  }

  addJobSuplier(){
    const dialogRef = this.dialog.open(JobSuplierComponent, {
      autoFocus : true,
      disableClose : true,
      // data : data,
    })
    const _subs = dialogRef.componentInstance.onSuccess.asObservable()
    .pipe(take(1))
    .subscribe(() => {
      this.reloadPage.emit('complete')
    });

    this.subscription.push(_subs)
  }

  jobMenuDial(row){
    const dialogRef = this.dialog.open(SubMenuReportComponent, {
      autoFocus : true,
      data : row,
    })
  }

  updateWorkProgress(row){
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
    const _subs = dialogRef.componentInstance.onSuccess.asObservable()
    .pipe(take(1))
    .subscribe(() => {
      this.reloadPage.emit('complete')
    });

    this.subscription.push(_subs)
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subs => subs.unsubscribe())
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
