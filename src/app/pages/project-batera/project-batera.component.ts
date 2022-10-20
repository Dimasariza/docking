import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { FunctionCollection } from '../function-collection-batera/function-collection.component';
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
              public FNCOL : FunctionCollection,
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

  shortCut = [
    {icon : 'plus-square-outline', menu : ''},
    {icon : 'book-outline', menu : ''},
    {icon : 'trash-2-outline', menu : 'Delete Project'},
    {icon : 'checkmark-square', menu : 'Approval'},
    {icon : 'archive-outline', menu : ''},
  ]

  columnHead = ['Tasks', 'Customer'];
  columnContents = ['jobName','cust']
  allColumns = [ 'icon', ...this.columnContents, 'project', 'status' ,'resp', 'due']
  dataSource: NbTreeGridDataSource<FSEntry>;
  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  projectDatas : any
  workAreaContainer : any = []
  shipManagement : string
  responsible : any = []
  status : any = ['Not Started', 'Done', 'In Progress', 'Done']
  projectFilter : string = "all"
  statusFilter : string = "all"
  respFilter : string = "all"

  ngOnInit() {
    this.profileService.getCompanyProfile()
    .subscribe(({data} : any) => {
      this.shipManagement = data.profile_merk_perusahaan
    })

    this.projectService.getDataProjects()
    .subscribe(({data} : any) => {
      if(!data.length || data === null) return;
      this.projectDatas = data
      this.collectData() 
      this.regroupAllData()
    });

    this.profileService.getUserData(1, 10,'', '', '')
    .subscribe(({data} : any) => this.responsible = data)
  }

  collectData(){
    this.projectDatas.map((work, id) => {
      this.projectDatas[id].phase = this.FNCOL.phasesStatus(this.projectDatas[id].phase)
      const {work_area} = work
      if(!work_area || work_area[0] === null) return; 
      const projectJob = work_area.map(project => ({
        ...project,
        project : `${work.kapal.nama_kapal} -DD- ${work.tahun}`
      }))
      this.workAreaContainer.push(...projectJob)
    }) 
  }

  clickAction(btn, data){
    switch(btn){
      case 'Delete Project':
        this.deleteProject(data)
      break;
      case 'Approval':
        console.log("Approve")
      break;
      case 'project' :
        this.regroupBasedProject(data)
        break;
      case 'status':
        this.regroupBasedStatus(data)
        break;
      case 'resp' :
        this.regroupBasedResp(data)
        break;
      case 'all data' :
        this.regroupAllData()
        break;
    }
  }

  generateDataSource(workArea){
    workArea === null ||
    workArea === undefined ||
    workArea[0] === null ? 
    this.dataSource = this.dataSourceBuilder.create([]) :
    this.dataSource = this.dataSourceBuilder.create(workArea.map(work => {
      const workItem = { cust : this.shipManagement}
      return this.FNCOL.populateData(work, workItem)
    }) as TreeNode<FSEntry>[] ) 
  }

  regroupAllData(){
    this.generateDataSource(this.workAreaContainer)
  }

  regroupBasedProject(data){
    this.generateDataSource(data.work_area)
  }

  regroupBasedStatus(data){
    console.log(data)
  }

  regroupBasedResp(data){
    let workContainer = []
    const work = this.projectDatas
    .filter(project => project.id_user === data)
    .forEach(item => console.log(item))
    this.generateDataSource(workContainer)
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



