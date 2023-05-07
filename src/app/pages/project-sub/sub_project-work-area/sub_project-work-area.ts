import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { Subject } from "rxjs";
import { WorkAreasDialogComponent } from "../../../component/work-areas/work-areas-dialog/work-areas-dialog.component";
import { takeUntil } from "rxjs/operators";
import { CommonFunction, ReplaceData } from "../../../component/common-function/common-function";
import { WorkAreasComponent } from "../../../component/work-areas/work-areas.component";
import { ProjectService } from "../../project/project.service";
import { ToastrComponent } from "../../../component/toastr-component/toastr.component";
import { DeleteDialogComponent } from "../../../component/delete-dialog/delete-dialog.component";

@Component({
    selector: 'ngx-sub-project-work-area',
    templateUrl: './sub_project-work-area.html',
})
export class SubProjectWorkArea implements OnInit{
    constructor(
        public commonFunction : CommonFunction,
        public replaceData : ReplaceData,
        private projectService : ProjectService,
        private toastr : ToastrComponent
    ) { }

    ngOnInit(): void {
        const { work_area, mata_uang } = this.projectData;
        this.tableDetails = this.replaceData.replace(this.tableDetails, 'currency', mata_uang + ' ', 'currency')
        if(this.commonFunction.arrayNotEmpty(work_area)) this.workAreaData = work_area
    }

    @Output("refresh") refreshPage: EventEmitter<any> = new EventEmitter();
    @ViewChild(WorkAreasComponent) viewWorkArea : WorkAreasComponent;
    @Input() projectData : any = {};

    private destroy$: Subject<void> = new Subject<void>();

    workAreaData = [];
    tableDetails = {style :{ width : '1800px', "max-height" : '300px' }, currency : 'currency'};
    columnType = [ 
        { type : 'numb', width : 100, prop : 'jobNumber' }, 
        { type : 'text', width : 150, prop : 'rank' }, 
        { type : 'text', width : 300, prop : 'jobName' }, 
        { type : 'text', width : 150, prop : 'department' }, 
        { type : 'date', width : 200, prop : 'startBudget' }, 
        { type : 'date', width : 200, prop : 'endBudget' },
        { type : 'text', width : 200, prop : 'volumeBudget' },
        { type : 'text', width : 200, prop : 'unit' },
        { type : 'curr', width : 200, prop : 'unitPriceBudget' },
        { type : 'text', width : 200, prop : 'totalPriceBudget' },
        { type : 'text', width : 200, prop : 'category' },
        { type : 'text', width : 200, prop : 'remarks' },
        { type : 'resp', width : 200, prop : 'responsible' },
        { type : 'butt', width : 200, prop : 'edit' ,
            button : [
                { name : 'Add Sub Job', icon : 'plus-outline', status : 'success'},
                { name : 'Update Job', icon : 'edit-outline', status : 'info'},
                { name : 'Delete Job', icon : 'trash-outline', status : 'danger'},
            ] 
        },
    ]
    
    tableHead = [   
        { type : 'text', placeholder : 'Job Number' },
        { type : 'text', placeholder : 'Rank' },
        { type : 'text', placeholder : 'Job Name' },
        { type : 'text', placeholder : 'Department' },
        { type : 'text', placeholder : 'Start' },
        { type : 'text', placeholder : 'Stop' },
        { type : 'text', placeholder : 'Vol' },
        { type : 'text', placeholder : 'Unit' },
        { type : 'text', placeholder : 'Price Budget' },
        { type : 'text', placeholder : 'Total Price Budget' },
        { type : 'text', placeholder : 'Category' },
        { type : 'text', placeholder : 'Remarks' },
        { type : 'text', placeholder : 'Responsible' },
        { type : 'text', placeholder : '' },
    ];
    
    workAreaNavButton = ["Add Job" ,"Extend","Refresh","Import"]

    handleClickButton(button, data = null) {
        switch(button) {
            case 'Add Job':
            case 'Add Sub Job':
            case 'Update Job':
                this.updateWorkAreaDialog(button, data);
            break;
            case 'Delete Job':
                this.deleteJobDialog(button, data);
            break;
            case 'Extend':
                this.extendTable(true);
            break;
            case 'Reduce':
                this.extendTable(false);
            break;
            case 'Refresh':
                this.refreshPage.emit();
            break;
            case 'Import':
            break;
        }
    }

    extendTable(conds) {
        this.workAreaNavButton = 
        conds 
        ? this.replaceData.replace(this.workAreaNavButton, "Extend", "Reduce")
        : this.replaceData.replace(this.workAreaNavButton, "Reduce", "Extend")
        this.viewWorkArea.extendOrReduce()
    }

    updateWorkAreaDialog(title, data) {
        if(!data) data = this.projectData;
        this.commonFunction.openDialog({
            dialogData : { 
                title,
                data,
                label : 'Budget',
            },
            component : WorkAreasDialogComponent
        })
        .onClose
        .pipe(takeUntil(this.destroy$))
        .subscribe(newData => this.onUploadData(title, newData));
    }

    deleteJobDialog(title, data) {
        this.commonFunction.openDialog({
            dialogData : { 
                title,
                name : data.jobName,
                id : data,
            },
            component : DeleteDialogComponent
        })
        .onClose
        .pipe(takeUntil(this.destroy$))
        .subscribe(newData => this.onUploadData(title, newData));
    }

    onUploadData(title, data) {
        console.log('title', title)
        console.log('data', data)
        if(!data) return;
        if(title == 'Add Job') {
            let {work_area} = this.projectData;
            work_area = this.commonFunction.reconstructDatas({
                workData : work_area, 
                newData : data
            })
            this.projectService.updateProjectWorkArea({work_area}, this.projectData.id_proyek)
            .subscribe(() => 
            () => this.toastr.onUpload(),
            () => this.toastr.onError(),
            () => {
                this.toastr.onSuccess(`Your job ${data.jobName} has been added`);
                this.refreshPage.emit();
                this.viewWorkArea.setWorkArea(work_area)
                }
            )
        }

        if(title == 'Delete Job') {
            let {work_area} = this.projectData;
            work_area = this.commonFunction.reconstructDatas({
                workData : work_area, 
                targetIndex : data.id,
                status : 'delete'
            })
            console.log(work_area)
            this.projectService.updateProjectWorkArea({work_area}, this.projectData.id_proyek)
            .subscribe(() => 
            () => this.toastr.onUpload(),
            () => this.toastr.onError(),
            () => {
                this.toastr.onSuccess(`Your job ${data.jobName} has been deleted`);
                this.refreshPage.emit();
                this.viewWorkArea.setWorkArea(work_area)
                }
            )
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}