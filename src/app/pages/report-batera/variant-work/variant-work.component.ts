import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { FunctionCollection } from '../../function-collection-batera/function-collection.component';
import { DeleteDialogComponent } from '../../home-batera/delete-dialog/delete-dialog.component';
import { SubMenuProjectComponent } from '../../project-batera/sub-menu-project/sub-menu-project.component';
import { WorkAreaComponent } from '../../project-batera/work-area/work-area.component';
import { ReportBateraService } from '../report-batera.service';

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
  ) { }

  useButtons = useButtons
  defaultColumns = ['Start', 'Stop', 'Responsible', 'Last Change', 'Vol', 'Unit', 'Unit Price Add On', 'Total Price Add On' ];
  allColumns = ['jobName', '%', ...this.defaultColumns, 'Approved' , 'edit'];
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

  @Input() variantWorkData : any = ""
  shipYard : boolean = false
  shipOwner : boolean = false
  projectId : string
  
  ngOnChanges(){
    this.projectId = this.activeRoute.snapshot.paramMap.get('id')
    this.variantWorkData?.variant_work === null ||
    this.variantWorkData?.variant_work === undefined ||
    this.variantWorkData?.variant_work[0] === null ? null :
    this.regroupData(false)
  }

  regroupData(expand){
    this.dataSource = this.dataSourceBuilder.create(this.variantWorkData?.variant_work.map(work => {
      const { departement, unitPriceAddOn, totalPriceAddOn, variantRemarks, status, updated_at} = work 
      const workItem = {
        "Dept": departement,
        "Unit Price Add On": unitPriceAddOn,
        "Total Price Add On" : totalPriceAddOn,
        "Remarks" : variantRemarks,
        "Status" : status,
        "Last Change" : updated_at,
      }
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
        useButtons[2].desc = "Unexpand"
        useButtons[2].icon = 'arrow-ios-forward-outline'
        this.regroupData(true)
      break;
      case 'Unexpand' :
        useButtons[2].desc = "Expand"
        useButtons[2].icon = 'arrow-ios-downward-outline'
        this.regroupData(false)
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
      this.variantWorkData.variant_work = this.FNCOL.updateWorkAreaData(this.variantWorkData.variant_work, parentIndex, postData)
      work?.items ? this.approvedData(work.items, approve) : 
      this.updateVariantWork(this.variantWorkData.variant_work)
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
