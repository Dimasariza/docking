import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { ProjectBateraService } from '../project-batera/project-batera.service';
import { SubMenuProjectComponent } from '../project-batera/sub-menu-project/sub-menu-project.component';
import { AddYardComponent } from './add-yard/add-yard.component';
import { TenderBateraService } from './tender-batera.service'
import { UpdateLoadDetailsComponent } from './update-load-details/update-load-details.component';

interface TreeNode<T> {}
interface FSEntry{}
const dataTable : any = {
  'Yard' : "",
  'Currency': '',
  'Offhire Repair Period (In Dock)': "",
  'Offhire Cost': "",
  'Owner Cost': "",
  'Owner Total Cost': "",
  'Yard Total Contract': "",
  'Sum Internal Adjusment': "",
  'General Discount': {
    discount : "",
    after : ""
  },
  'Additional Discount': {
    discount : "",
    after : ""
  }
}

@Component({
  providers : [SubMenuProjectComponent],
  selector: 'ngx-tender-batera',
  templateUrl: './tender-batera.component.html',
})

export class TenderBateraComponent  {
  constructor(private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>,
              private projectService : ProjectBateraService,
              private tenderService : TenderBateraService,
              private dialog : MatDialog,
              private subMenuProject : SubMenuProjectComponent
  ) {}

  defaultColumns = [ 'Job', 'Dept', 'Start', 'Stop', 'Vol', 'Unit', 'Unit Price Contract','Total Price Contract', 'Category', 'Remarks' ];
  allColumns = [ "Job No", 'rank', 'Resp', ...this.defaultColumns, "Approve", "Edit"];
  dataSource: NbTreeGridDataSource<FSEntry>; 
  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;
  objectKeys = Object.keys;
  updateSort(sortRequest: NbSortRequest): void {
    return  this.subMenuProject.updateSort(sortRequest)
  }
  getSortDirection(column: string): NbSortDirection {
    return this.subMenuProject.getSortDirection(column)
  }
  getShowOn(index: number) {
    return this.subMenuProject.getShowOn(index)
  }
  triggerSelectFile(fileInput: HTMLInputElement) {
    fileInput.click()
  }

  allDataTender : object = {}
  id_proyek : any
  id_tender : any
  enableSelectYard : boolean = true
  dataTable = dataTable
  approvalStatus = ["All","Critical","High","Medium","Low"]

  ngOnInit(): void {
    this.projectService.getDataProjects()
    .subscribe(({data} : any) => {
      this.allDataTender['project'] = 
      data.map(item => ({
        ...data,
        id_proyek : item.id_proyek,
        name : item.kapal.nama_kapal + ' -DD- ' + item.tahun,
      }))
    })

    this.tenderService.getDataTender(10, "all")
    .subscribe(({data} : any) => {
      this.allDataTender['tender'] = data
    })
  }

  getProject(id){
    this.enableSelectYard = false
    const {work_area, id_proyek} = this.allDataTender['project'][id]
    this.id_proyek = id_proyek
    work_area === null ||
    work_area === undefined ? this.dataSource = null :
    this.dataSource = this.dataSourceBuilder.create(work_area.map(work => this.populateData(work)) as TreeNode<FSEntry>[])
  }

  getYard(data){
    // const tender = this.allDataTender['tender'][id]
    this.dataTable = {
      // 'Yard' : tender.nama_galangan,
      'Currency': 'IDr',
      'Offhire Repair Period (In Dock)': 10000,
      'Offhire Cost': 1000,
      'Owner Cost': 120000,
      'Owner Total Cost': 10000,
      'Yard Total Contract': 2000,
      'Sum Internal Adjusment': 1000,
      'General Discount': {
        discount : '11',
        'after' : 10000
      },
      'Additional Discount': {
        discount : '10',
        'after' : 10000
      }
    }
  }

  populateData = (work) => { 
    const {items, jobNumber, jobName, start, end, departement, volume, unitPrice, totalPriceBudget, remarks, unit, responsible, rank, id, category, type} = work   
    console.log(work)        
    return {
      data: {
        "Job No": jobNumber,
        "Job": jobName,
        "Dept": departement,
        "Resp" : responsible,
        "Start": start,
        "Stop": end,
        "Vol" : volume,
        "Unit" : unit,
        "Category" : category,
        "Remarks" : remarks,
        "kind": items?.length ? 'dir' : 'doc',
        rank,
        id,
        unitPrice,
        totalPriceBudget,
        type
      },
      children: items?.length ? items.map(child => this.populateData(child)) : []
    }
  }

  editLoadDetails(row){
    let {data} = row
    const dialog = this.dialog.open(UpdateLoadDetailsComponent, {
      disableClose : true,
      autoFocus:true, 
      data : {
        project : this.id_proyek,
        job : data
      }
    })    
    dialog.componentInstance.onSuccess.asObservable().subscribe(() => {
      this.ngOnInit()
    })
  }

  addContractDial(){
    const dialog = this.dialog.open(AddYardComponent, {
      disableClose : true,
      autoFocus : true,
      data : this.id_proyek
    })

    dialog.componentInstance.onSuccess.asObservable().subscribe(() => {
      this.ngOnInit()
    });
  }

  approveStatus(){
    // this.approvalStatus = !this.approvalStatus
  }

  unselectTender(){

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


