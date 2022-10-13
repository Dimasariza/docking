import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { SubMenuProjectComponent } from '../../project-batera/sub-menu-project/sub-menu-project.component';
import { ReportBateraService } from '../report-batera.service';
import { WorkAreaComponent } from '../work-area/work-area.component';

interface TreeNode<T> {}
interface FSEntry {}
const useButtons = [
  {
  icon: 'refresh',
  desc: 'Refresh'
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
  defaultColumns = [ 'Status', '%', 'Start', 'Stop', 'Responsible', 'Last Change', 'Vol', 'Unit', 'Unit Price Add On', 'Total Price Add On' ];
  allColumns = ['Job', ...this.defaultColumns, 'Approved', "Comment" , 'edit'];
  dataSource: NbTreeGridDataSource<FSEntry>;
  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;
  shipYard : boolean = false
  shipOwner : boolean = false

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
  
  ngOnChanges(){
    this.variantWorkData === null ||
    this.variantWorkData === undefined ? null :
    this.dataSource = this.dataSourceBuilder.create(this.variantWorkData.variant_work.map(work => 
    this.populateData(work)))
  }

  populateData = (work) => {          
    const {items, jobNumber, jobName, start, end, departement, volume, unitPriceAddOn, totalPriceAddOn , category, variantRemarks, id , responsible, unit} = work  
      return {
      data: {
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
        "Responsible" : responsible,
        id,
        "kind" : items?.length ? 'dir' : 'doc'
      },
      children: items?.length ? items.map(child => this.populateData(child)) : []
    }
  }

  onClick(desc){
    switch (desc) {
      case 'Add Job' :
        this.addVariantDial()
      break;
      case 'shipYard':
        this.shipYard = !this.shipYard
      break;
      case 'shipOwner':
        this.shipOwner =! this.shipOwner
      break;
    }
  }

  addVariantDial(){
    const dialogRef = this.dialog.open(WorkAreaComponent, {
      disableClose : true, 
      autoFocus:true,
      data : {
        dial : "Add Variant",
        data : this.variantWorkData
      }
    })
  }

  addSubVariantDial(data){
    const dialogRef = this.dialog.open(WorkAreaComponent, {
      disableClose : true, 
      autoFocus:true,
      data : {
        dial : "Add Sub Variant",
        data : this.variantWorkData,
        subData : data
      }
    })
  }

  deleteVariant(id){
    let parentIndex = id.toString().split('')
    let postBody
    const deleteData = this.subMenuProject.reconstructData(this.variantWorkData.variant_work, parentIndex)
    deleteData.length === 0 ||
    deleteData === undefined ? 
    postBody = {variant_work : [null]} : postBody = {work_area : deleteData}
    console.log(postBody)
    const {id_proyek} = this.variantWorkData
    this.reportService.updateVarianWork(postBody, id_proyek)
    .subscribe(res => {

      console.log(res)
      // this.dataSource = this.dataSourceBuilder.create(postBody)
    })
  }

  updateVariantDial(data){
    const dialogRef = this.dialog.open(WorkAreaComponent, {
      disableClose : true, 
      autoFocus:true,
      data : {
        dial : "Edit Variant",
        data : this.variantWorkData,
        subData : data
      }
    })
  }
}
