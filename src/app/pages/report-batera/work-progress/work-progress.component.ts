import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { ExportToExcel } from '../../function-collection-batera/export-excel';
import { FunctionCollection } from '../../function-collection-batera/function-collection.component';
import { PdfGeneratorBateraComponent } from '../../pdf-generator-batera/pdf-generator-batera.component';
import { ProjectBateraService } from '../../project-batera/project-batera.service';
import { SubMenuProjectComponent } from '../../project-batera/sub-menu-project/sub-menu-project.component';
import { WorkAreaComponent } from '../../project-batera/work-area/work-area.component';
import { JobSuplierComponent } from '../job-suplier/job-suplier.component';
import { SubMenuReportComponent } from '../sub-menu-report/sub-menu-report.component';

interface TreeNode<T> {}
interface FSEntry {}

const useButtons = [
  {
    icon: 'person-add-outline',
    desc: 'Add Suplier'
  },
  {
    icon: 'person-done-outline',
    desc: 'Update Suplier'
  },
  {
  icon: 'refresh',
  desc: 'Refresh'
  }, 
  {
    icon: 'external-link',
    desc: 'Export to Excel'
  }, 
  {
    icon: 'arrow-ios-downward-outline',
    desc: 'Expand'
  },
  {
    icon: 'paper-plane-outline',
    desc: 'Send Notification'
  }, 
]

@Component({
  providers : [SubMenuProjectComponent],
  selector: 'ngx-work-progress',
  templateUrl: './work-progress.component.html',
})

export class WorkProgressComponent implements OnInit, OnDestroy {
  constructor(private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>,
              private dialog : MatDialog,
              private activatedRoute : ActivatedRoute,
              private subMenuProject : SubMenuProjectComponent,
              private projectService : ProjectBateraService,
              public FNCOL : FunctionCollection,
              public pdfExporter : PdfGeneratorBateraComponent,
              public currency : CurrencyPipe,
              public excelService : ExportToExcel
    ) {
  }

  defaultColumns = ['Responsible', 'Status', 'Start', 'Stop', 'Update', 'Volume', 'Unit', 'Unit Price Budget', 'Total Price Budget' ];
  allColumns = ['jobName' ,'rank' ,'%' , ...this.defaultColumns, 'Approved', 'suplier', 'edit' ];
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
  @Input() suplierData : any [] = ['Data Not Available']
  useButtons = useButtons
  projectId : any
  subscription : Subscription [] = []
  
  ngOnInit(){}

  ngOnChanges(){
    this.projectId = this.activatedRoute.snapshot.paramMap.get('id')
    const work_area = this.workProgressData?.work_area
    work_area === null ||
    work_area === undefined ||
    work_area[0] === null ? null : 
    this.regroupTableData(false)
  }

  parentIndex(row){
    const parentIndex = row.data.id.toString().split('')
    if(parentIndex.length == 1) return true
  }

  generatePDF(row){
    this.pdfExporter.generatePDFBasedOnJob(this.workProgressData, row.data)
  }

  onClick(desc){
    switch (desc) {
      case 'Refresh' :
        this.reloadPage.emit('complete')
        break;
      case 'Add Suplier' :
        this.addJobSuplier()
        break;
      case 'Update Suplier' :
        this.addJobSuplier()
        break;
      case 'Export to Excel':
        this.excelService.excelData = []
        this.excelService.reconstructJobsToExcel(this.workProgressData.work_area)
        this.excelService.exportAsExcelFile(this.excelService.excelData, this.workProgressData?.head)
        break
      case 'Send Notification' :
        break
      case 'Expand' :
        useButtons[4].desc = 'Unexpand'
        useButtons[4].icon = 'arrow-ios-forward-outline'
        this.regroupTableData(true)
        break;
      case 'Unexpand' :
        useButtons[4].desc = 'Expand'
        useButtons[4].icon = 'arrow-ios-downward-outline'
        this.regroupTableData(false)
        break;
    }
  }

  regroupTableData(expand){
    const {work_area, mata_uang } = this.workProgressData
    this.dataSource = this.dataSourceBuilder.create(work_area.map(work => {
      const workItem = [mata_uang, 'Unit Price Budget', 'Total Price Budget']
      return this.FNCOL.populateData(work, workItem, expand)
    }) as TreeNode<FSEntry>[])
  }

  approvedByYard(newData){
    const yardApproval = {yardApproval : true}
    this.approvedData(newData, yardApproval)
  }

  approvedByOwner(newData){
    const ownerApproval = {ownerApproval : true}
    this.approvedData(newData, ownerApproval)
  }

  approvedData(newData, approve) {
    newData.map(work => {
      this.workProgressData.work_area 
      = this.FNCOL.updateWorkAreaData(this.workProgressData.work_area, work.id, {...work, ...approve})
      work?.items.length
      ? this.approvedData(work.items, approve) 
      : this.updateWorkApproval(this.workProgressData.work_area)
    })
  }

  chooseSuplier(parentId ,value){
    const work_area = this.FNCOL.updateWorkAreaData(this.workProgressData.work_area, parentId, {suplierId : value.id_supplier})
    // suplier job ??
  }

  @Output() reloadPage = new EventEmitter<string>();
  updateWorkApproval(work_area){
    console.log(work_area)
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
    })
    this.destroyDialog(dialogRef)
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
        id : this.projectId,
        work : this.workProgressData
      }
    })
    this.destroyDialog(dialogRef)
  }

  destroyDialog(dialogRef) {
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

