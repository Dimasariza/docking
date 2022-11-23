import { CurrencyPipe, DatePipe, KeyValue } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { ProjectBateraService } from '../project-batera.service';
import { MatDialog } from '@angular/material/dialog';
import { WorkAreaComponent } from '../work-area/work-area.component';
import { ProjectDataComponent } from '../project-data/project-data.component';
import { DeleteDialogComponent } from '../../home-batera/delete-dialog/delete-dialog.component';
import { FunctionCollection } from '../../function-collection-batera/function-collection.component';
import { TenderBateraService } from '../../tender-batera/tender-batera.service';
import { TableDataComponent } from './table-data/table-data.component';

interface TreeNode<T> {}
interface FSEntry {}

const menuButton = [
  {
    position: 'top',
    icon: 'compass-outline',
    text: 'Monitoring',
    disabled : ''
  },
  {
    position: 'bottom',
    text : 'Add Job',
  },
  {
    position: 'bottom',
    text : 'Expand All'
  },
  {
    position: 'bottom',
    text : 'Refresh'
  },
  {
    position: 'bottom',
    text: 'Show Contract'
  }
]

@Component({
  selector: 'ngx-sub-menu-project',
  templateUrl: './sub-menu-project.component.html',
  styleUrls : ['../../home-batera/home.component.scss']
})

export class SubMenuProjectComponent implements OnInit {
  public menuButton = menuButton
  constructor(  private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>,
                private route: ActivatedRoute,
                private dialog : MatDialog,
                private router : Router,
                private projectService : ProjectBateraService,
                private tenderService : TenderBateraService,
                public currency : CurrencyPipe,
                public convertDate : DatePipe,
                public FNCOL : FunctionCollection,
  ) { }

  shipName 
  id_proyek : any
  projectData : any
  reportData : any
  progressData : any
  alertConds 

  isFalsy = v => !v

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')
    this.id_proyek = id
    this.projectService.getSubProjectData(id)
    .subscribe(({data} : any) => {
      this.reportData = this.reconstruction(data)
      this.projectData = data
      const {work_area, kapal : {nama_kapal}, tahun, status} = data
      this.shipName = `${nama_kapal} -DD- ${tahun} ${this.FNCOL.convertStatus(status)}`
      if(this.isFalsy(!work_area || !work_area[0])) 
      this.regroupData(false)
    })

    this.tenderService.getProjectSummary()
    .subscribe(({data} : any) => {
      this.progressData = data.find(t => t.id_proyek == parseInt(this.id_proyek))
      menuButton[0].disabled = this.progressData
    })
  }

  regroupData(expand){
    const {work_area, mata_uang} = this.projectData
    this.dataSource = this.dataSourceBuilder.create(work_area.map(work => {
      const workItem = [mata_uang, 'Price Budget']
      return this.FNCOL.populateData(work, workItem, expand) 
    }) as TreeNode<FSEntry>[])
  }

  orderOriginal = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
    return 0
  }
  objectKeys = Object.keys;

  reconstruction(data){
    const { kapal, phase, mata_uang, off_hire_period, off_hire_deviasi, off_hire_rate_per_day, off_hire_bunker_per_day, repair_in_dock_period, repair_additional_day,
      off_hire_start, off_hire_end , repair_start, repair_end, repair_in_dock_start, repair_in_dock_end, repair_period} = data
    const convertDate = (date, amount) => {
      date = new Date(date)
      date.setDate(date.getDate() + amount)
      return this.convertDate.transform(date, 'dd-MM-yyyy') 
    }
    return {
        "Vessel": kapal.nama_kapal,
        "Phase": this.FNCOL.convertPhase(phase),
        "Base Currency":  mata_uang,
        "Off Hire Period": `(${off_hire_period + off_hire_deviasi} Days) ${convertDate(off_hire_start, 0)} to ${convertDate(off_hire_end, off_hire_deviasi)}`  ,
        "- Deviation": `${off_hire_deviasi} Days`,
        "- Charter Rate": this.currency.transform(off_hire_rate_per_day, this.FNCOL.convertCurrency(mata_uang)) ,
        "- Bunker":  this.currency.transform(off_hire_bunker_per_day, this.FNCOL.convertCurrency(mata_uang)) , 
        "Repair Period": `(${repair_period + repair_additional_day} Days) ${convertDate(repair_start, 0)} to ${convertDate(repair_end, repair_additional_day)}`,
        "- In Dock": `(${repair_in_dock_period} Days) ${convertDate(repair_in_dock_start, 0)} to ${convertDate(repair_in_dock_end, 0)}`,
        "- Additional Days":  `${repair_additional_day} Days` 
    }
  }


  @ViewChild(TableDataComponent) tableData : TableDataComponent

  headColumns = ['Job', 'Departement', 'Start', 'Stop', 'Vol', 'Unit', 'Unit Price Budget', 'Total Price Budget', 'Category', 'Remarks']
  defaultColumns = ['jobName', 'departement', 'Start', 'Stop', 'volume', 'Unit', 'Unit Price Budget','Total Price Budget', 'Category', 'remarks'];
  allColumns = [ 'jobNumber', 'rank', ...this.defaultColumns, 'responsible', 'action']
  dataSource: NbTreeGridDataSource<FSEntry>; 
  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  updateSort(sortRequest: NbSortRequest): void {
    this.sortColumn = sortRequest.column;
    this.sortDirection = sortRequest.direction;
  }

  getSortDirection(column: string): NbSortDirection {
    if (this.sortColumn === column) {
      return this.sortDirection;
    }
    return NbSortDirection.NONE;
  }

  getShowOn(index: number) {
    const minWithForMultipleColumns = 400;
    const nextColumnStep = 100;
    return minWithForMultipleColumns + (nextColumnStep * index);
  }

  buttonAction(e, data){
    let reloadPage ;
    switch(e) {
      case 'Add Job':
        this.addWorkAreaDial();
      break;
      case 'Expand All' :
        menuButton[2].text = "Unexpand";
        this.regroupData(true);
      break;
      case 'Unexpand' :
        menuButton[2].text = "Expand All";
        this.regroupData(false);
      break;
      case 'Monitoring' :
        this.router.navigateByUrl('/pages/report-batera/' + this.id_proyek);
      break;
      case 'update project' :
        reloadPage = this.updateProjectDial();
      break;
      case 'add sub job' :
        reloadPage = this.addSubJobDial(data);
      break;
      case 'update job' :
        reloadPage = this.updateWorkAreaDial(data);
      break;
      case 'delete job':
        reloadPage = this.deleteJob(data);
      break;
      case 'Refresh' :
        this.ngOnInit();
      break;
    }
  }

  updateProjectDial(){
    const dialog = this.dialog.open(ProjectDataComponent, {
      disableClose : true,
      autoFocus:true, 
      data : {
        dial : "Update",
        project : this.projectData,
      }
    })  
    this.reload(dialog) 
  }

  addWorkAreaDial(){
    const dialog = this.dialog.open(WorkAreaComponent, {
      disableClose : true,
      autoFocus:true, 
      data : {
        dial : "Add",
        id : this.id_proyek,
        work : this.projectData
      }
    }) 
    dialog.componentInstance.onSuccess.asObservable()
    .subscribe(() => {
      this.ngOnInit()
      this.tableData.ngOnInit();
      const msg = 'The job has been added'
      this.alertStatus('success', msg)
    })
  }
  
  addSubJobDial(row){    
    const dialog = this.dialog.open(WorkAreaComponent, {
      disableClose : true,
      autoFocus: true,
      data: {
        dial : "Add Sub",
        id : this.id_proyek,
        data : row,
        work : this.projectData
      }
    })
    dialog.componentInstance.onSuccess.asObservable()
    .subscribe(() => {
      this.ngOnInit()
      this.tableData.ngOnInit();
      const msg = 'The job has been added';
      this.alertStatus('success', msg)
    })
    // this.reload(dialog) 
  }

  updateWorkAreaDial(row){
    const dialog = this.dialog.open(WorkAreaComponent, {
      disableClose : true,
      autoFocus: true,
      data : {
        dial : "Update",
        id : this.id_proyek,
        data : row,
        work : this.projectData
      }});
    this.reload(dialog) 
  };

  deleteJob(row) {
    const dialog = this.dialog.open(DeleteDialogComponent, {
      disableClose : true,
      autoFocus: true,
      data : {
        dial : "job",
        id : this.id_proyek,
        work_area : this.projectData.work_area,
        parentId : row.data.id
      }});
    this.reload(dialog) 
  }

  alertStatus (status, msg) {
    setTimeout(() => {
      this.alertConds = {status, msg, conds : true}
    }, 1000);
    setTimeout(() => {
      this.alertConds = {status, msg, conds : false}
    }, 5000);
  }

  reload(reloadPage) {
    reloadPage.componentInstance.onSuccess.asObservable().subscribe(() => {
      this.ngOnInit()
      this.tableData.ngOnInit();
    })
  }
}



