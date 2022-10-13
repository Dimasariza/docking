import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { SubMenuProjectComponent } from '../../project-batera/sub-menu-project/sub-menu-project.component';
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
  constructor(
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>,
    private dialog : MatDialog,
    private subMenuProject : SubMenuProjectComponent,
    ) {
  }

  useButtons = useButtons
  defaultColumns = [ 'Status', '%', 'Start', 'Stop', 'Responsible', 'Last Change', 'Vol', 'Unit', 'Unit Price Add On', 'Total Price Add On' ];
  allColumns = ['Job', ...this.defaultColumns, 'Approved', "Comment" , 'edit'];
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
  
  ngOnChanges(){
    this.variantWorkData === null ||
    this.variantWorkData === undefined ? null :
    this.dataSource = this.dataSourceBuilder.create(this.variantWorkData.variant_work.map(work => 
    this.populateData(work)) as TreeNode<FSEntry>[])
  }

  populateData = (work) => {          
    const {items, sfi, pekerjaan, start, end, departemen, volume, harga_satuan, kontrak , type, updated_at, id , responsible, satuan} = work  
      return {
      data: {
        "Job No": sfi,
        "Job": pekerjaan,
        "Dept": departemen,
        "Type" : type,
        "Start": start,
        "Stop": end,
        "Vol" : volume,
        "Unit" : satuan,
        "Unit Price": harga_satuan,
        "Total Price Budget" : kontrak,
        "Category" : type,
        "Remarks" : updated_at,
        "Responsible" : responsible,
        "index" : id,
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
      case desc :
        this.editVariantDial(desc)
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

  editVariantDial(data){
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
