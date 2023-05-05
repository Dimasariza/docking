import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ProjectService } from './project.service';
import { CommonFunction } from '../../component/common-function/common-function';
import { ToastrComponent } from '../../component/toastr-component/toastr.component';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ngx-project-component',
  template: `
  <nb-alert *ngIf="handleEvent?.show" 
    [status]="handleEvent?.status" 
    [nbSpinner]="handleEvent?.spinner" 
    nbSpinnerStatus="basic"
  >
    {{handleEvent.text}}
  </nb-alert>

  <ngx-project-task-mine 
    *ngIf="projectData"
    [projectData]="projectData"
    (refresh)=refresh($event)
  >
  </ngx-project-task-mine>

  <ngx-project-list-project 
    *ngIf="projectData"
    [projectData]="projectData"
    (refresh)=refresh($event)
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

  handleEvent;

  ngOnInit() {
    this.projectService.getDataProjects()
    .pipe(takeUntil(this.destroy$), take(1)) 
    .subscribe(
      ({data} : any) => data?.length ? this.reconstructTableData(data) : null,
      () => this.toastr.onError()
    );
  }

  refresh() {
    this.ngOnInit();
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



