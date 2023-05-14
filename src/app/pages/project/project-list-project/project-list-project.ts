import { Component, EventEmitter, Input, OnDestroy, Output } from "@angular/core";
import { CommonFunction } from "../../../component/common-function/common-function";
import { ProjectDialogComponent } from "../project-dialog/project-dialog.component";
import { DeleteDialogComponent } from "../../../component/delete-dialog/delete-dialog.component";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { ProjectService } from "../project.service";
import { ToastrComponent } from "../../../component/toastr-component/toastr.component";
import { Router } from "@angular/router";

@Component({
    selector: 'ngx-project-list-project',
    templateUrl: './project-list-project.html',
})
export class ProjectListProject implements OnDestroy {
    constructor(
        public commonFunction : CommonFunction,
        private projectService : ProjectService,
        private toastr : ToastrComponent,
        private router: Router,
    ) {}

    private destroy$: Subject<void> = new Subject<void>();
    @Input() projectData;
    @Output("refresh") refreshPage: EventEmitter<any> = new EventEmitter();

    columns = [
        { name: 'Project Name', type : 'navTo', prop : 'projectTitle', width : 420, title : 'Nav To'},
        { name : '', type : 'button', width : 150, unSort : true,
          button :  [ 
                {icon : 'trash-2-outline', menu : 'Delete Project', status : 'danger'},
                {icon : 'copy-outline', menu : 'Copy Project', status : 'info'} 
            ], 
        },
        { name: 'R', type : 'phase', prop : 'phaseStatus', width : 40, unSort : true},
        { name: 'P', type : 'phase', prop : 'phaseStatus', width : 40, unSort : true},
        { name: 'E', type : 'phase', prop : 'phaseStatus', width : 40, unSort : true},
        { name: 'F', type : 'phase', prop : 'phaseStatus', width : 80, unSort : true},
        { name: 'Start', type : 'date', prop : 'off_hire_start', width : 280},
        { name: 'End', type : 'date', prop : 'off_hire_end', width : 280}
    ];
    
    handleClickButton(button, data = null){
        if(button == 'Add Project') this.addProjectDialog(button)
        if(button == 'Delete Project') this.deleteProjectDialog(button, data)
        if(button == 'Copy Project') this.copyProject(button, data)
        if(button == 'Nav To') 
        this.router.navigateByUrl('/pages/project/sub-menu-project/' + data.id_proyek);
    }

    copyProject(title, data) {
        let { work_area } = data;
        if(!this.commonFunction.arrayNotEmpty(work_area))
        work_area = [null];
        this.projectService.addProject(data)
        .pipe(takeUntil(this.destroy$))
        .subscribe(({id_proyek} : any )  => {
            this.onUploadData('Update Work Area', {work_area, id_proyek})
        })
    }

    addProjectDialog(title) {
        this.commonFunction.openDialog({
            dialogData : { title },
            component : ProjectDialogComponent 
        })
        .onClose
        .pipe(takeUntil(this.destroy$))
        .subscribe(newData => this.onUploadData(title, newData));
    }

    deleteProjectDialog(title, data) {
        this.commonFunction.openDialog({
        dialogData : {
            title,
            name : data.projectTitle,
            id : data.id_proyek
        },
        component : DeleteDialogComponent 
        })
        .onClose
        .pipe(takeUntil(this.destroy$))
        .subscribe(newData => newData ?
            this.onUploadData(title, newData)
            : null
        );
    }

    onUploadData(title, data) {
        if(!data) return;

        let subscribe;
        let successMsg;
        let errorMsg = 'Please try again.';

        if(title == 'Add Project') {
            const { offHirePeriod, repairInDock, repairPeriod } = data;
            const off_hire_start = this.commonFunction.transformDate(offHirePeriod.start);
            const off_hire_end = this.commonFunction.transformDate(offHirePeriod.end);
            const repair_start = this.commonFunction.transformDate(repairInDock.start);
            const repair_end = this.commonFunction.transformDate(repairInDock.end);
            const repair_in_dock_start = this.commonFunction.transformDate(repairPeriod.start);
            const repair_in_dock_end = this.commonFunction.transformDate(repairPeriod.end);

            const uploadData = { ...data, off_hire_start, off_hire_end, 
                repair_start, repair_end, repair_in_dock_start, repair_in_dock_end
            }

            subscribe = this.projectService.addProject(uploadData)
            successMsg = 'Your Project has been added.'
        }

        if(title == 'Update Work Area') {
            const { work_area, id_proyek } = data;
            subscribe = this.projectService.updateProjectWorkArea({work_area}, id_proyek)

        }

        if(title == 'Delete Project') {
            subscribe = this.projectService.deleteProject(data)
            successMsg = 'Your Project has been deleted.'
        }

        if(title == 'Copy Project') {
            subscribe = this.projectService.addProject(data)
            successMsg = 'Your Project has been copied.'
        }
        
        subscribe
        .pipe(takeUntil(this.destroy$))
        .subscribe(
            () => this.toastr.onUpload(),
            () => this.toastr.onError(errorMsg),
            () => {
                this.refreshPage.emit();
                this.toastr.onSuccess(successMsg)
            }
        );
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}