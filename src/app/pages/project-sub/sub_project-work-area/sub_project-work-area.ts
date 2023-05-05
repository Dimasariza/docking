import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Subject } from "rxjs";
import { WorkAreasDialogComponent } from "../../../component/work-areas/work-areas-dialog/work-areas-dialog.component";
import { take, takeUntil } from "rxjs/operators";
import { CommonFunction } from "../../../component/common-function/common-function";

@Component({
    selector: 'ngx-sub-project-work-area',
    templateUrl: './sub_project-work-area.html',
})
export class SubProjectWorkArea implements OnInit{
    constructor(
        public commonFunction : CommonFunction
    ) {
    }

    ngOnInit(): void {
        const { work_area } = this.projectData;
        if(this.commonFunction.arrayNotEmpty(work_area))
        this.workAreaData = work_area.map(work => {
            this.allColumns.forEach(column => work?.[column] ? null : work[column] = "");
            return work;
        })
        this.dataTable = this.commonFunction.populateData(this.workAreaData, false)
    }

    @Output("refresh") refreshProject: EventEmitter<any> = new EventEmitter();
    @Input() projectData;

    private destroy$: Subject<void> = new Subject<void>();

    changingValue: Subject<boolean> = new Subject();
    workAreaData = [];
    
    dataTable : any;  
    tableDetails = {style :{ width : '1800px', "max-height" : '300px' }, searchBar : true};
    allColumns = [ 'jobNumber', 'rank', 'jobName', 'department', 'start', 'stop', 
    'volume', 'unit', 'budget', 'totalBudget', 'category', 'remarks', 'responsible', 'edit' ]; 
    columnType = [ 
        { type : 'number', width : 100 }, 
        { type : 'text', width : 150 }, 
        { type : 'text', width : 300 }, 
        { type : 'text', width : 150 }, 
        { type : 'text', width : 200 }, 
        { type : 'text', width : 200 },
        { type : 'text', width : 200 },
        { type : 'text', width : 200 },
        { type : 'text', width : 200 },
        { type : 'text', width : 200 },
        { type : 'text', width : 200 },
        { type : 'text', width : 200 },
        { type : 'text', width : 200 },
        { type : 'text', width : 200 },
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
        { type : 'text', placeholder : 'Edit' },
    ];

    workAreaNavButton = ["Add Job" ,"Extend","Refresh","Import"]

    onHandleClick(button, data = null) {
        if(button == 'Add Job') this.addJobDialog(button)
        if(button == 'Extend')  this.extendTable(true)
        if(button == 'Reduce')  this.extendTable(false)
        if(button == 'Refresh') this.refreshProject.emit();
        if(button == 'Import')  return
    }

    extendTable(conds) {
        conds 
        ? this.workAreaNavButton[1] = "Reduce"
        : this.workAreaNavButton[1] = "Extend"
        this.dataTable = this.commonFunction.populateData(this.workAreaData, conds)    
        this.changingValue.next(this.dataTable);
    }

    addJobDialog(title) {
        this.commonFunction.openDialog({
            dialogData : { title },
            component : WorkAreasDialogComponent
        })
        .onClose
        .pipe(takeUntil(this.destroy$), take(1))
        .subscribe(data => this.onUploadData(data, title));
    }

    onUploadData(data, title) {
        console.log(data)
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}