import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { SubMenuProjectComponent } from '../../project-batera/sub-menu-project/sub-menu-project.component';
import { ReportBateraService } from '../report-batera.service';
import { VariantWorkAreaComponent } from '../variant-work-area/variant-work-area.component';

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
              private subMenuProject : SubMenuProjectComponent,
              private reportService : ReportBateraService
  ) { }

  useButtons = useButtons
  defaultColumns = ['Start', 'Stop', 'Responsible', 'Last Change', 'Vol', 'Unit', 'Unit Price Add On', 'Total Price Add On' ];
  allColumns = ['Job', '%', ...this.defaultColumns, 'Approved', "Comment" , 'edit'];
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
  expandAll : boolean = false
  expandText : string
  

  ngOnChanges(){
    this.variantWorkData === null ||
    this.variantWorkData === undefined ||
    this.variantWorkData?.variant_work[0] === null ? null :
    this.dataSource = this.dataSourceBuilder.create(this.variantWorkData?.variant_work.map(work => 
    this.populateData(work)))
  }

  populateData = (work) => {          
    const {items, jobNumber, jobName, start, end, departement, volume, unitPriceAddOn, totalPriceAddOn , category, variantRemarks, 
      responsible, unit, status, updated_at} = work  
      return {
      data: {
        ...work,
        "Job No": jobNumber,
        "Job": jobName,
        "Dept": departement,
        "Start": start,
        "Stop": end,
        "Vol" : volume,
        "Unit" : unit,
        "Unit Price Add On": unitPriceAddOn,
        "Total Price Add On" : totalPriceAddOn,
        "Category" : category,
        "Remarks" : variantRemarks,
        "Responsible" : responsible?.name,
        "kind" : items?.length ? 'dir' : 'doc',
        "Status" : status,
        "Last Change" : updated_at,
      },
      children: items?.length ? items.map(child => this.populateData(child)) : []
    }
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
        this.expandAll = !this.expandAll
        this.expandText = "unexpand"
      break;
    }
  }


  addVariantDial(){
    const dialogRef = this.dialog.open(VariantWorkAreaComponent, {
      disableClose : true, 
      autoFocus:true,
      data : {
        dial : "Add Variant",
        data : this.variantWorkData
      }
    })
    dialogRef.componentInstance.onSuccess.asObservable().subscribe(() => {
      this.reloadPage.emit('complete')
    });
  }

  addSubVariantDial(data){
    const dialogRef = this.dialog.open(VariantWorkAreaComponent, {
      disableClose : true, 
      autoFocus:true,
      data : {
        dial : "Add Sub Variant",
        data : this.variantWorkData,
        subData : data
      }
    })
    dialogRef.componentInstance.onSuccess.asObservable().subscribe(() => {
      this.reloadPage.emit('complete')
    });
  }

  updateVariantDial(data){
    console.log(data)
    const dialogRef = this.dialog.open(VariantWorkAreaComponent, {
      disableClose : true, 
      autoFocus:true,
      data : {
        dial : "Edit Variant",
        data : this.variantWorkData,
        subData : data
      }
    })
    dialogRef.componentInstance.onSuccess.asObservable().subscribe(() => {
      this.reloadPage.emit('complete')
    });
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
    const approveData = this.updateWorkAreaData(this.variantWorkData.variant_work, parentIndex, postData)
    this.updateVariantWork(approveData)
  }
  
  approvedByOwner(newData){
    this.shipOwner = true
    let postData = { ...newData.data, ownerApproval : this.shipOwner}
    const parentIndex = postData.id.toString().split('')
    const approveData = this.updateWorkAreaData(this.variantWorkData.variant_work, parentIndex, postData)
    this.updateVariantWork(approveData)
  }


  deleteVariant(id){
    let parentIndex = id.toString().split('')
    let postBody
    const deleteData = this.subMenuProject.reconstructData(this.variantWorkData.variant_work, parentIndex)
    deleteData.length === 0 ||
    deleteData === undefined ? 
    postBody = [null] : postBody =  deleteData
    this.updateVariantWork(postBody)
  }
  
  @Output() reloadPage = new EventEmitter<string>();
  updateVariantWork(variant_work){
    this.reportService.updateVarianWork({variant_work}, this.variantWorkData.id_proyek)
    .subscribe(() => 
    this.reloadPage.emit('complete')
    )
  }

}
