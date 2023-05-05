import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonFunction } from "../../../component/common-function/common-function";
import { ProjectDialogComponent } from "../project-dialog/project-dialog.component";
import { DeleteDialogComponent } from "../../../component/delete-dialog/delete-dialog.component";
import { take, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { ProjectService } from "../project.service";
import { ToastrComponent } from "../../../component/toastr-component/toastr.component";

@Component({
    selector: 'ngx-project-list-project',
    templateUrl: './project-list-project.html',
})
export class ProjectListProject{
    constructor(
        public commonFunction : CommonFunction,
        private projectService : ProjectService,
        private toastr : ToastrComponent,
    ) {}

    private destroy$: Subject<void> = new Subject<void>();
    @Input() projectData;
    @Output("refresh") refreshProject: EventEmitter<any> = new EventEmitter();


    columns = [
        { name: 'Project Name', type : 'title', prop : 'projectTitle', width : 420},
        { name : '', type : 'button', prop : 'projectTitle', width : 150,
          button :  [ {icon : 'trash-2-outline', menu : 'Delete Project'},
                      {icon : 'copy-outline', menu : 'Copy Project'} ], 
        },
        { name: 'R', type : 'phase', prop : 'phaseStatus', width : 40},
        { name: 'P', type : 'phase', prop : 'phaseStatus', width : 40},
        { name: 'E', type : 'phase', prop : 'phaseStatus', width : 40},
        { name: 'F', type : 'phase', prop : 'phaseStatus', width : 80},
        { name: 'Start', type : 'date', prop : 'off_hire_start', width : 280},
        { name: 'End', type : 'date', prop : 'off_hire_end', width : 280}
    ];
    
    handleButtonClick(button, data = null){
        if(button == 'Add Project') this.addProjectDialog(button)
        if(button == 'Delete Project') this.deleteProjectDialog(button, data)
        if(button == 'Copy Project') this.copyProject(button, data)
    }

    addProjectDialog(title) {
        this.commonFunction.openDialog({
            dialogData : { title },
            component : ProjectDialogComponent 
        })
        .onClose
        .pipe(takeUntil(this.destroy$), take(1))
        .subscribe(data => this.onUploadData(data, title));
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
        .pipe(takeUntil(this.destroy$), take(1))
        .subscribe(data => this.onUploadData(data, title));
    }

    copyProject(title, data) {
        
    }

    onUploadData(data, title) {
        console.log(data)
        return
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

        subscribe = this.projectService.addDataProject(uploadData)
        successMsg = 'Your Project has been added.'
        }

        if(title == 'Update Project') {
        subscribe = this.projectService.updateProject(data)
        successMsg = 'Your Project has been updated.'
        }

        if(title == 'Delete Project') {
        subscribe = this.projectService.deleteProject(data)
        successMsg = 'Your Project has been deleted.'
        }

        if(title == 'Copy Project') {
        subscribe = this.projectService.addDataProject(data)
        successMsg = 'Your Project has been copied.'
        }
        
        subscribe
        .pipe(takeUntil(this.destroy$), take(1))
        .subscribe(
        () => {
            this.toastr.onUpload()
            this.refreshProject.emit();
        },
        () => this.toastr.onError(errorMsg),
        () => this.toastr.onSuccess(successMsg)
        );
    }
}