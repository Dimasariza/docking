import { CurrencyPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { take, takeUntil } from 'rxjs/operators';
import { ProjectService } from '../project/project.service';
import { TenderService } from './tender.service'
import { Subject } from 'rxjs';
import { CommonFunction } from '../../component/common-function/common-function';
import { ReportService } from '../report/report.service';
import { ToastrComponent } from '../../component/toastr-component/toastr.component';

@Component({
  selector: 'ngx-tender-component',
  template: `
    <ngx-tender-contract 
      (sendLoadDetails)="tenderLoadDetails.generateTableDatas($event)"
      [tenderData]="tenderData"
      [projectData]="projectData"
      [projectSummary]="projectSummary"
      *ngIf="projectSummary"
      (refresh)=ngOnInit()
    >
    </ngx-tender-contract>

    <ngx-tender-load-details 
      #tenderLoadDetails
      (refresh)=ngOnInit()
    >
    </ngx-tender-load-details>
  `,
})

export class TenderComponent implements OnInit, OnDestroy {
  constructor(
    private projectService : ProjectService,
    private tenderService : TenderService,
    private reportService : ReportService,
    private toastr : ToastrComponent,
    public commonFunction : CommonFunction,
    public currency : CurrencyPipe,
  ) {}

  private destroy$: Subject<void> = new Subject<void>();

  tenderData : any = [];
  projectData : any = [];
  projectSummary : any;

  ngOnInit(): void {
    this.reportService.getProjectSummary({})
    .subscribe(({data} : any) => {
      this.projectSummary = data.map(summary => { 
        const { kapal : { nama_kapal }, tahun, status } = summary.proyek;
        const projectTitle = `${nama_kapal} -DD- ${tahun} ${status.toUpperCase()}`
        return {...summary, projectTitle, hover : false}
      })
    },
    () => this.toastr.onError(),
    () => {
      this.getProjectList();
      this.getYardList();
    }
    );
  }

  getProjectList() {
    this.projectService.getAllProjects({})
    .pipe(takeUntil(this.destroy$))
    .subscribe(({data} : any) => {  
        this.projectData = data.map(project => {
          const {kapal : {nama_kapal}, tahun, status, id_proyek : projectId} = project;
          const projectTitle = `${nama_kapal} -DD- ${tahun} ${status.toUpperCase()}`;
          const match = this.projectSummary.find(({id_proyek} : any) => id_proyek == projectId);
          if(match) return null;
          return {...project, projectTitle, hover : false}
        }).filter(project => project != null)
      },
      () => this.toastr.onError(),
    )
  }

  getYardList() {
    this.tenderService.getAllYards({})
    .pipe(takeUntil(this.destroy$))
    .subscribe(({data} : any) => {
        this.tenderData = data.map(yard => {
          const { nama_galangan, id_tender } = yard;
          const match = this.projectSummary
          .find((summary, index) => {
            if(summary.id_tender == id_tender) {
              this.projectSummary[index] = {...summary, yard, nama_galangan}
              return summary;
            }
          });
          if(match) return null; 
          return {...yard, hover : false}
        }).filter(yard => yard != null);
      },
      () => this.toastr.onError(),
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}