import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { Subject } from "rxjs";
import { CommonFunction, ReplaceData } from "../../../../component/common-function/common-function";
import { takeUntil } from "rxjs/operators";
import { WorkAreasComponent } from "../../../../component/work-areas/work-areas.component";
import { ExportToExcel } from "../../../../component/common-function/export-excel";
import { WorkVariantDetailDialog } from "../work-variant-detail-dialog/work-variant-detail-dialog";

@Component({
    selector: 'ngx-report-work-progress',
    templateUrl: './report-work-progress.html',
})
export class ReportWorkProgress implements OnInit { 
    constructor(
        private commonFunction : CommonFunction,
        private replaceData : ReplaceData,
        private exportToExcel : ExportToExcel,
    ) { }

    ngOnInit(): void {
        this.workAreaData = this.summaryData.work_area;
        const currency = this.summaryData.proyek.mata_uang;
        this.tableDetails = this.replaceData
        .replace(this.tableDetails, 'currency', currency + " " , 'currency')
    }
    
    public workProgressNavButton = [
        { name : 'Refresh', icon: 'refresh' }, 
        { name : 'Export to Excel', icon: 'external-link' }, 
        { name : 'Extend', icon: 'chevron-down-outline' },
        { name : 'Send Notification', icon: 'paper-plane-outline' }, 
    ]

    @Output("refresh") refreshPage: EventEmitter<any> = new EventEmitter();
    @Output("sendNotification") sendNotification : EventEmitter<any> = new EventEmitter();
    @ViewChild(WorkAreasComponent) viewWorkArea : WorkAreasComponent;
    @Input() summaryData;
    private destroy$: Subject<void> = new Subject<void>();

    workAreaData : any ;
    tableDetails = {style :{ width : '3200px', "max-height" : '300px' }, 
        button : [{ name : 'Save', disabled : false }], currency : 'currency'
    };
    columnType = [ 
        { type : 'numb', width : 200, prop : 'jobNumber' }, 
        { type : 'icon', width : 80, prop : 'rank' ,
            icon : [ 
                {name : 'info-outline', color : 'rankColor', popOver : 'rank'},
            ]
        }, 
        { type : 'navto', width : 400, prop : 'jobName', title : 'Nav To' }, 
        { type : 'progress', width : 250, prop : 'progress' }, 
        { type : 'text', width : 150, prop : 'startActual' }, 
        { type : 'text', width : 200, prop : 'endActual' }, 
        { type : 'text', width : 200, prop : 'volume' },
        { type : 'text', width : 200, prop : 'unit' },
        { type : 'text', width : 200, prop : 'unitPriceActual' },
        { type : 'text', width : 200, prop : 'totalPriceActual' },
        { type : 'text', width : 200, prop : 'category' },
        { type : 'text', width : 400, prop : 'remarks' },
        { type : 'text', width : 200, prop : 'suplier' },
        { type : 'butt', width : 100, prop : 'approved' ,
        button : [
                { name : 'By Ship Yard', icon : 'square-outline', status : 'basic', disabled : false, size : 'tiny'},
                { name : 'By Owner', icon : 'square-outline', status : 'basic', disabled : false, size : 'tiny'},
            ] 
        },
        { type : 'butt', width : 100, prop : 'edit',
            button : [
                { name : 'Update Job', icon : 'edit-outline', status : 'info'},
                { name : 'Export PDF', icon : 'file-outline', status : 'primary'},
            ] 
        },
    ]

    tableHead = [ 
        { type : 'text', placeholder : 'Job Number' },
        { type : 'text', placeholder : 'Rank' },
        { type : 'text', placeholder : 'Job Name' },
        { type : 'text', placeholder : '%' },
        { type : 'text', placeholder : 'Start' },
        { type : 'text', placeholder : 'Stop' },
        { type : 'text', placeholder : 'Volume' },
        { type : 'text', placeholder : 'Unit' },
        { type : 'text', placeholder : 'Unit Price Actual' },
        { type : 'text', placeholder : 'Total Price Actual' },
        { type : 'text', placeholder : 'Category' },
        { type : 'text', placeholder : 'Remarks' },
        { type : 'text', placeholder : 'Supplier' },
        { type : 'text', placeholder : 'Approved' },
        { type : 'text', placeholder : '' },

    ]

    handleClickButton(title, data = null) {
        if(title == 'Refresh') this.refreshPage.emit();
        if(title == 'Export to Excel') this.exportDataExcel()
        if(title == 'Extend') this.extendTable(true)
        if(title == 'Reduce') this.extendTable(false)
        if(title == 'Nav To') this.workProgressDetail()
        if(title == 'Send Notification') 
        this.sendNotification.emit({work_area : this.workAreaData, label : "Actual"})
    }

    exportDataExcel() {
        const {kapal : {nama_kapal}, tahun, status} = this.summaryData.proyek;
        const exelFileName = `${nama_kapal} -DD- ${tahun} - ${status} Progress`;
        this.exportToExcel.exportToExcel(this.workAreaData, "Actual", exelFileName);
    }
    
    extendTable(conds) {
        if(conds) {
            this.workProgressNavButton = this.replaceData
            .replace(this.workProgressNavButton, "Extend", "Reduce", 'name')
            this.workProgressNavButton = this.replaceData
            .replace(this.workProgressNavButton, "chevron-down-outline", "chevron-right-outline", 'icon')
        }
        if(!conds) {
            this.workProgressNavButton = 
            this.replaceData.replace(this.workProgressNavButton, "Reduce", "Extend", 'name')
            this.workProgressNavButton = this.replaceData
            .replace(this.workProgressNavButton, "chevron-right-outline", "chevron-down-outline", 'icon')
        }
        this.viewWorkArea.extendOrReduce()
    }

    workProgressDetail(title = "Work Progress Detail") {
        this.commonFunction.openDialog({
            dialogData : { 
              title,
              data : this.summaryData
            },
            component : WorkVariantDetailDialog
        })
    }

    onUploadData(title, data) {

    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

}