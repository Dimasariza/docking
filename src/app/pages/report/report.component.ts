import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { FunctionCollection } from '../../component/function-collection/function-collection.component';
import { HomeService } from '../home/home.service';
import { ProfileService } from '../profile/profile.service';
import { ProjectService } from '../project/project.service';
import { TenderService } from '../tender/tender.service';
import { FrappeGanttComponent } from '../tracking/frappe-gant/frappe-gantt.component';
import { TrackingComponent } from '../tracking/tracking.component';
import { ProjectStatusComponent } from './project-status/project-status.component';
import { ReportService } from './report.service';
import html2canvas from 'html2canvas'
import { DatePipe } from '@angular/common';


@Component({
  selector: 'ngx-report-component',
  templateUrl: './report.component.html',
  styleUrls : ['../home/home.component.scss']
})
export class ReportComponent implements OnInit, OnDestroy  {
  constructor(private reportService : ReportService,
              private dialog : MatDialog,
              private activatedRoute : ActivatedRoute,
              private projectService : ProjectService,
              private tenderService : TenderService,
              private profileService : ProfileService,
              private FNCOL : FunctionCollection,
              private homeservice : HomeService,
              private trackingComponent : TrackingComponent,
              private datePipe : DatePipe
    ) {
  }

  projectData : any
  subProjectData : any
  yardDatas : any
  subscription : Subscription[] = []
  dataSuplier : any
  alertConds 
  picData : any
  companyProfile : any
  userRole;

  tasks : any = [ ];

  public context: CanvasRenderingContext2D;
  
  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id')
    const _subs1 = this.reportService.getWorkPerProject(id)
    .pipe(take(1))
    .subscribe(({data} : any) => {
      this.projectData = data
      this.yardData(data.id_tender)
    })

    this.homeservice.getUserLogin()
    .pipe(take(1))
    .subscribe(({data} : any) => {
      const {role} = data
      if(role === 'admin')
      this.profileService.getUserData(1, 10)
      .pipe(take(1))
      .subscribe(({data} : any) => this.picData = data)
    })

    const _subs2 = this.projectService.getSubProjectData(id) 
    .pipe(take(1))
    .subscribe(({data} : any) => {
      this.defineTasks(data)
      this.subProjectData = data
      const {kapal : {nama_kapal}, tahun, status} = data
      this.subProjectData['head'] = `${nama_kapal}-DD-${tahun} ${this.FNCOL.convertStatus(status)}`
    })

    const _subs3 = this.reportService.getSuplier()
    .pipe(take(1))
    .subscribe(({data} : any) => this.dataSuplier = data)

    const _subs4 = this.profileService.getCompanyProfile()
    .pipe(take(1))
    .subscribe(({data} : any) => this.companyProfile = data)

    this.subscription.push(_subs1)
    this.subscription.push(_subs2)
    this.subscription.push(_subs3)
    this.subscription.push(_subs4)
  }

  @ViewChild(FrappeGanttComponent) gantChart : FrappeGanttComponent
  defineTasks (data) {
    const {work_area} = data;
    let jobContainer = [];

    const pushJob = (work_area) =>
    work_area.map(job => {
      const {start, end, jobName, items} = job;
      const data = {
      name : jobName,
      price : 100,
      start : this.datePipe.transform(start, 'YYYY-MM-dd'),
      end : this.datePipe.transform(end, 'YYYY-MM-dd'),
      progress_log: [
        {progress : 10, date: '2016-1-15'},
        {progress : 20, date: '2016-1-21'},
      ],
      }
      jobContainer.push(data)
      if(items.length > 0) pushJob(items)
    })
    pushJob(work_area)
    this.tasks = jobContainer;
  }

  yardData(id): void {
    this.tenderService.getDataTenderPerId(id)
    .subscribe(({data} : any) => this.yardDatas = data)
  }

  projectStatusDial(){
    this.dialog.open(ProjectStatusComponent, {
      disableClose : true, 
      autoFocus:true, 
      data : {
        variant_work : this.projectData.variant_work,
        project : this.subProjectData
      }
    })
  }

  exportToPDF(){
    this.gantChart.ngOnInit()
    const element = document.getElementById("exportGanttChart")
    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL('image/jpeg');
      // this.pdfExporter.generatePDFBasedOnProject(this.projectData, this.subProjectData, this.yardDatas, imgData);
    })
  }

  allertStatus (status) {
    if(status === 'send_email') {
      console.log('send email')
    }
    
    this.alertConds = { status, msg : 'email has been send', conds : true}
    setTimeout(() => {
      this.alertConds = {...this.alertConds, conds : false}
    }, 5000);
  }

  ngOnDestroy(): void {
    this.subscription.forEach((subs) => subs.unsubscribe())
  }
}