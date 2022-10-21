import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { take } from 'rxjs/operators';
import { FunctionCollection } from '../function-collection-batera/function-collection.component';
import { DeleteDialogComponent } from '../home-batera/delete-dialog/delete-dialog.component';
import { ProfileBateraService } from '../profile-batera/profil-batera.service';
import { ProjectBateraService } from '../project-batera/project-batera.service';
import { SubMenuProjectComponent } from '../project-batera/sub-menu-project/sub-menu-project.component';
import { WorkAreaComponent } from '../project-batera/work-area/work-area.component';
import { ContractActionComponent } from './contract-action/contract-action.component';
import { TenderBateraService } from './tender-batera.service'

interface TreeNode<T> {}
interface FSEntry{}

@Component({
  providers : [SubMenuProjectComponent],
  selector: 'ngx-tender-batera',
  templateUrl: './tender-batera.component.html',
})

export class TenderBateraComponent {
  constructor(private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>,
              private projectService : ProjectBateraService,
              private tenderService : TenderBateraService,
              private dialog : MatDialog,
              private subMenuProject : SubMenuProjectComponent,
              private profileService : ProfileBateraService,
              private datePipe : DatePipe,
              public FNCOL : FunctionCollection
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

  tenderData : any = []
  projectData
  tenderCollection : any = []
  projectId : any
  tenderId : any
  dataTable : object = {}
  selectedYard : any
  approvalStatus = ["All","Critical","High","Medium","Low"]
  selectedText = "Select"
  tenderApproval : boolean = false
  workAreaContainer
  currentProjectId

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
    this.currentProjectId = id
    this.selectedYard = null
    this.displayTender = null
    const {workArea, projectId, currency, offHire, offHireCost, ownerCost} = this.projectData[id]
    this.workAreaContainer = workArea
    this.projectId = projectId
    this.projectData['currency'] = currency
    this.projectData['offHire'] = offHire
    this.projectData['offHireCost'] = offHireCost
    this.projectData['ownerCost'] = ownerCost
    workArea === null ||
    workArea === undefined ? 
    this.dataSource = this.dataSourceBuilder.create([]) :
    this.dataSource = this.dataSourceBuilder.create(workArea.map(work => {
      const {volume, 'Price Contract' : contractPrice} = work
      const workItem = {
        "unitPrice" : contractPrice,
        "totalPrice" : volume * contractPrice,
      }
      return this.FNCOL.populateData(work, workItem)
    }) as TreeNode<FSEntry>[])
    this.loadYardData()
  }

  loadYardData(){
    let selectedYard
    this.selectedText = "Select"
    this.tenderService.getProjectSummary('', '', '','')
    .subscribe(({data} : any) => {
      this.tenderData = data
      this.tenderCollection = data.map(tender => tender.id_tender)
      if(data.length) getProjectTender()
      if(!data.length) getAllTender('all')
    })

    const getProjectTender = () => {
      selectedYard = this.tenderData.find(yard => yard.id_proyek === this.projectId)
      if(selectedYard) {
        this.selectedText = "Unselect"
        this.tenderService.getDataTenderPerId(selectedYard?.id_tender)
        .subscribe(({data} : any) => {
          this.selectedYard = data
          this.tenderId = selectedYard?.id_tender
          this.renderYard(data)
        })
      } 
      else {
        getAllTender('other')
      }
    }

    const getAllTender = (conds) => {
      this.tenderService.getDataTender(10, "all")
      .subscribe(({data} : any) => {
        if(conds == 'other') {
          this.tenderData = data.filter(tender => !this.tenderCollection.includes(tender.id_tender))
        }
        if(conds == 'all') {
          this.tenderData = data
        }
      })
    }
  }

  getYard(id){
    const {id_tender} = this.tenderData[id]
    this.tenderId = id_tender
    this.selectedYard = this.tenderData[id] 
    this.renderYard(this.tenderData[id])
  }
  
  displayTender
  renderYard(tender){
    const {general_diskon_persen, additional_diskon, nama_galangan, sum_internal_adjusment} = tender
    this.displayTender = tender
    this.tenderId = tender?.id_tender

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

  editLoadDetails(row){
    const dialog = this.dialog.open(WorkAreaComponent, {
      disableClose : true,
      autoFocus:true, 
      data : {
        dial : 'Update Load Details',
        parentId : row.data.id,
        id : this.projectId,
        data : row,
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

  approvedByYard(newData){
    this.tenderApproval = true
    let postData = { ...newData.data, tenderApproval : this.tenderApproval}
    this.updateWorkApproval(postData)
  }

  updateWorkApproval(postData){
    const parentIndex = postData.id.toString().split('')
    const work_area = this.FNCOL.updateWorkAreaData(this.workAreaContainer, parentIndex, postData)
    this.projectService.workArea({work_area}, this.projectId)
    .pipe(take(1))
    .subscribe((res) => {
      this.ngOnInit()
    })
    this.getProject(this.currentProjectId)
  }


  chooseTender(){
    if(this.selectedText == 'Select') {
      this.tenderService.selectTender(this.projectId, this.tenderId)
      .subscribe(res => console.log(res))
    }
    if(this.selectedText == 'Unselect') {
      this.tenderService.unselectTender(this.tenderId)
      .subscribe(res => console.log(res))
    }
  }

  deleteYard(){
    const dialog = this.dialog.open(DeleteDialogComponent, {
      disableClose : true,
      autoFocus : true,
      data : {
        dial : 'yard',
        id : this.tenderId
      }
    })
    dialog.componentInstance.onSuccess.asObservable().subscribe(() => {
      this.ngOnInit()
    });
  }

  ngOnDestroy(){

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


