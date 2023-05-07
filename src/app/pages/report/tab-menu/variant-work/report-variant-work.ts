import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonFunction } from "../../../../component/common-function/common-function";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: 'ngx-report-variant-work',
    templateUrl: './report-variant-work.html',
})
export class ReportVariantWork { 
    constructor(
        private commonFunction : CommonFunction,
    ) { }

    ngOnInit(): void {
    }

    public variantWorkNavButton = [
        { name : 'Refresh', icon: 'refresh' }, 
        { name : 'Export to Excel', icon: 'external-link' }, 
        { name : 'Expand', icon: 'arrow-ios-downward-outline' },
        { name : 'Send Notification', icon: 'paper-plane-outline' }, 
        { name : 'Add Job', icon: 'briefcase-outline' },
    ]
    
    @Output("refresh") refreshPage: EventEmitter<any> = new EventEmitter();
    @Input() workAreaData;
    private destroy$: Subject<void> = new Subject<void>();
    
    tableDetails = {style :{ width : '1800px', "max-height" : '300px' }, 
        button : [{ name : 'Save', disabled : false }]
    };
    columnType = [ 
        { type : 'number', width : 100, prop : 'jobNumber' }, 
        { type : 'text', width : 150, prop : 'rank' }, 
        { type : 'text', width : 150, prop : 'jobName' }, 
        { type : 'text', width : 250, prop : 'department' }, 
        { type : 'text', width : 150, prop : 'startAddOn' }, 
        { type : 'text', width : 200, prop : 'endAddOn' }, 
        { type : 'text', width : 200, prop : 'volume' },
        { type : 'text', width : 200, prop : 'unit' },
        { type : 'text', width : 200, prop : 'unitPriceAddOn' },
        { type : 'text', width : 200, prop : 'totalPriceAddOn' },
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
        if(title == 'Add Job') console.log(title)
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