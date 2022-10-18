import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { ProfileBateraService } from '../profile-batera/profil-batera.service';
import { ProjectBateraService } from '../project-batera/project-batera.service';
import { SubMenuProjectComponent } from '../project-batera/sub-menu-project/sub-menu-project.component';
import { ContractActionComponent } from './contract-action/contract-action.component';
import { TenderBateraService } from './tender-batera.service'
import { UpdateLoadDetailsComponent } from './update-load-details/update-load-details.component';

interface TreeNode<T> {}
interface FSEntry{}

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
              private subMenuProject : SubMenuProjectComponent,
              private profileService : ProfileBateraService,
              private datePipe : DatePipe
  ) {}

  headColumns = ['Job', 'Dept', 'Start', 'Stop', 'Vol', 'Unit', 'Unit Price Contract', 'Total Price Contract', 'Category', 'Remarks' ]
  defaultColumns = [ 'jobName', 'departement', 'Start', 'Stop', 'volume', 'Unit', 'unitPrice', 'totalPrice', 'Category', 'remarks' ];
  allColumns = [ "jobNumber", 'rank',  ...this.defaultColumns, "Approve", "Edit"];

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

  tenderData 
  projectData
  projectId : any
  tenderId : any
  dataTable : object = {}
  selectedYard : any
  approvalStatus = ["All","Critical","High","Medium","Low"]

  ngOnInit(): void {
    this.projectService.getDataProjects()
    .subscribe(({data} : any) => {
      this.projectData =
      data.map(item => ({
        workArea : item.work_area,
        offHire : item.off_hire_period,
        offHireCost : item.off_hire_rate_per_day,
        ownerCost : item.off_hire_bunker_per_day,
        projectId : item.id_proyek,
        shipName : item.kapal.nama_kapal + ' -DD- ' + item.tahun,
        currency : item.mata_uang
      }))
    })
  }

  getProject(id){
    const {workArea, projectId, currency, offHire, offHireCost, ownerCost} = this.projectData[id]
    this.projectId = projectId
    this.projectData['currency'] = currency
    this.projectData['offHire'] = offHire
    this.projectData['offHireCost'] = offHireCost
    this.projectData['ownerCost'] = ownerCost
    // workArea === null ||
    // workArea === undefined ? this.dataSource = null :
    // this.dataSource = this.dataSourceBuilder.create(workArea.map(work => this.populateData(work)) as TreeNode<FSEntry>[])
    this.loadYardData()
  }

  loadYardData(){
    this.tenderService.getProjectSummary(1, '', '','')
    .subscribe(({data} : any) => {
      this.tenderData = data
      let selectedYard

      if(data.length) {
        selectedYard = data.find(yard => yard.id_proyek)
      } else {
        this.tenderService.getDataTender(10, "all")
        .subscribe(({data} : any) => {
          this.tenderData = data
          this.tenderId = false
          this.renderYard(undefined)
        })
      }

      if(selectedYard.proyek.id_proyek === this.projectId) {
        this.tenderService.getDataTenderPerId(selectedYard.id_tender)
        .subscribe(({data} : any) => {
          this.selectedYard = data
          this.tenderId = selectedYard.id_tender
          this.renderYard(data)
        })
      } else {
        this.tenderService.getDataTender(10, "all")
        .subscribe(({data} : any) => {
          this.tenderId = false
          this.selectedYard = false
          this.tenderData = null
          this.displayTender = null
          this.tenderData = data.filter(yard => yard.id_tender !== selectedYard.id_tender)
        })
      }  

    })
  }

  getYard(id){
    const {id_tender} = this.tenderData[id]
    console.log(this.projectId, id_tender)

    this.tenderService.selectTender(this.projectId, id_tender)
    .subscribe(res => console.log(res))
    this.renderYard(this.tenderData[id])
  }

  
  displayTender
  renderYard(tender){
    const {general_diskon_persen, additional_diskon, nama_galangan, sum_internal_adjusment} = tender
    this.displayTender = tender
    console.log(tender)
    this.selectedYard = true

    this.tenderId = tender.id_tender
    this.profileService.getUserPerId(tender.id_user)
    .subscribe(({data} : any) => this.displayTender.responsible = data.nama_lengkap)

    const offHire = this.projectData['offHire']
    const currency = this.projectData['currency']
    const offHireCost = parseInt(this.projectData['offHireCost'])
    const ownerCost = parseInt(this.projectData['ownerCost'])

    this.dataTable = {
      'Yard' : nama_galangan,
      'Currency': currency,
      'Offhire Repair Period (In Dock)': offHire,
      'Offhire Cost': offHireCost,
      'Owner Cost': ownerCost,
      'Owner Total Cost': offHireCost + ownerCost,
      'Sum Internal Adjusment': sum_internal_adjusment,
      'General Discount': {
        discount : general_diskon_persen,
        'after' : general_diskon_persen * (offHireCost + ownerCost) / 100
      },
      'Additional Discount': {
        discount : additional_diskon,
        'after' : additional_diskon * (offHireCost + ownerCost) / 100
      }
    }
  }

  populateData = (work) => { 
    const {items, start, end, unit, category} = work   
    console.log(work)
    return {
      data: {
        Start : this.datePipe.transform(start, 'yyyy-MM-dd'),
        Stop : this.datePipe.transform(end, 'yyyy-MM-dd'),
        Unit : unit.name,
        kind : items?.length ? 'dir' : 'doc',
        Category : category.name,
        ...work,
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
        project : this.projectId,
        job : data
      }
    })    
    dialog.componentInstance.onSuccess.asObservable().subscribe(() => {
      this.ngOnInit()
    })
  }

  addContractDial(){
    const dialog = this.dialog.open(ContractActionComponent, {
      disableClose : true,
      autoFocus : true,
      data : {
        dial : 'Add',
        projectId :  this.projectId,
      }
    })
    dialog.componentInstance.onSuccess.asObservable().subscribe(() => {
      this.ngOnInit()
    });
  }

  
  updateContractDial(){
    const dialog = this.dialog.open(ContractActionComponent, {
      disableClose : true,
      autoFocus : true,
      data : {
        dial : 'Update',
        projectId :  this.projectId,
        data : this.displayTender
      }
    })
    dialog.componentInstance.onSuccess.asObservable().subscribe(() => {
      this.ngOnInit()
    });
  }

  approveStatus(){
    // this.approvalStatus = !this.approvalStatus
  }

  unselectTender(){
    this.tenderService.unselectTender(this.tenderId)
    .subscribe(res => console.log(res))
  }

  deleteYard(){}

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


