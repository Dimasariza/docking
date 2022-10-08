import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { HomeBateraService } from '../home-batera/home-batera.service';
import { ProfileBateraService } from '../profile-batera/profil-batera.service';
import { TrackingBateraService } from '../tracking-batera/tracking-batera.service';
import { AddNewProjectComponent } from './add-new-project/add-new-project.component';
import { ProjectBateraService } from './project-batera.service';

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface FSEntry {
  Tasks: string;
  'Project/Asset'?: string;
  Status?:string;
  Customer?: string;
  kind: string;
  Responsible?: string;
  Due?: string
}

@Component({
  selector: 'ngx-project-batera',
  templateUrl: './project-batera.component.html',
})
export class ProjectBateraComponent {
  public allProjectDatas : any

  customColumn = 'Tasks';
  defaultColumns = [ 'Project/Asset', 'Customer', 'Status', 'Responsible', 'Due'];
  allColumns = [ this.customColumn, ...this.defaultColumns ];

  dataSource: NbTreeGridDataSource<FSEntry>;

  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  constructor(
    public dialog : MatDialog,
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>,
    private service:ProjectBateraService,
    private trackingBatera : TrackingBateraService,
    private homeService : HomeBateraService,
    private profileService : ProfileBateraService
    ) {
  }

  addProjectDial(){
    const dialog = this.dialog.open(AddNewProjectComponent, { 
      disableClose : true,
      autoFocus : true,
      data : this.id_user
    })

    dialog.componentInstance.onSuccess.asObservable().subscribe(() => {
      this.ngOnInit()
    })
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

  public id_user
  ngOnInit() {
    this.profileService.getCompanyProfile()
    .subscribe(({data}: any) => {
      let companyData = data.profile_merk_perusahaan
      this.allProjectDatas.map((data, value) => {
        this.allProjectDatas[value].shipManagement = companyData
      })
      console.log(this.allProjectDatas)
    })

    this.homeService.getUserLogin()
    .subscribe(({data} : any) => {
      this.id_user = data.id_user
    })

    this.service.getDataProjects()
      .subscribe(({data} : any) => {
        this.allProjectDatas = data
        this.allProjectDatas.map((item, index) => {
          this.allProjectDatas[index].phase = 
          this.phaseStatus(this.allProjectDatas[index].phase)
        })
        console.log(this.allProjectDatas)
    });

    this.trackingBatera.getDataTracking()
    .subscribe(({data} : any) => {
      let itemDate = data
      .map((item, value) => { 
        return {
          update: item.updated_at, 
          id : value
        }
      })
      .sort((date1, date2) => {
        new Date(date1.update).getTime() - new Date(date2.update).getTime()
      })
    
    let tasksData = data[itemDate[0].id]
    const customer = tasksData.perusahaan.merk_perusahaan
    const {nama_kapal, proyek} = tasksData

    const populateData = (data) => {
      const {end, items, pekerjaan, status, responsible} = data
      return {
        data : {
          Tasks : pekerjaan,
          "Project/Asset" : nama_kapal,
          Customer : customer,
          Status : status,
          Responsible : responsible,
          Due : end,
          kind: items?.length ? 'dir' : 'doc'
        },
        children : items?.length ? items.map(item => populateData(item)) : []
      }
    }

    proyek.map(workProject => {
      workProject.work_area ? 
      this.dataSource = this.dataSourceBuilder.create(workProject.work_area.map(work => 
          populateData(work)) as TreeNode<FSEntry>[]) : ""
      })
    })
  }

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

  deleteProject(row){
    let id_proyek = this.allProjectDatas[row].id_proyek
    this.service.deleteProject(id_proyek)
  }

  getShowOn(index: number) {
    const minWithForMultipleColumns = 400;
    const nextColumnStep = 100;
    return minWithForMultipleColumns + (nextColumnStep * index);
  }

  publishProject(row){
    this.service.publishProject(row)
    .subscribe(res => {
      console.log(res)
    })
  }
}



