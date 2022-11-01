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
import { take } from 'rxjs/operators';
import { TrackingBateraService } from '../../tracking-batera/tracking-batera.service';
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

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')
    this.id_proyek = id
    this.projectService.getSubProjectData(id)
    .subscribe(({data} : any) => {
      this.reportData = this.reconstruction(data)
      this.projectData = data
      const {work_area, kapal, tahun} = data
      this.shipName = kapal.nama_kapal + " -DD- " + tahun
      work_area === null || 
      work_area[0] === null ||
      work_area === undefined ||
      work_area.length === 0 ? null : 
      this.regroupData(false)
    })

    this.tenderService.getProjectSummary("", "", "", "")
    .subscribe(({data} : any) => {
      this.progressData = data.find(tender => tender.id_proyek === parseInt(this.id_proyek))
      menuButton[0].disabled = this.progressData
    })
  }

  regroupData(expand){
    const {work_area, kapal, tahun, mata_uang} = this.projectData
    this.dataSource = this.dataSourceBuilder.create(work_area.map(work => {
      const {volume, 'Price Budget' : budgetPrice} = work 
      const currency = mata_uang
      const workItem = {
        'Unit Price Budget' : this.currency.transform(budgetPrice, this.FNCOL.convertCurrency(currency)),
        'Total Price Budget' : this.currency.transform(budgetPrice * volume, this.FNCOL.convertCurrency(currency)),
      }
      return this.FNCOL.populateData(work, workItem, expand) 
    }) as TreeNode<FSEntry>[])
  }

  orderOriginal = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
    return 0
  }
  objectKeys = Object.keys;

  reconstruction(data){
    const { kapal, phase, selected_yard, mata_uang, off_hire_period, off_hire_deviasi, off_hire_rate_per_day, off_hire_bunker_per_day, repair_in_dock_period, repair_additional_day,
      off_hire_start, off_hire_end , repair_start, repair_end, repair_in_dock_start, repair_in_dock_end, repair_period} = data
    const convertDate = (date, amount) => {
      date = new Date(date)
      date.setDate(date.getDate() + amount)
      return this.convertDate.transform(date, 'dd-MM-yyyy') 
    }
    return {
        "Vessel": {
          type : 'text',
          value : kapal.nama_kapal
        },
        "Phase": {
          type : 'text',
          value: this.FNCOL.convertPhase(phase) 
        },
        // "Selected Yard": {
        //   type : 'text',
        //   value : selected_yard
        // },
        "Base Currency": {
          type : 'text',
          value : mata_uang
        },
        "Off Hire Period": {
          type : 'text',
          value: `(${off_hire_period + off_hire_deviasi} Days) ${convertDate(off_hire_start, 0)} to ${convertDate(off_hire_end, off_hire_deviasi)}`  
        },
        "- Deviation": {
          type : 'date',
          value: off_hire_deviasi
        },
        "- Charter Rate": {
          type : 'text',
          value: this.currency.transform(off_hire_rate_per_day, this.FNCOL.convertCurrency(mata_uang)) 
        } ,
        "- Bunker": {
          type : 'text',
          value: this.currency.transform(off_hire_bunker_per_day, this.FNCOL.convertCurrency(mata_uang)) 
        }, 
        "Repair Period": {
          type: 'text',
          value : `(${repair_period + repair_additional_day} Days) ${convertDate(repair_start, 0)} to ${convertDate(repair_end, repair_additional_day)}`
        },
        "- In Dock": {
          type : 'text',
          value : `(${repair_in_dock_period} Days) ${convertDate(repair_in_dock_start, 0)} to ${convertDate(repair_in_dock_end, 0)}`
        },
        "- Additional Days": {
          type : 'date',
          value : repair_additional_day 
        } 
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
    const reload = () => {
      return reloadPage.componentInstance.onSuccess.asObservable().subscribe(() => {
        this.ngOnInit()
      })
    }
    switch(e) {
      case 'Add Job':
        reloadPage = this.addWorkAreaDial();
        reload();
        this.tableData.ngOnInit();
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
        reload();
        this.tableData.ngOnInit();
      break;
      case 'add sub job' :
        reloadPage = this.addSubJobDial(data);
        reload();
        this.tableData.ngOnInit();
      break;
      case 'update job' :
        reloadPage = this.updateWorkAreaDial(data);
        reload();
        this.tableData.ngOnInit();
      break;
      case 'delete job':
        reloadPage = this.deleteJob(data);
        reload();
        this.tableData.ngOnInit();
      break;
      case 'Refresh' :
        this.ngOnInit();
        this.tableData.ngOnInit();
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
    return dialog
  }

  addWorkAreaDial(){
    console.log(this.projectData)
    const dialog = this.dialog.open(WorkAreaComponent, {
      disableClose : true,
      autoFocus:true, 
      data : {
        dial : "Add",
        id : this.id_proyek,
        work : this.projectData
      }
    }) 
    return dialog   
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
    return dialog
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
    return dialog
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
    return dialog
  }
}



