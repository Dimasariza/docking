import { CurrencyPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { take, takeUntil } from 'rxjs/operators';
import { DeleteDialogComponent } from '../../component/delete-dialog/delete-dialog.component';
import { ProjectBateraService } from '../project-batera/project-batera.service';
import { TenderBateraService } from './tender-batera.service'
import { Subject } from 'rxjs';
import { TableFunctions } from '../../component/global-component/global-data';
import { ReportBateraService } from '../report-batera/report-batera.service';
import { YardDetailsDialog } from './yard-details-dialog/yard-details-dialog.component';
import { YardDialogComponent } from './yard-dialog/yard-dialog.component';
import { ToastrComponent } from '../../component/toastr-component/toastr.component';
import { HttpEventType } from "@angular/common/http";
import { jsPDF } from "jspdf";


interface FSEntry{}

@Component({
  selector: 'ngx-tender-batera',
  templateUrl: './tender-batera.component.html',
})

export class TenderBateraComponent implements OnInit, OnDestroy {
  constructor(
    private projectService : ProjectBateraService,
    private tenderService : TenderBateraService,
    public currency : CurrencyPipe,
    private dialogService: NbDialogService,
    private reportService : ReportBateraService,
    public tableFunction : TableFunctions,
    private toastr : ToastrComponent,
  ) {}

  private destroy$: Subject<void> = new Subject<void>();

  userAccess : any;
  
  activeProject : any = {};
  addNewContract : any = {};
  tenderData : any = [];
  projectData : any = [];
  projectSummary : any;
  workAreaData : any = [];
  
  ngOnInit(): void {
    this.addNewContract = {};
    this.projectService.getDataProjects()
    .pipe(takeUntil(this.destroy$), take(1))
    .subscribe(({data} : any) => {
      this.projectData = data.map(project => {
        const {kapal : {nama_kapal}, tahun, status} = project;
        const projectTitle = `${nama_kapal} -DD- ${tahun} ${status.toUpperCase()}`
        return {...project, projectTitle, hover : false}
      })
      },
      () => this.toastr.onError()
    )
    
    this.tenderService.getDataTender(10, "all")
    .subscribe(({data} : any) => { 
        this.tenderData = data.map(yard => ({...yard, hover : false}));
        this.getDataProjectSummary();
      },
      () => this.toastr.onError()
    );
  }

  getDataProjectSummary() {
    this.reportService.getProjectSummary()
    .subscribe(({data} : any) => {
      this.projectSummary = data.map(summary => {
        const {projectTitle, id_proyek : projectId} = this.projectData.find(({id_proyek}) => id_proyek == summary.id_proyek);
        this.projectData = this.projectData.filter(({id_proyek}) => id_proyek != projectId )
        const yard = this.tenderData.find(({id_tender}) => id_tender == summary.id_tender);
        const {nama_galangan, id_tender : tenderId} = yard;
        // this.tenderData = this.tenderData.filter(({id_tender}) => id_tender != tenderId)
        return {...summary, projectTitle, yard, nama_galangan, hover : false}
      })
    },
    () => this.toastr.onError()
    );
  }

  changingValue: Subject<boolean> = new Subject();

  dataTable : any;  
  tableDetails = {style :{ width : '1800px', "max-height" : '300px' }, searchBar : false};
  allColumns = [ 'jobNumber', 'rank', 'jobName', 'department', 'start', 
  'stop', 'volume', 'unit', 'unitPriceContract', 'totalPriceContract', 'category', 'remarks', 'approved', 'edit']; 
  columnType = [ 
    { type : 'number', width : 100 }, 
    { type : 'text', width : 150 }, 
    { type : 'text', width : 150 }, 
    { type : 'text', width : 250 }, 
    { type : 'text', width : 150 }, 
    { type : 'text', width : 200 }, 
    { type : 'text', width : 200 },
    { type : 'text', width : 200 },
    { type : 'text', width : 200 },
    { type : 'text', width : 200 },
    { type : 'text', width : 200 },
    { type : 'text', width : 200 },
    { type : 'text', width : 200 },
    { type : 'text', width : 200 },
  ]
  
  tableHead = [ 
    { type : 'text', placeholder : 'Job Number' },
    { type : 'text', placeholder : 'Rank' },
    { type : 'text', placeholder : 'Job Name' },
    { type : 'text', placeholder : 'Department' },
    { type : 'text', placeholder : 'Start' },
    { type : 'text', placeholder : 'Stop' },
    { type : 'text', placeholder : 'Volume' },
    { type : 'text', placeholder : 'Unit' },
    { type : 'text', placeholder : 'Unit Price Contract' },
    { type : 'text', placeholder : 'Total Price Contract' },
    { type : 'text', placeholder : 'Category' },
    { type : 'text', placeholder : 'Remarks' },
    { type : 'text', placeholder : 'Approval' },
    { type : 'text', placeholder : 'Edit' },
  ]

  handleClickButton(title, data = null) {
    switch(title) {
      case 'Add Yard':
        this.addYardDialog();
      break;
      case 'Show Yard Details':
        this.showYardDetails(data);
      break;
      case 'Generate Table Data':
        this.generateTableDatas(data);
      break;
      case 'Show Contract':
        this.showContract(data);
      break;
      case 'Unselect Yard':
        this.unselectYard(data);
      break;
      case 'Delete Yard':
        this.deleteYardDialog(data);
      break;
      case 'Update Yard':
        this.upudateYardDialog(data);
      break;
      case 'Select Yard':
        this.addNewContract.yard = data;
      break
      case 'Select Project':
        this.addNewContract.project = data;
      break;
      case 'Cancelled Select Yard':
        this.addNewContract = {};
      break;
      case 'Add Contract Document':
        data.click()
      break;
      case 'Select New Contract':
        this.selectNewContract();
      break;
    }
  }

  mouseHover(title, index = 0, conds) {
    switch(title) {
      case 'projectTitle':
        this.projectData[index].hover = conds;
      break;
      case 'nama_galangan':
        this.tenderData[index].hover = conds;
      break;
      case 'activeContract':
        this.projectSummary[index].hover = conds;
      break;
    }
  }
  
  generateTableDatas(data) {
    let {projectTitle = '', id_tender = '', work_area = [], approved = false, proyek, 
    proyek : {work_area : projectWorkArea = []} = ''} = data;

    if(!approved && proyek) work_area = projectWorkArea;

    this.activeProject.projectTitle = projectTitle;
    this.activeProject.id_tender = id_tender;
    this.activeProject.approved = approved;

    if(this.tableFunction.arrayNotEmpty(work_area))
    this.workAreaData = work_area.map(item => { 
      this.allColumns.forEach(column => item?.[column] ? null : item[column] = "");
      return item;
    })

    if(!this.tableFunction.arrayNotEmpty(work_area)) this.workAreaData = [];
    this.dataTable = this.tableFunction.populateData(this.workAreaData, false);
    this.changingValue.next(this.dataTable);
  }

  addYardDialog() {
    this.openDialog({
      dialogData : {
        title : 'Add Yard',
      },
      component : YardDialogComponent 
    })
  }

  upudateYardDialog(data) {
    this.openDialog({
      dialogData : {
        title : 'Update Yard',
        data,
      },
      component : YardDialogComponent 
    })
  }

  deleteYardDialog(data) {
    this.openDialog({
      dialogData : {
        title : 'Delete Yard',
        name : data.nama_galangan,
        id : data.tender
      },
      component : DeleteDialogComponent 
    })
  }

  selectNewContract() {
    const {project : {id_proyek}, yard : {nama_galangan, id_tender}} = this.addNewContract;
    this.openDialog({
      dialogData : {
        title : 'Add New Contract',
        name : nama_galangan,
        id : { id_tender, id_proyek } 
      },
      component : DeleteDialogComponent 
    })
  }

  onFileChange(res){
    const formData = new FormData();
    const file = res.target?.files[0];
    formData.append('dokumen', file);
    this.reportService.addAttachment(formData)
    .subscribe(res => {
      let progress;
      if (res.type === HttpEventType.UploadProgress) {
        progress = Math.round(res.loaded / res.total ) * 100;
        this.toastr.onUpload(`Upload Your File ${progress} %`)
      } else if ( res.type === HttpEventType.Response){
        this.toastr.onSuccess('Your file has been uploaded.')
        const result : any = res;
        const {id_attachment} = result.body.data;
        const data = {...this.addNewContract.yard, id_attachment}
        // this.onUploadData(data, 'Update Yard')
      }
    })
  }
  
  showYardDetails(data) {
    this.openDialog({
      dialogData : {
        title : data.nama_galangan,
        data,
      },
      component : YardDetailsDialog 
    })
  }

  showContract(data) {
    const {yard : {id_attachment}} = data;
    this.reportService.getAttachment(id_attachment)
    .subscribe(data => {
      const file = new Blob([data], { type: 'application/pdf' });            
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    })
  }

  unselectYard(data) {
    this.openDialog({
      dialogData : {
        title : 'Unselect Yard',
        name : data.nama_galangan,
        id : data.id_tender
      },
      component : DeleteDialogComponent 
    })
  }

  openDialog({dialogData, component} : any){
    // if(!this.userAccess) return;
    this.dialogService.open(component, {
      hasBackdrop : true,
      closeOnBackdropClick : false,
      context: {
        dialogData 
      },
    })
    .onClose
    .subscribe(data => {
      if(data) this.onUploadData(data, dialogData.title) 
    });
  }

  onUploadData(data, title) {
    let subscribe;
    let successMsg;
    let errorMsg = 'Please try again.';

    if(title == 'Add New Yard') {
      subscribe = this.tenderService.selectTender(data.id_proyek, data.id_tender)
      successMsg = 'Your Yard has been added.'
    }
    console.log(data)
    return

    subscribe
    .pipe(takeUntil(this.destroy$), take(1))
    .subscribe(
      () => {
        this.toastr.onUpload()
        this.ngOnInit();
      },
      () => this.toastr.onError(errorMsg),
      () => this.toastr.onSuccess(successMsg)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}





// displayTender
// renderYard(tender){
//   const {general_diskon_persen, additional_diskon, nama_galangan, sum_internal_adjusment} = tender
//   this.displayTender = tender
//   this.displayTender.responsible = this.responsible.find(resp => resp.id_user == tender.id_user)
//   const {offHire, offHireCost, ownerCost} = this.currentProject
//   this.dataTable = {
//     'Yard' : nama_galangan,
//     'Currency': this.usedCurrency,
//     'Offhire Repair Period (In Dock)': offHire,
//     'Offhire Cost': this.currency.transform(offHireCost, this.FNCOL.convertCurrency(this.usedCurrency)),
//     'Owner Cost': this.currency.transform(ownerCost, this.FNCOL.convertCurrency(this.usedCurrency)),
//     'Owner Total Cost': this.currency.transform(offHireCost + ownerCost, this.FNCOL.convertCurrency(this.usedCurrency)),
//     'Sum Internal Adjusment': this.currency.transform(sum_internal_adjusment, this.FNCOL.convertCurrency(this.usedCurrency)), 
//     'General Discount': `(${general_diskon_persen} %) ${this.currency.transform(general_diskon_persen * (offHireCost + ownerCost) / 100, this.FNCOL.convertCurrency(this.usedCurrency))}`,
//     'Additional Discount': `(${additional_diskon} %) ${this.currency.transform(additional_diskon * (offHireCost + ownerCost) / 100, this.FNCOL.convertCurrency(this.usedCurrency))}`,
//   }
// }


// approveByRank(id) {
//   const tenderApproval = {tenderApproval : true}
//   // this.workAreaContainer.forEach(work => {
//   //   if(id == 0) this.approvedData([work], tenderApproval)
//   //   if(id != 0 && id - 1 == work.rank) this.approvedData([work], tenderApproval)
//   // })
//   // this.updateWorkApproval(this.workAreaContainer)
// }

// approvedByYard(newData){
//   const tenderApproval = {tenderApproval : true}
//   this.approvedData(newData, tenderApproval)
//   // this.updateWorkApproval(this.workAreaContainer)
// }

// approvedData(newData, approve) {
//   newData.map(work => {
//     const postData = { ...work, ...approve}
//     // this.workAreaContainer = this.FNCOL.updateWorkAreaData(this.workAreaContainer, work.id, postData)
//     if(work?.items?.length) this.approvedData(work.items, approve) 
//   })
// }

// updateWorkApproval(work_area){
//   this.projectService.workArea({work_area}, this.currentProject.projectId)
//   .pipe(take(1))
//   .subscribe(({status} : any) => {
//     this.ngOnInit()
//     setTimeout(() => {
//       // this.getProject(this.currentProject)
//     }, 1000);
//   })
// }