import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProfileService } from '../profile/profile.service';
import { ReportService } from './report.service';
import { CommonFunction } from '../../component/common-function/common-function';
import { ReportStatusDialog } from './report-status-dialog/report-status-dialog';
import { ToastrComponent } from '../../component/toastr-component/toastr.component';
import { ExportToExcel } from '../../component/common-function/export-excel';

@Component({
  selector: 'ngx-report-component',
  templateUrl: './report.component.html',
})
export class ReportComponent implements OnInit, OnDestroy  {
  constructor(
    private reportService : ReportService,
    private activatedRoute : ActivatedRoute,
    private profileService : ProfileService,
    private toastr : ToastrComponent,
    public commonFunction : CommonFunction,
    private exportToExcel : ExportToExcel
  ) { }

  suplierData : any;
  responsible : any;
  summaryData : any;
  companyProfile : any;

  workProgress : any;
  variantWork : any;
  emailData : any;

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
  }

  projectStatusDialog(title) {
    this.commonFunction.openDialog({
      dialogData : { 
        title,
        data : this.summaryData
      },
      component : ReportStatusDialog
    })
  }

  sendEmailNotification(work_area, label) {
    const { kapal : { nama_kapal }, tahun, status } = this.summaryData?.proyek;
    let subscribe;
    this.exportToExcel.label = label;
    this.exportToExcel.reconstructToExcelData(work_area);
    const work = this.exportToExcel.excelData.map(job => {
      const {["Job Number"] : job_no, ["Job Name"] : job_name, 
      Progress : progress = 0, Start : start = "", Stop : end = "", Vol : volume = "", Unit : unit = "",
      ["Unit Price"] : unit_price = "", ["Total Price"] : total_price = "", Category : category = "" } = job;
      return {job_no, job_name, progress, start, end, volume, unit, unit_price, total_price, category}
    })
    this.toastr.onUpload("Send Notification...")
    this.responsible.forEach(respons => {
      let postBody : any = { 
        shipyard : {
          nama_user : respons.nama_lengkap,
          nama_perusahaan : this.companyProfile.profile_nama_perusahaan ,
          email : respons.email
        },
        no_docking :`${nama_kapal} -DD- ${tahun} ${status}`,
      }

      if(label == "Actual") {
        postBody = {...postBody, work_progress : work}
        subscribe = this.reportService.sendWorkProgressEmail(postBody)
      }

      if(label == "AddOn") {
        postBody = {...postBody, work_variant : work}
        subscribe = this.reportService.sendWorkVariantEmail(postBody)
      }

      subscribe
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => "",
        () => this.toastr.onError("Sending email failed. Please fill empty column and try again."),
        () => this.toastr.onSuccess("Email has been send.") 
      )
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}