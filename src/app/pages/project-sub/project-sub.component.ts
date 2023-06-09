import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ProjectService } from "../project/project.service";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { ToastrComponent } from "../../component/toastr-component/toastr.component";

@Component({
    selector: 'ngx-project-sub',
    template: `
        <nb-alert *ngIf="handleEvent?.show" 
            [status]="handleEvent?.status" 
            [nbSpinner]="handleEvent?.spinner" 
            nbSpinnerStatus="basic"
        >
            {{handleEvent.text}}
        </nb-alert>

        <ngx-sub-project-summary
            *ngIf="projectData" 
            [projectData]="projectData"
            [allWorkArea]="allWorkArea"
            (refresh)=ngOnInit()
        >
        </ngx-sub-project-summary>

        <ngx-sub-project-work-area 
            *ngIf="projectData" 
            [projectData]="projectData"
            (refresh)=ngOnInit()
        >
        </ngx-sub-project-work-area>
    `,
})
export class ProjectSubComponent implements OnInit{
    constructor(
        private route: ActivatedRoute,
        private projectService : ProjectService,
        private toastr : ToastrComponent,
    ) { }

    public projectData : any;
    public allWorkArea : any;
    private destroy$: Subject<void> = new Subject<void>();

    handleEvent : any;

    ngOnInit(): void {
        const projectId = this.route.snapshot.paramMap.get('id');
        this.projectService.getSubProject(projectId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
            ({data} : any) => {
                const { kapal : {nama_kapal}, tahun, status, 
                    work_area : projectWorkArea = "", report
                } = data || {};
                const projectTitle = `${nama_kapal} -DD- ${tahun} ${status.toUpperCase()}`;
                this.projectData = {...data, projectTitle}
                this.allWorkArea = {projectWorkArea};
                if(!report) return; 
                const { work_area : reportWorkArea = "", variant_work,
                tender : { work_area : tenderWorkArea = "" } } = report;
                this.allWorkArea = {reportWorkArea, variant_work, tenderWorkArea, projectWorkArea}
                const user =  JSON.parse(localStorage.getItem('user'));
            },
            () => this.toastr.onError()
        );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}