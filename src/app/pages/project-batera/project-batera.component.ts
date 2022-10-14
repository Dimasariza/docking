import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource } from '@nebular/theme';
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
              private profileService : ProfileBateraService
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

  allColumns = ['Tasks', 'Project/Asset', 'Customer', 'Status', 'Responsible', 'Due'];
  dataSource: NbTreeGridDataSource<FSEntry>;
  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;
  allProjectDatas : any
  shipManagement : string
  
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

  ngOnInit() {
    this.projectService.getDataProjects()
      .subscribe(({data} : any) => {
        this.allProjectDatas = data
        this.allProjectDatas.length ? 
        this.allProjectDatas.map((item, index) => {
          this.allProjectDatas[index].phase = 
          this.phaseStatus(this.allProjectDatas[index].phase)
        }) : null
    });

    this.profileService.getCompanyProfile()
    .subscribe(({data} : any) => {
      this.shipManagement = data.profile_merk_perusahaan
    })
  }

  
  populateData = (data) => {
    const {end, items, jobName, status, responsible} = data
    return {
      data : {
        Tasks : jobName,
        // "Project/Asset" : nama_kapal,
        // Customer : customer,
        Status : status,
        Responsible : responsible.name,
        Due : end,
        kind: items?.length ? 'dir' : 'doc'
      },
      children : items?.length ? items.map(item => this.populateData(item)) : []
    }
  }

  deleteProject(row){
    console.log(row)
    // let id_proyek = this.allProjectDatas[row].id_proyek
    // this.service.deleteProject(id_proyek)
  }

}



