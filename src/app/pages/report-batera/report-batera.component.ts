import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { PdfGeneratorBateraComponent } from '../pdf-generator-batera/pdf-generator-batera.component';
import { ProjectBateraService } from '../project-batera/project-batera.service';
import { TenderBateraService } from '../tender-batera/tender-batera.service';
import { ProjectStatusComponent } from './project-status/project-status.component';
import { ReportBateraService } from './report-batera.service';

@Component({
  selector: 'ngx-report-batera',
  templateUrl: './report-batera.component.html',
})
export class ReportBateraComponent implements OnInit, OnDestroy  {
  constructor(private reportBateraService : ReportBateraService,
              private dialog : MatDialog,
              private activatedRoute : ActivatedRoute,
              private projectService : ProjectBateraService,
              private pdfExporter : PdfGeneratorBateraComponent,
              private tenderService : TenderBateraService
    ) {
  }

  projectData : any
  subProjectData : any
  yardDatas : any
  subscription : Subscription[] = []
  
  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id')
    const _subs1 = this.reportBateraService.getWorkPerProject(id)
    .pipe(take(1))
    .subscribe(({data} : any) => {
      this.projectData = data
      this.yardData(data.id_tender)
    })

    const _subs2 = this.projectService.getSubProjectData(id) 
    .pipe(take(1))
    .subscribe(({data} : any) => {
      this.subProjectData = data
      this.subProjectData['head'] = `${data.kapal.nama_kapal}-DD-${data.tahun}`
    })

    this.subscription.push(_subs1)
    this.subscription.push(_subs2)
  }

  yardData(id): void {
    this.tenderService.getDataTenderPerId(id)
    .subscribe(({data} : any) => this.yardDatas = data)
  }

  projectStatusDial(){
    this.dialog.open(ProjectStatusComponent, {
      disableClose : true, 
      autoFocus:true, 
      data : this.projectData
    })
  }

  exportToPDF(){
    this.pdfExporter.generatePDFBasedOnProject(this.projectData, this.subProjectData, this.yardDatas)
  }

  ngOnDestroy(): void {
    this.subscription.forEach((subs) => subs.unsubscribe())
  }
}
