import { Component, ViewChild, ElementRef, Injectable, Input, OnInit } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';
import { ToastrComponent } from '../../../component/toastr-component/toastr.component';
import { CommonFunction } from '../../../component/common-function/common-function';
import { environment } from "../../../../environments/environment"
import { HomeService } from '../../home/home.service';


@Injectable({
    providedIn : 'root'
})
@Component({
  selector: 'export-to-pdf',
  templateUrl: './export-to-pdf.html',
})
export class ExportToPDF  {
  constructor(
    private toastr : ToastrComponent,
    private commonFunction : CommonFunction,
    private homeService : HomeService
  ) { }

  @ViewChild('pdfTable') pdfTable: ElementRef;
  @Input() public summaryData : any;
  @Input() tableType = '';
  jobData : any = {};
  tableStyle : any = {'font-size' : '10px'}
  createDate : any = new Date();

  createByJob(data, ganttSVG: string = null) {
    let allJob : any = [];
    this.commonFunction.collectItem([data], (x) => allJob.push(x));
    this.jobData = {...data, allJob};
    this.toastr.onInfo({
      infomsg : "Export Your job to PDF.",
      title : 'Export File',
      duration : 2000
    });
    setTimeout(() => this.downloadAsPDF(ganttSVG), 1000);
  }
  
  createByProject(summaryData, ganttSVG: string) {
    this.summaryData = summaryData;
    this.generateTableDatas();
    this.toastr.onInfo({
      infomsg : "Export Your project to PDF.",
      title : 'Export File',
      duration : 2000
    });
    setTimeout(() => this.downloadAsPDF(ganttSVG), 1000);
  }

  projectSummaryColumn = [
    { name : '', prop : 'title', width : '*' },
    { name : '', prop : 'details', width : '*' },
  ]
  projectSummaryRow : any;

  costSummaryColumn = [
    { name : 'Totals', prop : 'title', width : '*' },
    { name : 'Budget', prop : 'budget', width : '*' },
    { name : 'Contract', prop : 'contract', width : '*' },
    { name : 'Actual', prop : 'actual', width : '*' },
  ]
  costSummaryRow : any;

  costDetailsRow : any;
  costDetailsColumn = [
    { name : 'No', prop : 'jobNumber', width : '5%' },
    { name : 'Job Name', prop : 'jobName', width : '*' },
    { name : 'Budget', prop : 'unitPriceBudget', width : '*' },
    { name : 'Contract', prop : 'unitPriceContract', width : '*' },
    { name : 'Actual', prop : 'unitPriceActual', width : '*' },
    { name : 'Added', prop : 'unitPriceAddOn', width : '*' },
    { name : '%', prop : 'progress', width : '2%' },
  ];
  costDetailsFooter = ['Total', '', 0, 1000, 0, 0, 0];

  progressReportColumn = [
    { name : 'SFI', prop : 'jobNumber', width : '5%' },
    { name : 'Name', prop : 'jobName', width : '*' },
    { name : 'Pri', prop : 'rank', width : 'auto' },
    { name : 'Status', prop : 'status', width : 'auto' },
    { name : 'Resp', prop : 'responsible', width : 'auto' },
    { name : 'Start', prop : 'start', width : 'auto' },
    { name : 'Stop', prop : 'end', width : 'auto' },
    { name : 'Contract', prop : 'unitPriceContract', width : 'auto' },
    { name : 'Add On', prop : 'unitPriceAddOn', width : 'auto' },
    { name : 'Actual', prop : 'unitPriceActual', width : 'auto' },
  ]

  allJobRow : any;
  criticalJobRow : any;
  delayedJobRow : any;
  doneJobRow : any;
  variantJobRow : any; 
  statusProgress : any = {progress : {}, total : {}};

  generateTableDatas() {
    const { proyek : {kapal : {nama_kapal}, phase, mata_uang, 
      off_hire_start, off_hire_end, off_hire_period, off_hire_deviasi, 
      off_hire_bunker_per_day, repair_start, repair_end, repair_period,
      repair_in_dock_start, repair_in_dock_end, repair_in_dock_period,
      repair_additional_day},
      tender : {nama_galangan},
      work_area, variant_work
    } = this.summaryData;

    this.projectSummaryRow = [
      { title : "Vessel", details : nama_kapal },
      { title : "Phase", details : phase.split('_').join(" ").toUpperCase() },
      { title : "Selected Yard", details : nama_galangan },
      { title : "Base Currency", details : mata_uang },
      { title : "Off Hire Period", details : `( ${off_hire_period} Days )  ${off_hire_start} - ${off_hire_end}` },
      { title : " - Deviation", details : `${off_hire_deviasi} Days` },
      { title : " - Charter Rate", details : `${ this.commonFunction.convertToCurrency(mata_uang, off_hire_bunker_per_day) }` },
      { title : " - Bunker", details : `${ this.commonFunction.convertToCurrency(mata_uang, off_hire_bunker_per_day)}` },
      { title : "Repair Period", details : `( ${repair_period} Days )  ${repair_start} - ${repair_end}` },
      { title : " - In Dock", details : `( ${repair_in_dock_period} Days )  ${repair_in_dock_start} - ${repair_in_dock_end}` },
      { title : "Additional Days", details : repair_additional_day },
    ]

    this.costSummaryRow = [
      { title : "Owner Exp", budget : '', contract : '', actual : '' },
      { title : " - Supplies", budget : '', contract : '', actual : '' },
      { title : " - Services", budget : '', contract : '', actual : '' },
      { title : " - Class", budget : '', contract : '', actual : '' },
      { title : " - Other", budget : '', contract : '', actual : '' },
      { title : " - Owner Cancelled Job", budget : '', contract : '', actual : '' },
      { title : " - Owner Additional Cost", budget : '', contract : '', actual : '' },
      { title : " - Yard Cost", budget : '', contract : '', actual : '' },
      { title : " - Yard Additional Cost", budget : '', contract : '', actual : '' },
      { title : " - Yard cancelled job", budget : '', contract : '', actual : '' },
      { title : " - Total Cost", budget : '', contract : '', actual : '' },
    ]

    this.commonFunction.jobStatus.forEach(status => {
      this.statusProgress.progress[status] = 0;
      this.statusProgress.total[status] = 0;
    })

    this.costDetailsRow = work_area.map(({jobNumber, jobName, 
      unitPriceBudget, unitPriceContract, unitPriceActual, unitPriceAddOn,
      progress, status}) => {
        progress = parseInt(progress)
        this.statusProgress.progress[status] += progress ;
        this.statusProgress.total[status]++;

        this.costDetailsFooter[2] += unitPriceBudget;
        this.costDetailsFooter[3] += unitPriceContract;
        this.costDetailsFooter[4] += unitPriceActual;
        this.costDetailsFooter[5] += unitPriceAddOn;
        this.costDetailsFooter[6] += progress;

        return { jobName, jobNumber, progress,
          unitPriceBudget : this.commonFunction.convertToCurrency(mata_uang, unitPriceBudget),
          unitPriceContract : this.commonFunction.convertToCurrency(mata_uang, unitPriceContract),
          unitPriceActual : this.commonFunction.convertToCurrency(mata_uang, unitPriceActual),
          unitPriceAddOn : this.commonFunction.convertToCurrency(mata_uang, unitPriceAddOn),
        }
    })

    for(let i = 2; i <=5; i++)
    this.costDetailsFooter[i] = this.commonFunction.convertToCurrency(mata_uang, this.costDetailsFooter[i])

    let allWorkArea = [];
    let allVariantWork = [];
    this.commonFunction.collectItem(work_area, (job)=> allWorkArea.push({
      ...job, rowType : 'progress', responsible : job.responsible.nama_lengkap
    }))
    this.commonFunction.collectItem(variant_work, (job)=> allVariantWork.push({
      ...job, rowType : 'progress', responsible : job.responsible.nama_lengkap
    }))

    this.allJobRow = allWorkArea;
    this.criticalJobRow = allWorkArea.filter(job => job.rank == 'Critical');
    this.doneJobRow = allWorkArea.filter(job => job.status == 'Done');
    this.delayedJobRow = allWorkArea.filter(job => {
      return this.commonFunction.parseDate(job?.end) > new Date();
    })
    this.variantJobRow = allVariantWork;
  }

  public async downloadAsPDF(ganttSVG: string) {    
    const pdfTable = this.pdfTable.nativeElement;
    let html = htmlToPdfmake(pdfTable.innerHTML);

    if (this.tableType == 'projectPDF') {
      html[0].stack.splice(8, 0, {svg : this.progressSvg(this.statusProgress)})
    }

    const ganttSPage = [
      {pageBreak: 'before', text: 'Gantt Chart & S-Curve\n', style: {bold: true, fontSize: 16}, pageOrientation: 'landscape'},
      {image: ganttSVG, width: 770}
    ]

    let allAttachment = [];
    this.allJobRow.filter(job => job.attachment)
    .forEach(item => allAttachment.push(...item.attachment));
    let imageUrl = await Promise.all(allAttachment.map(async item => ({
      [item.name+','+item.date] : await this.getBase64ImageFromURL( `${environment.apiUrl}/file/show/${item.url}`)
    })))

    let images = imageUrl.reduce((p, c) => ({...p, ...c}), {});

    const documentDefinition = { 
      content: [
        await this.tableHeader(),
        html,
        // ...ganttSPage,
        {pageBreak: 'before', text: 'Attachment\n', style: {bold: true, fontSize: 16, color : '#5588EE'}, pageOrientation: 'landscape'},
        ...allAttachment.map(item => [
            { image : item.name+','+item.date , width : 200},
            { text : `${item.name}, ${item.date}`}, 
        ]),
      ],
      images,
      pageBreakBefore: function(currentNode) {
        return currentNode.style && currentNode.style.indexOf('pdf-pagebreak-before') > -1;
      }
    };

    pdfMake.createPdf(documentDefinition).open();
  }

  getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };
      img.onerror = error => {
        reject(error);
      };
      img.src = url;
    });
  }

  async tableHeader() {
    const {kapal : {nama_kapal}, tahun, status} = this.summaryData.proyek;
    return {
      layout : "noBorders",
      table: {
        widths: [ '85%', 'auto' ],
        body: [
          [ 
            {
              text : `${nama_kapal} -DD- ${tahun} ${status.toUpperCase()}`, 
              fontSize: 20, color : '#2277AA'
            }, 
            { 
              image : await this.getBase64ImageFromURL('../../../../assets/images/Logo/Logo Sikomodo.jpeg'), 
              fit : [80, 80] 
            },
          ],
        ]
      }
    }
  }

  progressSvg(data : any) {
    let { total : {
      ['Not Started'] : total_not_started, 
      ['In Progress'] : total_in_progress,
      ['Done'] : total_done, 
      ['Canceled'] : total_cancelled
    }, progress : {
      ['Not Started'] : not_started, 
      ['In Progress'] : in_progress,
      ['Done'] : done, 
      ['Canceled'] : cancelled
    }} : any = data;
    let allTotal = total_not_started + total_in_progress + total_done + total_cancelled;
    let percenNotStarted = total_not_started / allTotal;
    let percenInProggress = total_in_progress / allTotal;
    let percenDone = total_done / allTotal;
    let percenCancelled = total_cancelled / allTotal;

    not_started = `${31.4 * percenNotStarted} ${total_not_started == 0 ? 0 : 31.4}`
    in_progress = `${31.4 * percenInProggress} ${total_in_progress == 0 ? 0 : 31.4}`
    done = `${31.4 * percenDone} ${total_done == 0 ? 0 : 31.4}`
    cancelled = `${31.4 * percenCancelled} ${total_cancelled == 0 ? 0 : 31.4}`

    return `<svg height="300px" width="550px" viewBox="5 0 25 25">
            <circle r="5" cx="10" cy="10" fill="gray" /> 
            <circle r="5" cx="10" cy="10" fill="transparent"
                    stroke="tomato"
                    stroke-width="10"
                    stroke-dasharray="${cancelled}" 
                    />
            <circle r="5" cx="10" cy="10" fill="transparent"
                    stroke="dodgerblue"
                    stroke-width="10"
                    stroke-dasharray="${done}"
                    />	  
            <circle r="5" cx="10" cy="10" fill="transparent"
                    stroke="gold"
                    stroke-width="10"
                    stroke-dasharray="${in_progress}"
                    />	  		  
            <circle r="5" cx="10" cy="10" fill="transparent"
                    stroke="bisque"
                    stroke-width="10"
                    stroke-dasharray="${not_started}"
                    />	 
            <rect x="22" y="12" width="1" height="1" fill="tomato" />
            <text x="23.5" y="12.9" font-size="1px" fill="#3B3C36" > 
            Cancelled ${percenCancelled * 100} %</text>
            <rect x="22" y="10" width="1" height="1" fill="dodgerblue" />
            <text x="23.5" y="10.9" font-size="1px" fill="#3B3C36" > 
            Done ${percenDone * 100} %</text>
            <rect x="22" y="8" width="1" height="1" fill="gold" />
            <text x="23.5" y="8.9" font-size="1px" fill="#3B3C36" > 
            In Progress ${percenInProggress * 100} %</text> 
            <rect x="22" y="6" width="1" height="1" fill="bisque" />
            <text x="23.5" y="6.9" font-size="1px" fill="#3B3C36" > 
            Not Started ${percenNotStarted * 100} %</text> 
    </svg>`
  }
}