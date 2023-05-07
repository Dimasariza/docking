import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Subject } from "rxjs";
import { CommonFunction } from "../../../../component/common-function/common-function";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: 'ngx-report-work-progress',
    templateUrl: './report-work-progress.html',
})
export class ReportWorkProgress implements OnInit { 
    constructor(
        private commonFunction : CommonFunction,
    ) { }

    ngOnInit(): void {
    }
    
    public workProgressNavButton = [
        { name : 'Refresh', icon: 'refresh' }, 
        { name : 'Export to Excel', icon: 'external-link' }, 
        { name : 'Expand', icon: 'arrow-ios-downward-outline' },
        { name : 'Send Notification', icon: 'paper-plane-outline' }, 
    ]

    @Output("refresh") refreshPage: EventEmitter<any> = new EventEmitter();
    private destroy$: Subject<void> = new Subject<void>();
    @Input() workAreaData;

    tableDetails = {style :{ width : '1800px', "max-height" : '300px' }, 
        button : [{ name : 'Save', disabled : false }]
    };
    columnType = [ 
        { type : 'numb', width : 100, prop : 'jobNumber' }, 
        { type : 'text', width : 150, prop : 'rank' }, 
        { type : 'text', width : 150, prop : 'jobName' }, 
        { type : 'text', width : 250, prop : 'department' }, 
        { type : 'text', width : 150, prop : 'startActual' }, 
        { type : 'text', width : 200, prop : 'endActual' }, 
        { type : 'text', width : 200, prop : 'volume' },
        { type : 'text', width : 200, prop : 'unit' },
        { type : 'text', width : 200, prop : 'unitPriceActual' },
        { type : 'text', width : 200, prop : 'totalPriceActual' },
        { type : 'text', width : 200, prop : 'category' },
        { type : 'text', width : 200, prop : 'remarks' },
        { type : 'text', width : 200, prop : 'approved' },
        { type : 'text', width : 200, prop : 'edit' },
    ]

    tableHead = [ 
        { type : 'text', placeholder : 'Job Number' },
        { type : 'text', placeholder : 'Rank' },
        { type : 'text', placeholder : 'Job Name' },
        { type : 'text', placeholder : 'Department' },
        { type : 'text', placeholder : 'Start' },
        { type : 'text', placeholder : 'Stop' },
        { type : 'text', placeholder : 'Volume' },
        { type : 'text', placeholder : 'Unit' },
        { type : 'text', placeholder : 'Unit Price Contract' },
        { type : 'text', placeholder : 'Total Price Contract' },
        { type : 'text', placeholder : 'Category' },
        { type : 'text', placeholder : 'Remarks' },
        { type : 'text', placeholder : 'Approval' },
        { type : 'text', placeholder : 'Edit' },
    ]

    handleClickButton(title, data = null) {
        if(title == 'Refresh') console.log(title)
        if(title == 'Export to Excel') console.log(title)
        if(title == 'Expand') console.log(title)
        if(title == 'Reduce') console.log(title)
        if(title == 'Send Notification') console.log(title)
    }

    addSuplierDialog(title, data) {
        this.commonFunction.openDialog({
            dialogData : { title },
            component : 'ProjectDialogComponent' 
        })
        .onClose
        .pipe(takeUntil(this.destroy$))
        .subscribe(newData => this.onUploadData(title, newData));
    }

    onUploadData(title, data) {

    }

}