import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { DeleteDialogComponent } from '../../component/delete-dialog/delete-dialog.component';
import { ProjectService } from './project.service';
import { CommonFunction } from '../../component/common-function/common-function';
import { ProjectDialogComponent } from './project-dialog/project-dialog.component';
import { ToastrComponent } from '../../component/toastr-component/toastr.component';

@Component({
  selector: 'ngx-project-component',
  templateUrl: './project.component.html',
  styleUrls : ['../home/home.component.scss'],
})
export class ProjectComponent implements OnInit, OnDestroy {
  constructor(
    private dialogService: NbDialogService,
    private projectService :ProjectService,
    private toastr : ToastrComponent,
    public commonFunction : CommonFunction,
    ) {
  }

  ngOnInit() {
    this.projectService.getDataProjects()
    .subscribe(
      ({data} : any) => data?.length ? this.generateTableDatas(data) : null,
      () => this.toastr.onError()
    );
  }

  private destroy$: Subject<void> = new Subject<void>();
  workAreaData = [];
  projectDatas : any;

  dataTable : any;  
  tableDetails = {style :{ width : '1800px', "max-height" : '300px' }, searchBar : true};
  allColumns = [ 'jobNumber', 'jobName', 'projectTitle', 'status', 'responsible', 'end' ]; 
  columnType = [ 
    { type : 'number', width : 100 }, 
    { type : 'text', width : 150 }, 
    { type : 'text', width : 250 }, 
    { type : 'text', width : 150 }, 
    { type : 'text', width : 200 }, 
    { type : 'date', width : 200 }
  ]
  
  tableHead = [ 
    { type : 'text', placeholder : 'Job Number' },
    { type : 'text', placeholder : 'Tasks' },
    { type : 'drop-down', placeholder : 'Project', option : ['All'], target : 'sort' },
    { type : 'drop-down', placeholder : 'Status', option : ['All', ...this.commonFunction.jobStatus], target : 'sort' },
    { type : 'drop-down', placeholder : 'Responsible', option : ['All'], target : 'sort' },
    { type : 'text', placeholder : 'Due' }
  ]

  columns = [
    { name: 'Project Name', type : 'title', prop : 'projectTitle', width : 420},
    { name : '', type : 'button', prop : 'projectTitle', width : 150,
      button :  [ {icon : 'trash-2-outline', menu : 'Delete Project'},
                  {icon : 'copy-outline', menu : 'Copy Project'} ], 
    },
    { name: 'R', type : 'phase', prop : 'phaseStatus', width : 40},
    { name: 'P', type : 'phase', prop : 'phaseStatus', width : 40},
    { name: 'E', type : 'phase', prop : 'phaseStatus', width : 40},
    { name: 'F', type : 'phase', prop : 'phaseStatus', width : 80},
    { name: 'Start', type : 'date', prop : 'off_hire_start', width : 280},
    { name: 'End', type : 'date', prop : 'off_hire_end', width : 280}
  ];

  generateTableDatas(datas) {
    this.projectDatas = datas.map(data => {
      const {kapal : {nama_kapal}, tahun, phase, status} = data;
      const phaseStatus = this.commonFunction.setPhase(phase);
      const projectTitle = `${nama_kapal} -DD- ${tahun} ${status.toUpperCase()}`; 
      if(!this.projectTitle.includes(projectTitle)) 
        this.projectTitle.push(projectTitle); 
      if(this.commonFunction.arrayNotEmpty(data.work_area))
        data.work_area.forEach(item => {
          this.allColumns.forEach(column => item?.[column] ? null : item[column] = "");
          const responsible = item.responsible;
          if(!this.responsible.includes(responsible) && responsible) 
            this.responsible.push(responsible); 
            this.workAreaData.push({...item, projectTitle});
        })
      return {...data, phaseStatus, projectTitle};
    })
    this.tableHead[2].option = this.projectTitle;
    this.tableHead[4].option = this.responsible;
    this.dataTable = this.commonFunction.populateData(this.workAreaData, false)
  }

  changingValue: Subject<boolean> = new Subject();
  responsible = ['All'];
  projectTitle = ['All'];
  filterTable : any = {
    projectTitle : 'All',
    responsible : 'All',
    status : 'All'
  };

  sortTableByFilter({column, value} : any) {
    this.filterTable[column] = value;
    let sortingData = this.workAreaData;
    const sortBy = Object.keys(this.filterTable).filter(sort => this.filterTable[sort] != 'All')
    for(let sort of sortBy) 
      sortingData = sortingData.filter(data => data[sort] == this.filterTable[sort])

    this.dataTable = this.commonFunction.populateData(sortingData, false) 
    this.changingValue.next(this.dataTable);
  }

  handleButtonClick(btn, data){
    switch(btn){
      case 'Delete Project':
        this.deleteProjectDialog(data)
      break;
      case 'Copy Project' :
        this.onUploadData(data, 'Copy Project')
      break;
    }
  }

  addProjectDialog() {
    this.openDialog({
      dialogData : {
        title : 'Add Project',
      },
      component : ProjectDialogComponent 
    })
  }

  deleteProjectDialog(data) {
    this.openDialog({
      dialogData : {
        title : 'Delete Project',
        name : data.projectTitle,
        id : data.id_proyek
      },
      component : DeleteDialogComponent 
    })
  }

  openDialog({dialogData, component} : any){
    this.dialogService.open(component, {
      hasBackdrop : true,
      closeOnBackdropClick : false,
      context: { dialogData },
    })
    .onClose
    .pipe(takeUntil(this.destroy$), take(1))
    .subscribe(data => this.onUploadData(data, dialogData.title));
  }

  onUploadData(data, title) {
    console.log(data)
    return
    if(!data) return;

    let subscribe;
    let successMsg;
    let errorMsg = 'Please try again.';

    if(title == 'Add Project') {
      const { offHirePeriod, repairInDock, repairPeriod } = data;
      const off_hire_start = this.commonFunction.transformDate(offHirePeriod.start);
      const off_hire_end = this.commonFunction.transformDate(offHirePeriod.end);
      const repair_start = this.commonFunction.transformDate(repairInDock.start);
      const repair_end = this.commonFunction.transformDate(repairInDock.end);
      const repair_in_dock_start = this.commonFunction.transformDate(repairPeriod.start);
      const repair_in_dock_end = this.commonFunction.transformDate(repairPeriod.end);

      const uploadData = { ...data, off_hire_start, off_hire_end, 
        repair_start, repair_end, repair_in_dock_start, repair_in_dock_end
      }

      subscribe = this.projectService.addDataProject(uploadData)
      successMsg = 'Your Project has been added.'
    }

    if(title == 'Update Project') {
      subscribe = this.projectService.updateProject(data)
      successMsg = 'Your Project has been updated.'
    }

    if(title == 'Delete Project') {
      subscribe = this.projectService.deleteProject(data)
      successMsg = 'Your Project has been deleted.'
    }

    if(title == 'Copy Project') {
      subscribe = this.projectService.addDataProject(data)
      successMsg = 'Your Project has been copied.'
    }
    
    subscribe
    .pipe(takeUntil(this.destroy$), take(1))
    .subscribe(
      () => {
        this.toastr.onUpload()
        this.ngOnInit();
      },
      () => this.toastr.onError(errorMsg),
      () => this.toastr.onSuccess(successMsg)
    );
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}



