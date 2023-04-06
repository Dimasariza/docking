import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { take } from 'rxjs/operators';
import { FunctionCollection } from '../function-collection-batera/function-collection.component';
import { DeleteDialogComponent } from '../home-batera/delete-dialog/delete-dialog.component';
import { HomeBateraService } from '../home-batera/home-batera.service';
import { ProfileBateraService } from '../profile-batera/profil-batera.service';
import { ProjectBateraService } from '../project-batera/project-batera.service';
import { SubMenuProjectComponent } from '../project-batera/sub-menu-project/sub-menu-project.component';
import { WorkAreaComponent } from '../project-batera/work-area/work-area.component';
import { ContractActionComponent } from './contract-action/contract-action.component';
import { TenderBateraService } from './tender-batera.service'

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
              public currency : CurrencyPipe,
              public FNCOL : FunctionCollection,
              private homeService : HomeBateraService
  ) {}

  headColumns = ['Job', 'Dept', 'Start', 'Stop', 'Vol', 'Unit', 'Unit Price Contract', 'Total Price Contract', 'Category', 'Remarks' ]
  defaultColumns = [ 'jobName', 'departement', 'Start', 'Stop', 'volume', 'Unit', 'Unit Price Contract', 'Total Price Contract', 'Category', 'remarks' ];
  allColumns = [ "jobNumber", 'rank',  ...this.defaultColumns, "Approve", "Edit"];

  dataSource: NbTreeGridDataSource<FSEntry>; 
  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;
  objectKeys = Object.keys;
  updateSort(sortRequest: NbSortRequest): void {
    return  this.subMenuProject.updateSort(sortRequest)
  }
  getSortDirection(column: string): NbSortDirection {
    return this.subMenuProject.getSortDirection(column);
  }
  getShowOn(index: number) {
    return this.subMenuProject.getShowOn(index)
  }
  triggerSelectFile(fileInput: HTMLInputElement) {
    fileInput.click()
  }

  projectData : any = []
  tenderData : any = []
  currentProject : any
  tenderId : any
  dataTable : object = {}
  approvalStatus = ["All","Critical","High","Medium","Low"]
  selectedText = "Select"
  workAreaContainer
  usedCurrency
  responsible : any
  currentRole 

  isFalsy = (value) => !value

  ngOnInit(): void {
    this.projectService.getDataProjects()
    .subscribe(({data} : any) => {
      this.projectData =
      data.map(i => {
        const {work_area, off_hire_period, off_hire_bunker_per_day, off_hire_rate_per_day, tahun, id_proyek, mata_uang, status, kapal : {nama_kapal}} = i
        return {
        workArea : work_area,
        offHire : parseInt(off_hire_period),
        offHireCost : parseInt(off_hire_rate_per_day),
        ownerCost : parseInt(off_hire_bunker_per_day),
        projectId : id_proyek,
        shipName : `${nama_kapal} -DD- ${tahun} ${this.FNCOL.convertStatus(status)}`,
        currency : mata_uang
      }})
    })

    this.homeService.getUserLogin()
    .subscribe(({data} : any) => {
      const {role} = data
      this.currentRole = role;
      console.log(role)
      if(role == 'admin')
      this.profileService.getUserData(1, 10)
      .subscribe(({data} : any) => this.responsible = data)    
    })
  }

  getProject(project){
    this.displayTender = null
    this.currentProject = this.projectData.find(p => p.projectId == project.projectId)
    const {workArea, currency} = this.currentProject
    this.usedCurrency = currency
    this.workAreaContainer = workArea
    if(this.isFalsy(workArea) || this.isFalsy(workArea[0])) this.dataSource = this.dataSourceBuilder.create([]) 
    if(!this.isFalsy(workArea) || !this.isFalsy(workArea[0]))
    this.dataSource = this.dataSourceBuilder.create(workArea.map(work => {
      const workItem = [currency, 'Price Contract']
      return this.FNCOL.populateData(work, workItem, false)
    }))
    this.loadYardData()
  }

  loadYardData(){
    this.tenderService.getProjectSummary()
    .subscribe(({data} : any) => {
      if(data.length) getProjectTender(data)
      if(!data.length) getAllTender('all')
    })

    const getProjectTender = (tender) => {
      let selectedYard = tender.find(yard => yard.id_proyek === this.currentProject.projectId)
      if(selectedYard) {
        this.selectedText = "Unselect"
        this.tenderService.getDataTenderPerId(selectedYard?.id_tender)
        .subscribe(({data} : any) => {
          this.tenderId = selectedYard?.id_tender
          this.renderYard(data)
        })
      } 
      else getAllTender('other')
    }

    const getAllTender = (conds) => {
      this.selectedText = "Select"
      let tenderId = this.tenderData.map(tender => tender.id_tender)
      this.tenderService.getDataTender(10, "all")
      .subscribe(({data} : any) => {
        if(conds == 'other') this.tenderData = data.filter(tender => !tenderId.includes(tender.id_tender))
        if(conds == 'all') this.tenderData = data
      })
    }
  }

  getYard(id){
    const {id_tender} = this.tenderData[id]
    this.tenderId = id_tender
    this.renderYard(this.tenderData[id])
  }
  
  displayTender
  renderYard(tender){
    const {general_diskon_persen, additional_diskon, nama_galangan, sum_internal_adjusment} = tender
    this.tenderId = tender?.id_tender
    this.displayTender = tender
    if(this.currentRole == "shipyard") return;
    this.displayTender.responsible = this.responsible.find(resp => resp.id_user == tender.id_user)
    const {offHire, offHireCost, ownerCost} = this.currentProject
    this.dataTable = {
      'Yard' : nama_galangan,
      'Currency': this.usedCurrency,
      'Offhire Repair Period (In Dock)': offHire,
      'Offhire Cost': this.currency.transform(offHireCost, this.FNCOL.convertCurrency(this.usedCurrency)),
      'Owner Cost': this.currency.transform(ownerCost, this.FNCOL.convertCurrency(this.usedCurrency)),
      'Owner Total Cost': this.currency.transform(offHireCost + ownerCost, this.FNCOL.convertCurrency(this.usedCurrency)),
      'Sum Internal Adjusment': this.currency.transform(sum_internal_adjusment, this.FNCOL.convertCurrency(this.usedCurrency)), 
      'General Discount': `(${general_diskon_persen} %) ${this.currency.transform(general_diskon_persen * (offHireCost + ownerCost) / 100, this.FNCOL.convertCurrency(this.usedCurrency))}`,
      'Additional Discount': `(${additional_diskon} %) ${this.currency.transform(additional_diskon * (offHireCost + ownerCost) / 100, this.FNCOL.convertCurrency(this.usedCurrency))}`,
    }
  }

  editLoadDetails(row){
    const dialog = this.dialog.open(WorkAreaComponent, {
      disableClose : true,
      autoFocus:true, 
      data : {
        dial : 'Update Load Details',
        id : this.currentProject.projectId,
        data : row,
        work : {
          work_area : this.workAreaContainer,
          mata_uang : this.usedCurrency
        }
      }
    })    
    dialog.componentInstance.onSuccess.asObservable().subscribe(() => {
      this.ngOnInit()
      setTimeout(() => {
        this.getProject(this.currentProject)
      }, 1000);
    })
  }

  showContract() {
    console.log("show contract")
  }

  addContractDial(){
    const dialog = this.dialog.open(ContractActionComponent, {
      disableClose : true,
      autoFocus : true,
      data : {
        dial : 'Add',
      }
    })
    dialog.componentInstance.onSuccess.asObservable().subscribe(() => {
      this.ngOnInit();
      this.loadYardData();
    });
  }
  
  updateContractDial(){
    const dialog = this.dialog.open(ContractActionComponent, {
      disableClose : true,
      autoFocus : true,
      data : {
        dial : 'Update',
        projectId :  this.currentProject.projectId,
        data : this.displayTender
      }
    })
    dialog.componentInstance.onSuccess.asObservable().subscribe(() => {
      this.ngOnInit()
      this.loadYardData();
    });
  }

  approveByRank(id) {
    const tenderApproval = {tenderApproval : true}
    this.workAreaContainer.forEach(work => {
      if(id == 0) this.approvedData([work], tenderApproval)
      if(id != 0 && id - 1 == work.rank) this.approvedData([work], tenderApproval)
    })
    this.updateWorkApproval(this.workAreaContainer)
  }

  approvedByYard(newData){
    const tenderApproval = {tenderApproval : true}
    this.approvedData(newData, tenderApproval)
    this.updateWorkApproval(this.workAreaContainer)
  }

  approvedData(newData, approve) {
    newData.map(work => {
      const postData = { ...work, ...approve}
      this.workAreaContainer = this.FNCOL.updateWorkAreaData(this.workAreaContainer, work.id, postData)
      if(work?.items?.length) this.approvedData(work.items, approve) 
    })
  }

  updateWorkApproval(work_area){
    this.projectService.workArea({work_area}, this.currentProject.projectId)
    .pipe(take(1))
    .subscribe(({status} : any) => {
      this.ngOnInit()
      setTimeout(() => {
        this.getProject(this.currentProject)
      }, 1000);
    })
  }

  chooseTender(){
    if(this.selectedText == 'Select') {
      this.tenderService.selectTender(this.currentProject.projectId, this.tenderId)
      .subscribe(() =>{
        this.selectedText = 'Unselect'
      })
    }
    if(this.selectedText == 'Unselect') {
      this.tenderService.unselectTender(this.tenderId)
      .subscribe(() => {
        this.selectedText = 'Select'
        this.loadYardData()
      })
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



