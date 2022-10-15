import { KeyValue } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { ProjectBateraService } from '../project-batera.service';
import { MatDialog } from '@angular/material/dialog';
import { WorkAreaComponent } from '../work-area/work-area.component';
import { ProfileBateraService } from '../../profile-batera/profil-batera.service';
import { ProjectDataComponent } from '../project-data/project-data.component';

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
                public dialog : MatDialog,
                private router : Router,
                private projectService : ProjectBateraService) {
  }

  shipName 
  work_area: any
  id_proyek : any
  projectData : any
  reportData : any

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')
    this.id_proyek = id
    this.projectService.getSubProjectData(id)
    .subscribe(({data} : any) => {
      this.reportData = this.reportDataDestruction(data)
      this.projectData = data
      const {work_area, kapal} = data
      this.work_area = work_area
      this.shipName = kapal.nama_kapal + " -DD- " + data.tahun
      work_area === null || 
      work_area[0] === null ||
      work_area === undefined ||
      work_area.length === 0 ? null : 
      this.dataSource = this.dataSourceBuilder.create(work_area.map(work =>
      this.populateData(work)) as TreeNode<FSEntry>[]) 
    })

    this.profileService.getUserData(1, 10, '', '', '')
    .subscribe(({data} : any) => {
      const resp = data.map(user => user.username)
    })
  }

  reportDataDestruction(data){
    const { kapal, phase, selected_yard, mata_uang, off_hire_period, off_hire_deviasi, off_hire_rate_per_day, off_hire_bunker_per_day, repair_period, repair_in_dock_period, repair_additional_day } = data
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

  
  orderOriginal = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
    return 0
  }
  objectKeys = Object.keys;
  priceHeadData = [
    'Totals', 'Budget', 'Contract', 'Actual'  
  ]

  priceData = {
    'Offhire Days' : {
      type : 'title',
      Budget: 20,
      Contract: '_',
      Actual: 0,
    },
    'Owner Exp': {
      type : 'title',
      Budget: '1.412.000.000',
      Contract: '1.412.000.000',
      Actual: 0,
    },
    Supplies: {
      type : 'subTitle',
      Budget: '877.000.000',
      Contract: '877.000.000',
      Actual: 0,
    },
    Services: {
      type : 'subTitle',
      Budget: '350.000.000',
      Contract: '350.000.000',
      Actual: 0,
    },
    Class: {
      type : 'subTitle',
      Budget: 0,
      Contract: 0,
      Actual: 0,
    },
    Other: {
      type : 'subTitle',
      Budget: '185.000.000',
      Contract: '185.000.000',
      Actual: 0,
    },
    'Owner Canceled Jobs': {
      type : 'highlight',
      Budget: '_',
      Contract: 0,
      Actual: '_',
    },
    'Yard Cost': {
      type : 'title',
      Budget: '5.056.566.061',
      Contract: '4.541.787.983',
      Actual: 0,
    },
    'Yard Canceled Jobs' : {
      type : 'highlight',
      Budget: '_',
      Contract: 0,
      Actual: '_',
    },
    'Total Cost' : {
      type : 'title',
      Budget: '6.468.566.061',
      Contract: '5.953.787.983',
      Actual: 0,
    }
  } 
  
  rankColor(rank){
    let rankStatus 
    switch (rank){
      case "Critical" :
        rankStatus = "maroon"
      break
      case "High" :
        rankStatus = "red"
      break
      case "Medium" :
        rankStatus = "yellow"
      break
      case "Low":
        rankStatus = "green"
      break
      default :
        rankStatus = "grey"
      break
    }
    return rankStatus
  }

  defaultColumns = ['Job', 'Dept', 'Start', 'Stop', 'Vol', 'Unit', 'Unit Price Budget','Total Price Budget', 'Category', 'Remarks'];
  allColumns = [ 'Job No', 'rank', ...this.defaultColumns, 'Resp', 'action']
  dataSource: NbTreeGridDataSource<FSEntry>; 
  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;
  @Output() reloadPage = new EventEmitter<string>();


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

  populateData = (work) => {  
    const {items, jobNumber, jobName, start, end, departement, volume, unitPrice , remarks, id, unit, responsible, category } = work  
    return {
      data: {
        "Job No": jobNumber,
        "Job": jobName,
        "Dept": departement,
        "Resp" : responsible,
        "Start": start,
        "Stop": end,
        "Vol" : volume,
        "Unit" : unit.name,
        "Unit Price Budget": work['Price Budget'],
        "Total Price Budget" : volume * work['Price Budget'],
        "Category" : category.name,
        "Remarks" : remarks,
        "id" : id,
        "kind" : items?.length ? 'dir' : 'doc',
        ...work,
      },
      children: 
      work === null ||
      work === undefined ? console.log(true) :
      items?.length ? items.map(child => this.populateData(child)) : []
    }
  }

  btnAct(e){
    switch(e) {
      case 'Add Job':
        this.addWorkAreaDial()
      break;
      case 'Expand All' :
        console.log("expand")
      break;
      case 'Monitoring' :
        this.navigateTo(this.id_proyek)
        
      break;
      case 'Refresh' :
        this.ngOnInit()
      break;
    }
  }

  navigateTo(id){
    this.router.navigateByUrl('/pages/report-batera/' + id)
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
    dialog.componentInstance.onSuccess.asObservable().subscribe(() => {
      this.ngOnInit()
    })
  }

  subJobDial(row){    
    const dialog = this.dialog.open(WorkAreaComponent, {
      disableClose : true,
      autoFocus: true,
      data: {
        dial : "Add Sub",
        data : row,
        id : this.id_proyek,
        parentId : row.data.id
      }
    })
    dialog.componentInstance.onSuccess.asObservable().subscribe(() => {
      this.ngOnInit()
    })
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
    dialog.componentInstance.onSuccess.asObservable().subscribe(() => {
      this.ngOnInit()
    })
  }

  updateWorkAreaDial(row){
    const dialog = this.dialog.open(WorkAreaComponent, {
      disableClose : true,
      autoFocus: true,
      data : {
        dial : "Update",
        data : row,
        id : this.id_proyek,
        parentId : row.data.id
      }});
    dialog.componentInstance.onSuccess.asObservable().subscribe(() => {
      this.ngOnInit()
    });
  };

  reconstructData = (data, parentIndex) => {
    return data.map((w, i) => {
      if (parentIndex.length > 1 && i == parentIndex[0]) {
        parentIndex = parentIndex.slice(1)
        return {...w, items: this.reconstructData(w.items, parentIndex)}
      } else if(i == parentIndex[0]) {
        return null
      }
      return w
    })
    .filter(f => f != null)
  }

  delete(id: string) {
    let parentIndex = id.toString().split('')
    const work_area = this.reconstructData(this.work_area, parentIndex)
    let postBody
    work_area.length === 0 ||
    work_area === undefined ? postBody = {work_area : [null]} : postBody = {work_area : work_area}
    this.projectService.addProjectJob(postBody, this.id_proyek)
    .subscribe(() => {
      this.dataSource = this.dataSourceBuilder.create(work_area.map(work => 
        this.populateData(work)) as TreeNode<FSEntry>[])
    })
  }
}



