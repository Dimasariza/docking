import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { FunctionCollection } from '../function-collection-batera/function-collection.component';
import { HomeBateraService } from '../home-batera/home-batera.service';
import { PdfGeneratorBateraComponent } from '../pdf-generator-batera/pdf-generator-batera.component';
import { ProfileBateraService } from '../profile-batera/profil-batera.service';
import { ProjectBateraService } from '../project-batera/project-batera.service';
import { TenderBateraService } from '../tender-batera/tender-batera.service';
import { FrappeGanttComponent } from '../tracking-batera/frappe-gant/frappe-gantt.component';
import { TrackingBateraComponent } from '../tracking-batera/tracking-batera.component';
import { ProjectStatusComponent } from './project-status/project-status.component';
import { ReportBateraService } from './report-batera.service';
import html2canvas from 'html2canvas'
import pdfMake from "pdfmake/build/pdfmake";  
import pdfFonts from "pdfmake/build/vfs_fonts";  
import { DatePipe } from '@angular/common';
pdfMake.vfs = pdfFonts.pdfMake.vfs; 


@Component({
  selector: 'ngx-report-batera',
  templateUrl: './report-batera.component.html',
  styleUrls : ['../home-batera/home.component.scss']
})
export class ReportBateraComponent implements OnInit, OnDestroy  {
  constructor(private reportBateraService : ReportBateraService,
              private dialog : MatDialog,
              private activatedRoute : ActivatedRoute,
              private projectService : ProjectBateraService,
              private pdfExporter : PdfGeneratorBateraComponent,
              private tenderService : TenderBateraService,
              private profileService : ProfileBateraService,
              private FNCOL : FunctionCollection,
              private homeservice : HomeBateraService,
              private trackingComponent : TrackingBateraComponent,
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
    const _subs1 = this.reportBateraService.getWorkPerProject(id)
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

    const _subs3 = this.reportBateraService.getSuplier()
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
    this.tasks = work_area.map(job => {
      const {start, end, jobName} = job;
      return {
      name : jobName,
      price : 100,
      start : this.datePipe.transform(start, 'YYYY-MM-dd'),
      end : this.datePipe.transform(end, 'YYYY-MM-dd'),
      progress_log: [
        {progress : 10, date: '2016-1-15'},
        {progress : 20, date: '2016-1-21'},
      ],
      }
    })
    
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
      this.pdfExporter.generatePDFBasedOnProject(this.projectData, this.subProjectData, this.yardDatas, imgData);
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