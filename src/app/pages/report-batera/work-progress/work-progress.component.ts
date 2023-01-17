import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NbDateService, NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { ExportToExcel } from '../../function-collection-batera/export-excel';
import { FunctionCollection } from '../../function-collection-batera/function-collection.component';
import { PdfGeneratorBateraComponent } from '../../pdf-generator-batera/pdf-generator-batera.component';
import { ProjectBateraService } from '../../project-batera/project-batera.service';
import { SubMenuProjectComponent } from '../../project-batera/sub-menu-project/sub-menu-project.component';
import { WorkAreaComponent } from '../../project-batera/work-area/work-area.component';
import { BarProgressComponent } from '../bar-progress/bar-progress.component';
import { JobSuplierComponent } from '../job-suplier/job-suplier.component';
import { ReportBateraService } from '../report-batera.service';
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
              public excelService : ExportToExcel,
              public reportService : ReportBateraService,
              public dateService : DatePipe,
    ) {
  }

  defaultColumns = ['Responsible', 'Status', 'Start', 'Stop', 'Update', 'Volume', 'Unit', 'Unit Price Actual', 'Total Price Actual' ];
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

  @Input() workProgressData : any = "";
  @Input() suplierData : any [] = ['Data Not Available'];
  @Input() projectData : any;
  @Input() companyProfile : any;
  @Input() picData : any;
  @Output() reloadPage = new EventEmitter<string>();
  @Output() alertStatus = new EventEmitter<string>();
  useButtons = useButtons;
  projectId : any;
  subscription : Subscription [] = [];
  editableRow : any = "notEdited";
  
  ngOnInit(){}

  isFalsy = (value) => !value

  ngOnChanges(){
    this.projectId = this.activatedRoute.snapshot.paramMap.get('id')
    const work_area = this.workProgressData?.work_area
    if(!this.isFalsy(work_area)) this.regroupTableData(false)
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
        this.updateJobSuplier()
        break;
      case 'Export to Excel':
        this.excelService.exportToExcel(this.workProgressData, 'work_area')
        break
      case 'Send Notification' :
        this.sendEmailNotification()

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
      const workItem = [mata_uang, 'Price Actual']
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
    const suplier = {
      id : value.id_supplier,
      name : value.nama_supplier
    }
    const work_area = this.FNCOL.updateWorkAreaData(this.workProgressData.work_area, parentId, {suplier})
    this.updateWorkApproval(work_area)
  }

  reconstructEmailData(work_area) {
    work_area = work_area.map(work => {
      let {
        jobNumber, 
        jobName, 
        progress,
        start, 
        end, 
        volume, 
        unit, 
        'Price Budget' : unit_price = 0, 
        id, 
        items
      } = work 
      if(progress === null || progress === undefined) progress = 0
      const index = id.toString().split('')
      let useUnit = index.length == 1 
      ? this.FNCOL.jobUnit 
      : this.FNCOL.subJobUnit
      const newData = {
        job_no : jobNumber,
        job_name : jobName,
        progress,
        start : this.dateService.transform(start, 'dd-MM-yyyy') ,
        end : this.dateService.transform(end, 'dd-MM-yyyy'),
        volume,
        unit : useUnit[unit],
        unit_price : this.currency.transform(unit_price,  this.FNCOL.convertCurrency(this.projectData.proyek.mata_uang)),
        total_price : this.currency.transform(unit_price * volume,  this.FNCOL.convertCurrency(this.projectData.proyek.mata_uang))
      }
      if(items?.length) return [newData, ...this.reconstructEmailData(items)]
      else return newData
    })
    return work_area
  }

  sendEmailNotification() {
    const {perusahaan, proyek} = this.projectData
    const {tahun, kapal} = proyek
    const work_progress = this.reconstructEmailData(this.workProgressData.work_area) 
    const workContainer = new Array
    const pushData = (work_area) => {
      work_area.forEach(work => {
        if(!work.length) workContainer.push(work)
        if(work.length) pushData(work)
      })
    }
    pushData(work_progress)
    
    const postBody = this.picData.map(resp => ({
      shipyard : {
        nama_user : resp.nama_lengkap,
        nama_perusahaan : perusahaan.profile_nama_perusahaan ,
        email : resp.email
      },
      no_docking : kapal.nama_kapal + ' -DD- ' + tahun,
      work_progress : workContainer
    }))

    this.alertStatus.emit('send_email')

    postBody.forEach(body => {
      const _subs = this.reportService.sendWorkProgressEmail(body)
      .pipe(take(1))
      .subscribe(({status} : any) => {
        if(status == 'ok') this.alertStatus.emit('success')
      },
      () => this.alertStatus.emit('error'))
      this.subscription.push(_subs)
    })
  }

  updateProgressOnBar(data) {
    if(!data.data?.items.length)  
    this.editableRow = data.data.id
  }

  updateBarProgress(datas, progress) {
    this.editableRow = "save";
    const {data : {id}, data} = datas
    data.progress = parseInt(progress.target.value);
    const work_area = this.FNCOL.updateWorkAreaData( this.workProgressData.work_area, id , data );
    this.workProgressData.work_area = this.FNCOL.calculateProgress( id, work_area )

    this.ngOnChanges()
  }

  saveProgress(){
    this.editableRow = 'notEdited';
    this.projectService.workArea( {work_area : this.workProgressData.work_area}, this.projectId)
    .pipe(take(1))
    .subscribe(() => {
      this.reloadPage.emit('complete')
    })
  }

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
      data : {dial : 'Add'}
    })
    this.destroyDialog(dialogRef)
  }

  updateJobSuplier(){
    const dialogRef = this.dialog.open(JobSuplierComponent, {
      autoFocus : true,
      disableClose : true,
      data : { 
        dial : 'Update',
        suplier : this.suplierData
      }
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

