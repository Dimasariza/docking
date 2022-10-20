import { DatePipe, KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { ProjectBateraService } from '../project-batera.service';
import { MatDialog } from '@angular/material/dialog';
import { WorkAreaComponent } from '../work-area/work-area.component';
import { ProfileBateraService } from '../../profile-batera/profil-batera.service';
import { ProjectDataComponent } from '../project-data/project-data.component';
import { DeleteDialogComponent } from '../../home-batera/delete-dialog/delete-dialog.component';
import { FunctionCollection } from '../../function-collection-batera/function-collection.component';

interface TreeNode<T> {}
interface FSEntry {}

const menuButton = [
  {
    position: 'top',
    icon: 'compass-outline',
    text: 'Monitoring'
  },
  {
    position: 'top',
    icon: 'file-outline',
    text: 'Export To PDF'
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
                private profileService : ProfileBateraService,
                private route: ActivatedRoute,
                private dialog : MatDialog,
                private router : Router,
                private datePipe : DatePipe,
                private projectService : ProjectBateraService,
                public FNCOL : FunctionCollection,
  ) { }

  shipName 
  id_proyek : any
  projectData : any
  reportData : any

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

      this.dataSource = this.dataSourceBuilder.create(work_area.map(work => {
        const {volume} = work  
        const workItem = {
          "Total Price Budget" : volume * work['Price Budget'],
        }
        return this.FNCOL.populateData(work, workItem) 
      }) as TreeNode<FSEntry>[] 
    )})
  }

  orderOriginal = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
    return 0
  }
  objectKeys = Object.keys;

  reconstruction(data){
    const { kapal, phase, selected_yard, mata_uang, off_hire_period, off_hire_deviasi, off_hire_rate_per_day, off_hire_bunker_per_day, repair_in_dock_period, repair_additional_day } = data
    return {
        "Vessel": {
          type : 'text',
          value : kapal.nama_kapal
        },
        "Phase": {
          type : 'text',
          value: phase
        },
        "Selected Yard": {
          type : 'text',
          value : selected_yard
        },
        "Base Currency": {
          type : 'text',
          value : mata_uang
        },
        "Off Hire Period": {
          type : 'text',
          value: off_hire_period
        },
        "- Deviation": {
          type : 'date',
          value: off_hire_deviasi
        },
        "- Charter Rate": {
          type : 'text',
          value: off_hire_rate_per_day
        } ,
        "- Bunker": {
          type : 'text',
          value : off_hire_bunker_per_day
        }, 
        "Repair Period": {
          type: 'text',
          value : off_hire_period
        },
        "- In Dock": {
          type : 'text',
          value : repair_in_dock_period
        },
        "- Additional Days": {
          type : 'date',
          value : repair_additional_day 
        } 
    }
  }

  headColumns = ['Job', 'Departement', 'Start', 'Stop', 'Vol', 'Unit', 'Unit Price Budget', 'Total Price Budget', 'Category', 'Remarks']
  defaultColumns = ['jobName', 'departement', 'Start', 'Stop', 'volume', 'Unit', 'Price Budget','Total Price Budget', 'Category', 'remarks'];
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
        reloadPage = this.addWorkAreaDial()
      break;
      case 'Expand All' :
        console.log("expand")
      break;
      case 'Monitoring' :
        this.router.navigateByUrl('/pages/report-batera/' + this.id_proyek)
      break;
      case 'update project' :
        reloadPage = this.updateProjectDial()
      break;
      case 'add sub job' :
        reloadPage = this.addSubJobDial(data)
      break;
      case 'update job' :
        reloadPage = this.updateWorkAreaDial(data)
      break;
      case 'delete job':
        reloadPage = this.deleteJob(data)
      break;
      case 'Refresh' :
        this.ngOnInit()
      break;
    }
    reloadPage.componentInstance.onSuccess.asObservable().subscribe(() => {
      this.ngOnInit()
    })
  }

  updateProjectDial(){
    const dialog = this.dialog.open(ProjectDataComponent, {
      disableClose : true,
      autoFocus:true, 
      data : {
        dial : "Update",
        project : this.projectData  
      }
    })  
    return dialog
  }

  addWorkAreaDial(){
    const dialog = this.dialog.open(WorkAreaComponent, {
      disableClose : true,
      autoFocus:true, 
      data : {
        dial : "Add",
        id : this.id_proyek
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
        parentId : row.data.id,
        id : this.id_proyek,
        data : row,
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
        parentId : row.data.id,
        id : this.id_proyek,
        data : row,
      }});
    return dialog
  };

  deleteJob(row) {
    const dialog = this.dialog.open(DeleteDialogComponent, {
      disableClose : true,
      autoFocus: true,
      data : {
        dial : "job",
        parentId : row.data.id,
        id : this.id_proyek,
        work_area : this.projectData.work_area,
      }});
    return dialog
  }
}



