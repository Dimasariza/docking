import { DatePipe } from '@angular/common';
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
              private datePipe : DatePipe
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

  columnHead = ['Tasks', 'Project/Asset', 'Customer', 'Status', 'Responsible', 'Due'];
  columnContents = ['jobName', 'project', 'cust', 'status', 'resp', 'due']
  allColumns = [ 'icon', ...this.columnContents]
  dataSource: NbTreeGridDataSource<FSEntry>;
  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  projectDatas : any
  workAreaContainer : any = []
  shipManagement : string
  responsible : any = []
  status : any = ['Not Started', 'Done', 'In Progress', 'Done']

  ngOnInit() {
    this.projectService.getDataProjects()
      .subscribe(({data} : any) => {
        if(!data.length || data === null) return;
        this.projectDatas = data
        this.collectData()
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

  collectData(){
    this.projectDatas.map((work, id) => {
      this.projectDatas[id].phase = this.phaseStatus(this.projectDatas[id].phase)
      const {work_area} = work
      if(!work_area || work_area[0] === null) return; 
      const projectJob = work_area.map(project => ({
        ...project,
        project : `${work.kapal.nama_kapal} -DD- ${work.tahun}`
      }))
      this.workAreaContainer.push(...projectJob)
    }) 
  }

  populateData = (data) => {
    const {items, responsible, end} = data
    return {
      data : {
        cust : this.shipManagement,
        resp : responsible.name,
        kind: items?.length ? 'dir' : 'doc',
        due : this.datePipe.transform(end, 'yyyy-MM-dd'),
        ...data,
      },
      children : items?.length ? items.map(item => this.populateData(item)) : []
    }
  }

  phaseStatus(data){
    switch (data){
      case 'requisition' :
        data = [true, false, false, false]
      break;
      case 'in_progress' :
        data = [true, true, false, false]
      break;
      case 'evaluasi' :
        data = [true, true, true, false]
      break;
      case 'finish' :
        data = [true, true, true, true]
      break;
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
}



