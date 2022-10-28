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
    icon: 'arrow-ios-downward-outline',
    desc: 'Expand'
  },
  {
    icon: 'paper-plane-outline',
    desc: 'Send Notification'
  }, 
  {
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
              private activatedRoute : ActivatedRoute,
              private subMenuProject : SubMenuProjectComponent,
              private projectService : ProjectBateraService,
              private reportService : ReportBateraService,
              public FNCOL : FunctionCollection,
              public pdfExporter : PdfGeneratorBateraComponent,
              public currency : CurrencyPipe,
              public excelService : ExportToExcel
    ) {
  }

  defaultColumns = ['Responsible', 'Status', 'Start', 'Stop', 'Last Update', 'volume', 'Unit', 'Unit Price Actual', 'Total Price Actual' ];
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
      case 'Export to Excel':
        this.excelService.reconstructJobsToExcel(this.workProgressData.work_area)
        this.excelService.exportAsExcelFile(this.excelService.excelData, this.workProgressData?.head)
        break
      case 'Send Notification' :
        break
      case 'Expand' :
        useButtons[2].desc = 'Unexpand'
        useButtons[2].icon = 'arrow-ios-forward-outline'
        this.regroupTableData(true)
        break;
      case 'Unexpand' :
        useButtons[2].desc = 'Expand'
        useButtons[2].icon = 'arrow-ios-downward-outline'
        this.regroupTableData(false)
        break;
    }
  }

  regroupTableData(expand){
    this.dataSource = this.dataSourceBuilder.create(this.workProgressData.work_area.map(work => {
      const currency = this.workProgressData.mata_uang
      const {'Price Actual' : unitPrice, volume} = work  
      const workItem = {
        'Unit Price Actual' : this.currency.transform(unitPrice, this.FNCOL.convertCurrency(currency)),
        'Total Price Actual' : this.currency.transform(unitPrice * volume, this.FNCOL.convertCurrency(currency))
      }
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
      const postData = { ...work, ...approve}
      const parentIndex = work.id.toString().split('')
      this.workProgressData.work_area = this.FNCOL.updateWorkAreaData(this.workProgressData.work_area, parentIndex, postData)
      work?.items ? this.approvedData(work.items, approve) : 
      this.updateWorkApproval(this.workProgressData.work_area)
    })
  }

  @Output() reloadPage = new EventEmitter<string>();
  updateWorkApproval(work_area){
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
    this.destroyDialog(dialogRef)
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

