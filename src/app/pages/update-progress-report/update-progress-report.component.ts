import { Component, ElementRef, OnInit, ViewChild, ViewChildren } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ReportService } from "../report/report.service";
import { CommonFunction, ReplaceData } from "../../component/common-function/common-function";
import { WorkAreasComponent } from "../../component/work-areas/work-areas.component";
import { ToastrComponent } from "../../component/toastr-component/toastr.component";
import { CheckFile } from "../../component/common-function/onUploadFile";
import { HttpEventType } from "@angular/common/http";

@Component({
    selector: 'update-progress-report',
    templateUrl: './update-progress-report.component.html',
})
export class UpdateProgressReport implements OnInit {
    constructor(
        private activeRoute : ActivatedRoute,
        private reportService : ReportService,
        private commonFunction : CommonFunction,
        private router : Router,
        private toastr : ToastrComponent,
        private checkFile : CheckFile 
    ) { }

    @ViewChild(WorkAreasComponent) viewWorkArea : WorkAreasComponent;

    ngOnInit(): void {
        const id_proyek = this.activeRoute.snapshot.paramMap.get('id');
        this.workType = this.activeRoute.snapshot.paramMap.get('work');
        this.reportService.getProjectSummaryById(id_proyek)
        .subscribe(({data} : any) => {
            const { proyek : { kapal : { nama_kapal }, tahun, status } } = data;
            const projectTitle = `${ nama_kapal } -DD- ${ tahun } ${status}`;
            this.reportSummary = { ...data, projectTitle };
            this.generateTableData(this.reportSummary[this.workType]);
        });
    }

    public workAreaData : any;
    public reportSummary : any;

    public workType : any;
    tableDetails = {style :{ width : '1200px', "max-height" : '1000px' }, currency : 'currency',
    button : [
        { name : 'Save All Progress'}
    ]};
    tableHead = [ 
        { type : 'text', placeholder : 'Job Number' },
        { type : 'text', placeholder : 'Job Name' },
        { type : 'text', placeholder : 'Last Progress', unsort : true },
        { type : 'text', placeholder : 'Last Update', unsort : true },
        { type : 'text', placeholder : 'Update Progress', unsort : true },
        { type : 'text', placeholder : 'Remarks', unsort : true },
        { type : 'text', placeholder : 'Action', unsort : true },
    ];

    columnType = [ 
        { type : 'numb', width : 80, prop : 'jobNumber' }, 
        { type : 'text', width : 150, prop : 'jobName' }, 
        { type : 'text', width : 80, prop : 'last_progress' }, 
        { type : 'text', width : 80, prop : 'last_update' }, 
        { type : 'updtProg', width : 100, prop : 'progress' }, 
        { type : 'updtRem', width : 250, prop : 'remarks' }, 
        { type : 'addFile', width : 50, prop : 'edit',
            button : [
                { name : 'Add Attachment', icon : 'file-outline', status : 'success' },
            ] 
        },
    ];

    generateTableData(workArea) {
        let jobItem = [];
        if(this.commonFunction.arrayNotEmpty(workArea))
            this.commonFunction.collectItem(workArea, (job) => jobItem.push(job))

        this.workAreaData = jobItem.map(job => ({
            ...job, last_progress : job.progress.at(-1).progress 
        }))
        .filter(job => job.items.length == 0)
        .map((job, id) => ({...job, rowIndex : id}));
    }

    handleClickButton(title, data = null) {
        if(title == 'Save All Progress') this.saveProgress(title, data);
        if(title == 'Back To Report') 
        this.router.navigateByUrl(`/pages/report/${this.reportSummary.id_proyek}`)
        if(title == 'Add Supplier') console.log('add supplier')
    }
    
    loadingProgress = false;
    saveProgress(title, data) {
        this.loadingProgress = true;
        const { work_area, updated_data } = data;
        updated_data.forEach(rowIndex => {
            const job = work_area[rowIndex]
            this.reportSummary[this.workType] = this.commonFunction.reconstructDatas({
                workData : this.reportSummary[this.workType],
                newData : job,
                targetIndex : job.id
            });
            this.calculateProgress(job);
        });
        console.log(this.reportSummary[this.workType])
        this.updateWorkArea();
    }

    calculateProgress({newProgress, remarksProgress, id}) {
        let jobData;
        this.commonFunction.reconstructDatas({
            workData : this.reportSummary[this.workType],
            targetIndex : id.toString(),
            getData : (job) => jobData = job
        })

        let { progress, items, jobNumber } = jobData;
        const last_progress = parseFloat(progress?.at(-1)?.progress)  || 0;
        if(items?.length > 0) newProgress = parseFloat(newProgress)  / items.length;

        if(typeof progress != 'object') progress = [];
        const date = this.commonFunction.transformDate(new Date(), 'dd-MM-yyyy hh-mm a') 
        const { nama_lengkap : updatedBy } = JSON.parse(localStorage.getItem('user'));
        if(newProgress) progress.push({ 
            progress : parseFloat(last_progress + newProgress).toFixed(2), 
            date, updatedBy, remarksProgress 
        });
        const last_update = this.commonFunction.transformDate(new Date(), 'dd-MM-yyyy hh-mm a')

        jobData = {...jobData, progress, last_update}

        this.reportSummary[this.workType] = this.commonFunction.reconstructDatas({
            workData : this.reportSummary[this.workType],
            newData : jobData,
            targetIndex : id
        });

        if(id.split('.').length > 1) {
            id = id.toString().replace(/[.]+(?<=[.])\d*(?![\d, .])/g, '');
            remarksProgress = `Update job number ${jobNumber} in log number ${progress.length}`;
            this.calculateProgress({newProgress, remarksProgress, id})
        }
    }

    updateWorkArea() {
        const {id_proyek, work_area, variant_work} = this.reportSummary;
        if(this.workType == 'work_area') 
            this.reportService.updateReportWorkArea({work_area}, id_proyek)
            .subscribe(
                () => {},
                () => this.toastr.onError('Update progress failed.'),
                () => {
                    this.toastr.onSuccess('Your progress has been updated.');
                    this.generateTableData(this.reportSummary[this.workType])
                    setTimeout(() => {
                        this.viewWorkArea.setWorkArea(this.workAreaData)    
                        this.loadingProgress = false;
                    } , 300);
                }
            )


        if(this.workType == 'variant_work') 
            this.reportService.updateReportWorkArea({variant_work}, id_proyek)
            .subscribe(
                () => {},
                () => this.toastr.onError('Update progress failed.'),
                () => {
                    this.toastr.onSuccess('Your progress has been updated.');
                    this.generateTableData(this.reportSummary[this.workType])
                    setTimeout(() => {
                        this.viewWorkArea.setWorkArea(this.workAreaData)
                        this.loadingProgress = false;
                    } ,300);
                }
            )
    }
}