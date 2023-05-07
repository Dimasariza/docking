import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProfileService } from '../profile/profile.service';
import { ReportService } from './report.service';
import { CommonFunction } from '../../component/common-function/common-function';
import { ProjectStatusComponent } from './last-folder/project-status/project-status.component';

@Component({
  selector: 'ngx-report-component',
  templateUrl: './report.component.html',
})
export class ReportComponent implements OnInit, OnDestroy  {
  constructor(
    private reportService : ReportService,
    private activatedRoute : ActivatedRoute,
    private profileService : ProfileService,
    public commonFunction : CommonFunction
  ) { }

  suplierData : any;
  responsible : any;
  summaryData : any;
  companyProfile : any;

  workProgress : any;
  variantWork : any;

  private destroy$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.reportService.getWorkPerProject(id)
    .pipe(takeUntil(this.destroy$))
    .subscribe(({data} : any) => this.generateSummaryData(data) )

    this.profileService.getAllUsers({})
    .pipe(takeUntil(this.destroy$))
    .subscribe(({data} : any) => this.responsible = data)
    
    this.reportService.getAllSupliers({})
    .pipe(takeUntil(this.destroy$))
    .subscribe(({data} : any) => this.suplierData = data)

    this.profileService.getCompanyProfile({})
    .pipe(takeUntil(this.destroy$))
    .subscribe(({data} : any) => this.companyProfile = data)
  }

  generateSummaryData (data) {
    const { kapal : { nama_kapal }, tahun, status } = data?.proyek;
    const projectTitle = `${nama_kapal} -DD- ${tahun} ${status.toUpperCase()}`
    this.summaryData = { ...data, projectTitle }
    const { work_area = [], variant_work = [] } = data;
    this.workProgress = work_area;
    this.variantWork = variant_work;
  }

  projectStatusDialog(title) {
    this.commonFunction.openDialog({
      dialogData : { 
        title,
        data : this.summaryData
      },
      component : ProjectStatusComponent
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}