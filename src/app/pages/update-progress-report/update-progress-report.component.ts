import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ReportService } from "../report/report.service";
import { CommonFunction } from "../../component/common-function/common-function";
import { WorkAreasComponent } from "../../component/work-areas/work-areas.component";

@Component({
    selector: 'update-progress-report',
    templateUrl: './update-progress-report.component.html',
})
export class UpdateProgressReport implements OnInit {
    constructor(
        private activeRoute : ActivatedRoute,
        private reportService : ReportService,
        private commonFunction : CommonFunction,
        private router : Router
    ) { }

    @ViewChild(WorkAreasComponent) viewWorkArea : WorkAreasComponent;

    ngOnInit(): void {
        const id_proyek = this.activeRoute.snapshot.paramMap.get('id');
        const work = this.activeRoute.snapshot.paramMap.get('work');
        this.reportService.getProjectSummaryById(id_proyek)
        .subscribe(({data} : any) => {
            const { proyek : { kapal : { nama_kapal }, tahun, status } } = data;
            const projectTitle = `${ nama_kapal } -DD- ${ tahun } ${status}`;
            let jobItem = [];
            if(this.commonFunction.arrayNotEmpty(data[work]))
            this.commonFunction.collectItem(data[work], (job) => jobItem.push(job))
            this.workAreaData = jobItem.map(job => ({
                 ...job, last_progress : job.progress.at(-1).progress 
            })).filter(job => job.items.length == 0 );
            this.reportSummary = { ...data, projectTitle }
        }) 
    }

    tableDetails = {style :{ width : '1800px', "max-height" : '1000px' }, 
        button : [{ name : 'Save All', data : 'work_area' }], currency : 'currency'
    };

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
        { type : 'numb', width : 100, prop : 'jobNumber' }, 
        { type : 'text', width : 300, prop : 'jobName' }, 
        { type : 'text', width : 50, prop : 'last_progress' }, 
        { type : 'text', width : 100, prop : 'last_update' }, 
        { type : 'updtProg', width : 80, prop : 'progress' }, 
        { type : 'updtRem', width : 180, prop : 'remarks' }, 
        { type : 'butt', width : 50, prop : 'edit',
            button : [
                { name : 'Update All Progress', icon : 'save-outline', status : 'success'},
            ] 
        },
    ];

    handleClickButton(title, data = null) {
        if(title == 'Update All Progress') this.saveProgress(title, data);
        if(title == 'Back To Report') 
        this.router.navigateByUrl(`/pages/report/${this.reportSummary.id_proyek}`)
    }

    savePerJob : any[] = [];
    saveProgress(title, data) {
        let { newProgress, remarksProgress, progress } = data;
        if(typeof progress != 'object') progress = [];
        const date = this.commonFunction.transformDate(new Date()) 
        const { nama_lengkap } = JSON.parse(localStorage.getItem('user'));
        const jobProgress = { progress : newProgress, date, updatedBy : nama_lengkap, remarksProgress } 
        if(newProgress) progress.push(jobProgress);


        this.savePerJob.push({...data, progress : jobProgress})
        this.workAreaData = this.workAreaData.filter(job => job.id != data.id);
        this.viewWorkArea.setWorkArea(this.workAreaData);
    }

    calculateProgress() {
        
    }

    public workAreaData : any;
    public reportSummary : any;
}