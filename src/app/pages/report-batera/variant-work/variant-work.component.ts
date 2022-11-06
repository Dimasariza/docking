import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { ExportToExcel } from '../../function-collection-batera/export-excel';
import { FunctionCollection } from '../../function-collection-batera/function-collection.component';
import { DeleteDialogComponent } from '../../home-batera/delete-dialog/delete-dialog.component';
import { SubMenuProjectComponent } from '../../project-batera/sub-menu-project/sub-menu-project.component';
import { WorkAreaComponent } from '../../project-batera/work-area/work-area.component';
import { JobSuplierComponent } from '../job-suplier/job-suplier.component';
import { ReportBateraService } from '../report-batera.service';

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
  {
    icon: 'briefcase-outline',
    desc: 'Add Job'
  },
]

@Component({
  providers : [SubMenuProjectComponent],
  selector: 'ngx-variant-work',
  templateUrl: './variant-work.component.html',
})
export class VariantWorkComponent implements OnChanges {
  constructor(private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>,
              private dialog : MatDialog,
              private activeRoute : ActivatedRoute,
              private subMenuProject : SubMenuProjectComponent,
              private reportService : ReportBateraService,
              public FNCOL : FunctionCollection,
              public excelService : ExportToExcel,
  ) { }

  useButtons = useButtons
  defaultColumns = ['Start', 'Stop', 'Responsible', 'Update', 'Volume', 'Unit', 'Unit Price Add On', 'Total Price Add On' ];
  allColumns = ['jobName', '%', ...this.defaultColumns, 'Approved', 'suplier' , 'edit'];
  dataSource: NbTreeGridDataSource<FSEntry>;
  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;
  @Input() suplierData : any [] = ['Data Not Available']


  updateSort(sortRequest: NbSortRequest): void {
    return  this.subMenuProject.updateSort(sortRequest)
  }
  getSortDirection(column: string): NbSortDirection {
    return this.subMenuProject.getSortDirection(column)
  }
  getShowOn(index: number) {
    return this.subMenuProject.getShowOn(index)
  }

  @Input() variantWorkData : any = ""
  @Input() workProgressData : any
  projectId : string
  
  isFalsy = (value) => !value

  ngOnChanges(){
    this.projectId = this.activeRoute.snapshot.paramMap.get('id')
    if(!this.variantWorkData) return
    this.variantWorkData['mata_uang'] = this.workProgressData.mata_uang
    const {variant_work} = this.variantWorkData
    if(this.isFalsy(variant_work) || this.isFalsy(variant_work[0])) return
    this.regroupData(false)
  }

  regroupData(expand){
    this.dataSource = this.dataSourceBuilder.create(this.variantWorkData?.variant_work.map(work => {
      const workItem = [this.workProgressData.mata_uang, 'Unit Price Budget', 'Total Price Budget']
      return this.FNCOL.populateData(work, workItem, expand)
    }))
  }

  onClick(desc){
    switch (desc) {
      case 'Add Job' :
        this.addVariantDial()
      break;
      case 'Refresh' :
        this.reloadPage.emit('complete')
      break;
      case 'Expand' :
        useButtons[4].desc = "Unexpand"
        useButtons[4].icon = 'arrow-ios-forward-outline'
        this.regroupData(true)
      break;
      case 'Unexpand' :
        useButtons[4].desc = "Expand"
        useButtons[4].icon = 'arrow-ios-downward-outline'
        this.regroupData(false)
      break;
      case 'Add Suplier' :
      this.addJobSuplier()
      break;
      case 'Export to Excel' :
      this.excelService.reconstructJobsToExcel(this.variantWorkData.variant_work)
      this.excelService.exportAsExcelFile(this.excelService.excelData, this.variantWorkData?.head)
      break;
    }
  }

  addVariantDial(){
    const dialogRef = this.dialog.open(WorkAreaComponent, {
      disableClose : true, 
      autoFocus:true,
      data : {
        dial : "Add Variant",
        id : this.projectId,
        work : this.variantWorkData
      }
    })
    dialogRef.componentInstance.onSuccess.asObservable().subscribe(() => {
      this.reloadPage.emit('complete')
    });
  }

  addSubVariantDial(row){
    const dialogRef = this.dialog.open(WorkAreaComponent, {
      disableClose : true, 
      autoFocus:true,
      data : {
        dial : "Add Sub Variant",
        id : this.projectId,
        data : row,
        work : this.variantWorkData
      }
    })
    dialogRef.componentInstance.onSuccess.asObservable().subscribe(() => {
      this.reloadPage.emit('complete')
    });
  }

  updateVariantDial(row){
    const dialogRef = this.dialog.open(WorkAreaComponent, {
      disableClose : true, 
      autoFocus:true,
      data : {
        dial : "Edit Variant",
        id : this.projectId,
        data : row,
        work : this.variantWorkData
      }
    })
    dialogRef.componentInstance.onSuccess.asObservable().subscribe(() => {
      this.reloadPage.emit('complete')
    });
  }

  addJobSuplier(){
    const dialogRef = this.dialog.open(JobSuplierComponent, {
      autoFocus : true,
      disableClose : true,
    })
    // this.destroyDialog(dialogRef)
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
      this.variantWorkData.variant_work 
      = this.FNCOL.updateWorkAreaData(this.variantWorkData.variant_work, work.id, { ...work, ...approve})
      work?.items?.length 
      ? this.approvedData(work.items, approve) 
      : this.updateVariantWork(this.variantWorkData.variant_work)
    })
  }

  deleteVariant(row) {
    const dialog = this.dialog.open(DeleteDialogComponent, {
      disableClose : true,
      autoFocus: true,
      data : {
        dial : "variant job",
        id : this.projectId,
        work_area : this.variantWorkData.variant_work,
        parentId : row.data.id
      }});
    return dialog
  }
  
  @Output() reloadPage = new EventEmitter<string>();
  updateVariantWork(variant_work){
    this.reportService.updateVarianWork({variant_work}, this.variantWorkData.id_proyek)
    .subscribe(() => 
    this.reloadPage.emit('complete')
    )
  }

}
