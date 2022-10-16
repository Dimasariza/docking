import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { DeleteDialogComponent } from '../home-batera/delete-dialog/delete-dialog.component';
import { ProfileBateraService } from '../profile-batera/profil-batera.service';
import { ProjectBateraService } from './project-batera.service';
import { ProjectDataComponent } from './project-data/project-data.component';
import { SubMenuProjectComponent } from './sub-menu-project/sub-menu-project.component';

interface TreeNode<T> {}
interface FSEntry {}

@Component({
  providers : [SubMenuProjectComponent],
  selector: 'ngx-project-batera',
  templateUrl: './project-batera.component.html',
})
export class ProjectBateraComponent {
  constructor(private dialog : MatDialog,
              private projectService:ProjectBateraService,
              private subMenuProject : SubMenuProjectComponent,
              private profileService : ProfileBateraService,
              private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>,
    ) {
  }

  updateSort(sortRequest: NbSortRequest): void {
    return this.subMenuProject.updateSort(sortRequest)
  }

  getSortDirection(column: string): NbSortDirection {
    return this.subMenuProject.getSortDirection(column)
  }
  
  getShowOn(index: number) {
    return this.subMenuProject.getShowOn(index)
  }

  columnContents = ['jobName', 'project', 'cust', 'status', 'resp', 'end']
  allColumns = [ 'icon', ...this.columnContents]
  columnHead = ['Tasks', 'Project/Asset', 'Customer', 'Status', 'Responsible', 'Due'];
  dataSource: NbTreeGridDataSource<FSEntry>;
  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  allProjectDatas : any
  workAreaContainer : any
  shipManagement : string
  responsible : any = []
  status : any = ['Not Started', 'Done', 'In Progress', 'Done']

  ngOnInit() {
    this.projectService.getDataProjects()
      .subscribe(({data} : any) => {
        this.allProjectDatas = data

        this.allProjectDatas.length ||
        this.allProjectDatas !== null ||
        this.allProjectDatas[0] !== null ? 
        (() => {
          this.allProjectDatas.map((i, index) => {
            this.allProjectDatas[index].phase = 
            this.phaseStatus(this.allProjectDatas[index].phase)
          }) 

          let work_area = []
          data.map((work, id) => {
            work_area.push(...work.work_area)
            work_area[work_area.length-1]['project'] = `${work.kapal.nama_kapal} -DD- ${work.tahun}`
          })
          this.workAreaContainer = work_area
        })() : null
        this.dataSource = this.dataSourceBuilder.create(this.workAreaContainer.map(work =>
        this.populateData(work)) as TreeNode<FSEntry>[]) 
    });

    this.profileService.getCompanyProfile()
    .subscribe(({data} : any) => {
      this.shipManagement = data.profile_merk_perusahaan
    })

    this.profileService.getUserData(1, 10,'', '', '')
    .subscribe(({data} : any) => this.responsible = data)
  }

  populateData = (data) => {
    const {items, responsible} = data
    return {
      data : {
        ...data,
        cust : this.shipManagement,
        resp : responsible.name,
        kind: items?.length ? 'dir' : 'doc'
      },
      children : items?.length ? items.map(item => this.populateData(item)) : []
    }
  }

  phaseStatus(data){
    if(data === "requisition"){
      data = [true, false, false, false]
    }
    if(data === "in_progress"){
      data = [true, true, false, false]
    }
    if(data === "evaluasi"){
      data = [true, true, true, false]
    }
    if(data === "finish"){
      data = [true, true, true, true]
    }
    return data
  }

  addProjectDial(){
    const dialog = this.dialog.open(ProjectDataComponent, { 
      disableClose : true,
      autoFocus : true,
      data : {
        dial : "Add",
        ship : this.shipManagement
      }
    });
    dialog.componentInstance.onSuccess.asObservable().subscribe(() => {
      this.ngOnInit()
    });
  }

  deleteProject(row){
    const dialog = this.dialog.open(DeleteDialogComponent, { 
      disableClose : true,
      autoFocus : true,
      data : {
        dial : "project",
        id : row.id_proyek
      }
    });
    dialog.componentInstance.onSuccess.asObservable().subscribe(() => {
      this.ngOnInit()
    });

  }

  succesFunction(){

  }
}



