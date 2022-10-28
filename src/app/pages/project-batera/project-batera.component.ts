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
    // {icon : 'plus-square-outline', menu : ''},
    // {icon : 'book-outline', menu : ''},
    {icon : 'trash-2-outline', menu : 'Delete Project'},
    {icon : 'checkmark-square', menu : 'Approval'},
    // {icon : 'archive-outline', menu : ''},
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

  sortByProject : any = "all"
  sortByStatus : any = "all"
  sortByResponsible : any = "all" 

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
    });

    this.profileService.getUserData(1, 10,'', '', '')
    .subscribe(({data} : any) => this.responsible = data)
  }

  collectData(){
    this.workAreaContainer = []
    const buildEmpty = () => this.dataSource = this.dataSourceBuilder.create([]);
    this.projectDatas
    .filter((project, id) => {
      this.projectDatas[id].phase = this.FNCOL.phasesStatus(this.projectDatas[id].phase)
      if(project.id_proyek === this.sortByProject) return project
      if(this.sortByProject === 'all') return project
    })
    .map(project => {
      const {work_area, kapal, tahun} = project
      return {
        work_area,
        name : `${kapal.nama_kapal} - DD - ${tahun}`
      }})
    .filter(project => {
      const {work_area : work, name : projectName} = project
      if(work === null || work === undefined || !work.length || work[0] === null) return;
      work.forEach(item => {
          item['projectName'] = projectName
          item['cust'] = this.shipManagement
          if(this.sortByStatus === 'all' && this.sortByResponsible === 'all') 
          this.workAreaContainer.push(item);
          if(typeof(this.sortByResponsible) === 'number')
          if(item.responsible.id === this.sortByResponsible) 
          this.workAreaContainer.push(item);
          if(typeof(this.sortByStatus) === 'number') 
          if(item?.status?.id === this.sortByStatus) 
          this.workAreaContainer.push(item);
      })
    })

    if(!this.workAreaContainer.length) buildEmpty();
    else this.dataSource = this.dataSourceBuilder.create(this.workAreaContainer.map(work => this.FNCOL.populateData(work, {}, false)));
  }

  clickAction(btn, data){
    switch(btn){
      case 'Delete Project':
        this.deleteProject(data)
      break;
      case 'Approval':
        console.log("Approve")
      break;
    }
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



