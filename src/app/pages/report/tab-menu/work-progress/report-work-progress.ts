import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { Subject } from "rxjs";
import { CommonFunction, ReplaceData } from "../../../../component/common-function/common-function";
import { takeUntil } from "rxjs/operators";
import { WorkAreasComponent } from "../../../../component/work-areas/work-areas.component";
import { ExportToExcel } from "../../../../component/common-function/export-excel";
import { WorkVariantDetailDialog } from "../work-variant-detail-dialog/work-variant-detail-dialog";
import { WorkAreasDialogComponent } from "../../../../component/work-areas/work-areas-dialog/work-areas-dialog.component";
import { ExportToPDF } from "../../export-to-pdf/export-to-pdf";
import { Router } from "@angular/router";
import { ReportService } from "../../report.service";
import { ToastrComponent } from "../../../../component/toastr-component/toastr.component";
import { AddJobSupplierDialog } from "../supplier/addjob-supplier-dialog/addjob-supplier-dialog";

@Component({
    selector: 'ngx-report-work-progress',
    templateUrl: './report-work-progress.html',
})
export class ReportWorkProgress implements OnInit { 
    constructor(
        private commonFunction : CommonFunction,
        private replaceData : ReplaceData,
        private exportToExcel : ExportToExcel,
        private router : Router,
        private reportService : ReportService,
        private toastr : ToastrComponent
    ) { }

    ngOnInit(): void {
        this.workAreaData = this.summaryData.work_area;
        this.generateTableData(this.workAreaData)
        const currency = this.summaryData.proyek.mata_uang;
        this.tableDetails = this.replaceData
        .replace(this.tableDetails, 'currency', currency + " " , 'currency')
    }

    generateTableData(workArea) {
        this.commonFunction.collectItem(workArea, 
            (item) => { 
                this.workAreaData = this.commonFunction.reconstructDatas({
                    workData : workArea,
                    newData : {...item, 
                        last_progress : `${item.progress.at(-1).progress} %`,
                        nama_supplier : item.supplier?.nama_supplier 
                    },
                    targetIndex : item.id
                })
        })
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
    @ViewChild(ExportToPDF) exportToPDF : ExportToPDF; 

    @Input() summaryData;
    @Input() suplierData;
    private destroy$: Subject<void> = new Subject<void>();

    workAreaData : any = [];
    tableDetails = {style :{ width : '3200px', "max-height" : '300px' }, 
        button : [{ name : 'Update Progress', data : 'work_area' }], currency : 'currency'
    };
    columnType = [ 
        { type : 'numb', width : 200, prop : 'jobNumber' }, 
        { type : 'icon', width : 80, prop : 'rank' ,
            icon : [ 
                {name : 'info-outline', color : 'rankColor', popOver : 'rank'},
            ]
        }, 
        { type : 'navto', width : 400, prop : 'jobName', title : 'Nav To' }, 
        { type : 'text', width : 100, prop : 'last_progress' }, 
        { type : 'text', width : 150, prop : 'start' }, 
        { type : 'text', width : 200, prop : 'end' }, 
        { type : 'text', width : 200, prop : 'volume' },
        { type : 'text', width : 200, prop : 'unit' },
        { type : 'text', width : 200, prop : 'unitPriceActual' },
        { type : 'text', width : 200, prop : 'totalPriceActual' },
        { type : 'text', width : 200, prop : 'category' },
        { type : 'text', width : 400, prop : 'remarks' },
        { type : 'text', width : 200, prop : 'nama_supplier' },
        { type : 'butt', width : 70, prop : 'addsupplier',
            button : [
                { name : 'Add Supplier', icon : 'person-add-outline', status : 'info'},
            ] 
        },
        { type : 'approval', width : 100, prop : 'approved' ,
            button : [
                    { name : 'By Ship Yard', disabled : 'shipYardApproval' },
                    { name : 'By Owner', disabled : 'ownerApproval' },
                ] 
        },
        { type : 'butt', width : 100, prop : 'edit',
            button : [
                { name : 'Update Job', icon : 'edit-outline', status : 'info'},
                { name : 'Export To PDF', icon : 'file-outline', status : 'primary'},
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
        { type : 'text', placeholder : '' },
        { type : 'text', placeholder : 'Approved', unsort : true, },
        { type : 'text', placeholder : '', unsort : true, },
    ]

    handleClickButton(title, data = null) {
        if(title == 'Refresh') this.refreshPage.emit();
        if(title == 'Export to Excel') this.exportDataExcel();
        if(title == 'Extend') this.extendTable(true);
        if(title == 'Reduce') this.extendTable(false);
        if(title == 'Nav To') this.workProgressDetail(data);
        if(title == 'Send Notification') 
        this.sendNotification.emit({work_area : this.workAreaData, label : "Actual"});
        if(title == 'Update Job') this.updateReportWorkArea(title, data);
        if(title == 'By Ship Yard') this.approvedByShipYard(title, data);
        if(title == 'By Owner') this.approvedByOwner(title, data);
        if(title == 'Export To PDF') this.exportToPDF.createByJob(data);
        if(title == 'Update Progress')
        this.router.navigateByUrl(`/pages/update-progress/${this.summaryData.id_proyek}/${data}`);
        if(title == 'Add Supplier') this.addSupplierDialog(title, data);
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

    workProgressDetail(data) {
        const title = "Work Progress Detail"
        this.commonFunction.openDialog({
            dialogData : { 
              title, data
            },
            component : WorkVariantDetailDialog
        })
    }

    updateReportWorkArea(title, data) {
        this.commonFunction.openDialog({
            dialogData : { 
              title,
              data : {...data, mata_uang : this.summaryData.proyek.mata_uang},
              label : 'Actual',
            },
            component : WorkAreasDialogComponent
        })
        .onClose
        .pipe(takeUntil(this.destroy$))
        .subscribe(newData => newData 
            ? this.onUploadData('Reconstruct Work Area', newData)
            : null )
    }

    approvedByShipYard(title, data) {
        let approvalData = [{ ...data, shipYardApproval : true }];
        this.commonFunction.collectItem([data], item => {
            approvalData = this.commonFunction.reconstructDatas({
                workData : approvalData,
                newData : { ...item, shipYardApproval : true },
                targetIndex : item.id
            });
        });
        this.onUploadData('Reconstruct Work Area', approvalData[0])
    }

    approvedByOwner(title, data) {
        let approvalData = [{ ...data, ownerApproval : true }];
        this.commonFunction.collectItem([data], item => {
            approvalData = this.commonFunction.reconstructDatas({
                workData : approvalData,
                newData : { ...item, ownerApproval : true },
                targetIndex : item.id
            });
        });
        this.onUploadData('Reconstruct Work Area', approvalData[0])
    }

    addSupplierDialog(title, data) {
        this.commonFunction.openDialog({
            dialogData : { 
              title, 
              data,
              supplier : this.suplierData
            },
            component : AddJobSupplierDialog
        })
        .onClose
        .pipe(takeUntil(this.destroy$))
        .subscribe(newData => newData 
            ? this.onUploadData('Reconstruct Work Area', newData)
            : null )
    }

    onUploadData(title, data) {
        if(!data) return;
        let work_area;
        let successmsg
        if(title == 'Reconstruct Work Area') {
            work_area = this.commonFunction.reconstructDatas({
                workData : this.workAreaData, 
                newData : data,
                targetIndex : data.id,
            })
            successmsg = `Your work area has been updated > ${data.jobName}`
        }

        this.reportService.updateReportWorkArea({work_area}, this.summaryData.id_proyek)
        .subscribe(
            () => {},
            () => this.toastr.onError(),
            () => {
                this.toastr.onSuccess("Your data has been updated.");
                this.generateTableData(work_area);
                this.viewWorkArea.setWorkArea(this.workAreaData);
                this.refreshPage.emit();
            },
        )
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}