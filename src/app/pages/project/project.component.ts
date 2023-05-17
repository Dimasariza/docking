import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ProjectService } from './project.service';
import { CommonFunction } from '../../component/common-function/common-function';
import { ToastrComponent } from '../../component/toastr-component/toastr.component';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ngx-project-component',
  template: `
  <nb-alert 
    *ngIf=" currentUser?.role =='shipyard' " 
    status="warning" 
  >
    You have no access. Please Leave this page.
  </nb-alert>

  <ngx-project-task-mine
    [projectData]="projectData ?? []"
    (refresh)=ngOnInit()
  >
  </ngx-project-task-mine>

  <ngx-project-list-project
    [projectData]="projectData ?? []"
    (refresh)=ngOnInit()
  >
  </ngx-project-list-project>
  `,
})
export class ProjectComponent implements OnInit, OnDestroy {
  constructor(
    private projectService :ProjectService,
    private toastr : ToastrComponent,
    public commonFunction : CommonFunction,
    ) { }

  public currentUser : any = {};

  ngOnInit() {
    let user = JSON.parse(localStorage.getItem('user'));
    let { role } : any = user; 
    if(role == 'shipyard') {
      return this.currentUser = user;
    } else
    if(role == 'shipmanager') {

    } else
    if(role == 'director') {

    }

    this.projectService.getAllProjects({})
    .pipe(takeUntil(this.destroy$)) 
    .subscribe(
      ({data} : any) => data?.length ? this.reconstructTableData(data) : null,
      () => this.toastr.onError()
    );
  }

  public projectData : any;
  private destroy$: Subject<void> = new Subject<void>();

  reconstructTableData(datas) {
    this.projectData = datas.map(data => {
      const {kapal : {nama_kapal}, tahun, phase, status, work_area} = data;
      const phaseStatus = this.commonFunction.setPhase(phase);
      const projectTitle = `${nama_kapal} -DD- ${tahun} ${status.toUpperCase()}`; 
      return {...data, phaseStatus, projectTitle};
    })
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}



