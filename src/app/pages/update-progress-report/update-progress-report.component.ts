import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ReportService } from "../report/report.service";
import { CommonFunction, ReplaceData } from "../../component/common-function/common-function";
import { WorkAreasComponent } from "../../component/work-areas/work-areas.component";
import { ToastrComponent } from "../../component/toastr-component/toastr.component";

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
        private replace : ReplaceData
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
            this.generateTableData(data);
        });
    }

    public workAreaData : any;
    public reportSummary : any;

    public workType : any;
    tableDetails = {style :{ width : '1000px', "max-height" : '1000px' }, currency : 'currency'};
    tableHead = [ 
        { type : 'text', placeholder : 'Job Number' },
        { type : 'text', placeholder : 'Job Name' },
        { type : 'text', placeholder : 'Last Progress', unsort : true },
        { type : 'text', placeholder : 'Last Update', unsort : true },
        { type : 'text', placeholder : 'Update Progress', unsort : true },
        { type : 'text', placeholder : 'Remarks', unsort : true },
        { type : 'text', placeholder : '', unsort : true },
    ];

    columnType = [ 
        { type : 'numb', width : 50, prop : 'jobNumber' }, 
        { type : 'text', width : 100, prop : 'jobName' }, 
        { type : 'text', width : 50, prop : 'last_progress' }, 
        { type : 'text', width : 80, prop : 'last_update' }, 
        { type : 'updtProg', width : 80, prop : 'progress' }, 
        { type : 'updtRem', width : 230, prop : 'remarks' }, 
        { type : 'updtButt', width : 50, prop : 'edit',
            button : [
                { name : 'Save Progress', icon : 'save-outline', status : 'success' },
            ] 
        },
    ];

    generateTableData(data) {
        let jobItem = [];
        if(this.commonFunction.arrayNotEmpty(data[this.workType]))
            this.commonFunction.collectItem(data[this.workType], (job) => jobItem.push(job))
        this.workAreaData = jobItem.map(job => ({
            ...job, last_progress : job.progress.at(-1).progress 
        })).filter(job => job.items.length == 0);
        // if(this.workAreaData)
        // this.viewWorkArea.setWorkArea(this.workAreaData);
    }

    handleClickButton(title, data = null) {
        if(title == 'Save Progress') this.saveProgress(title, data);
        if(title == 'Back To Report') 
        this.router.navigateByUrl(`/pages/report/${this.reportSummary.id_proyek}`)
        if(title == 'Add Supplier') console.log('add supplier')
    }

    saveProgress(title, data) {
        if(!data.newProgress) return this.toastr.onWarning({
            warnmsg : 'Please input update progress field and remarks fiels!',
            duration : 2000
        })

        this.calculateProgress(data);
        this.updateWorkArea();
        this.generateTableData(this.reportSummary)
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
            progress : parseFloat(last_progress + newProgress).toFixed(2)  , 
            date, updatedBy, remarksProgress 
        });
        jobData = {...jobData, progress}

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
                () => this.toastr.onUpload(),
                () => this.toastr.onError('Update progress failed.'),
                () => {
                    this.toastr.onSuccess('Your progress has been updated.');
                    this.viewWorkArea.setWorkArea(this.workAreaData);
                }
            )


        if(this.workType == 'variant_work') 
            this.reportService.updateReportWorkArea({variant_work}, id_proyek)
            .subscribe(
                () => this.toastr.onUpload(),
                () => this.toastr.onError('Update progress failed.'),
                () => {
                    this.toastr.onSuccess('Your progress has been updated.');
                    this.viewWorkArea.setWorkArea(this.workAreaData);
                }
            )
    }
}