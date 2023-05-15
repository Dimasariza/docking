import { Component, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { CommonFunction, ReplaceData } from "../../../../component/common-function/common-function";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { WorkAreasDialogComponent } from "../../../../component/work-areas/work-areas-dialog/work-areas-dialog.component";
import { WorkAreasComponent } from "../../../../component/work-areas/work-areas.component";
import { ReportService } from "../../report.service";
import { ToastrComponent } from "../../../../component/toastr-component/toastr.component";
import { DeleteDialogComponent } from "../../../../component/delete-dialog/delete-dialog.component";
import { ExportToExcel } from "../../../../component/common-function/export-excel";
import { WorkVariantDetailDialog } from "../work-variant-detail-dialog/work-variant-detail-dialog";
import { ExportToPDF } from "../../export-to-pdf/export-to-pdf";
import { ActivatedRoute, Router } from "@angular/router";
import { AddJobSupplierDialog } from "../supplier/addjob-supplier-dialog/addjob-supplier-dialog";

@Component({
    selector: 'ngx-report-variant-work',
    templateUrl: './report-variant-work.html',
})
export class ReportVariantWork { 
    constructor(
        private commonFunction : CommonFunction,
        private reportService : ReportService,
        private toastr : ToastrComponent,
        private replaceData : ReplaceData,
        private exportToExcel : ExportToExcel,
        private router : Router
    ) { }

    ngOnInit(): void {
        this.workAreaData = this.summaryData.variant_work;
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
                        last_progress : `${item?.progress?.at(-1)?.progress} %`|| 0,
                        nama_supplier : item.supplier?.nama_supplier 
                    },
                    targetIndex : item.id
                })
        });
    }

    public variantWorkNavButton = [
        { name : 'Refresh', icon: 'refresh' }, 
        { name : 'Export to Excel', icon: 'external-link' }, 
        { name : 'Extend', icon: 'chevron-down-outline' },
        { name : 'Send Notification', icon: 'paper-plane-outline' }, 
        { name : 'Add Job', icon: 'briefcase-outline' },
        { name : 'Quick Add', icon: 'plus-outline' },
    ]
    
    @Output("refresh") refreshPage: EventEmitter<any> = new EventEmitter();
    @Output("sendNotification") sendNotification : EventEmitter<any> = new EventEmitter();
    @ViewChild(WorkAreasComponent) viewWorkArea : WorkAreasComponent;
    @ViewChild(ExportToPDF) exportToPDF : ExportToPDF 
    @Input() summaryData;
    @Input() suplierData;
    private destroy$: Subject<void> = new Subject<void>();
    
    workAreaData : any = [];
    tableDetails = {style :{ width : '3000px', "max-height" : '300px' }, 
        button : [{ name : 'Update Progress', data : 'variant_work' }], currency : 'currency'
    };
    columnType = [ 
        { type : 'numb', width : 150, prop : 'jobNumber' }, 
        { type : 'icon', width : 80, prop : 'rank' ,
            icon : [ 
                {name : 'info-outline', color : 'rankColor', popOver : 'rank'},
            ]
        }, 
        { type : 'navto', width : 400, prop : 'jobName', title : 'Nav To' }, 
        { type : 'text', width : 200, prop : 'department' }, 
        { type : 'text', width : 200, prop : 'start' }, 
        { type : 'text', width : 200, prop : 'end' }, 
        { type : 'text', width : 100, prop : 'volume' },
        { type : 'text', width : 200, prop : 'unit' },
        { type : 'curr', width : 200, prop : 'unitPriceAddOn' },
        { type : 'text', width : 200, prop : 'totalPriceAddOn' },
        { type : 'text', width : 200, prop : 'category' },
        { type : 'text', width : 300, prop : 'remarks' },
        { type : 'text', width : 200, prop : 'nama_supplier' },
        { type : 'butt', width : 70, prop : 'addsupplier',
            button : [
                { name : 'Add Supplier', icon : 'person-add-outline', status : 'info'},
            ] 
        },
        { type : 'approval', width : 100, prop : 'approved', 
            button : [
                    { name : 'By Ship Yard', disabled : 'shipYardApproval' },
                    { name : 'By Owner', disabled : 'ownerApproval' },
                ] 
        },
        { type : 'butt', width : 200, prop : 'edit', 
            button : [
                { name : 'Add Sub Job', icon : 'plus-outline', status : 'success'},
                { name : 'Update Job', icon : 'edit-outline', status : 'info'},
                { name : 'Delete Job', icon : 'trash-outline', status : 'danger'},
                { name : 'Export To PDF', icon : 'file-outline', status : 'primary'},
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
        { type : 'text', placeholder : 'Volume' },
        { type : 'text', placeholder : 'Unit' },
        { type : 'text', placeholder : 'Unit Price Contract' },
        { type : 'text', placeholder : 'Total Price Contract' },
        { type : 'text', placeholder : 'Category' },
        { type : 'text', placeholder : 'Remarks' },
        { type : 'text', placeholder : 'Supplier' },
        { type : 'text', placeholder : '' },
        { type : 'text', placeholder : 'Approval', unsort : true, },
        { type : 'text', placeholder : '', unsort : true, },
    ]

    handleClickButton(title, data = null) {
        if(title == "Nav To") this.variantWorkDetail(data);
        if(title == 'Refresh') this.refreshPage.emit();
        if(title == 'Export to Excel') this.exportDataExcel();
        if(title == 'Extend') this.extendTable(true);
        if(title == 'Reduce') this.extendTable(false);
        if(title == 'Add Job') this.updateWorkAreaDialog(title, data);
        if(title == 'Add Sub Job') this.updateWorkAreaDialog(title, data);
        if(title == 'Update Job') this.updateWorkAreaDialog(title, data);
        if(title == 'Delete Job') this.deleteJobDialog(title, data);
        if(title == 'Quick Add') this.quickAddWorkArea(title);
        if(title == 'By Ship Yard') this.approvedByShipYard(title, data);
        if(title == 'By Owner') this.approvedByOwner(title, data);
        if(title == 'Send Notification') 
        this.sendNotification.emit({work_area : this.workAreaData, label : "AddOn"});
        if(title == 'Export To PDF') this.exportToPDF.createByJob(data);
        if(title == 'Update Progress')
        this.router.navigateByUrl(`/pages/update-progress/${this.summaryData.id_proyek}/${data}`);
        if(title == 'Add Supplier') this.addSupplierDialog(title, data);
    }

    exportDataExcel() {
        const {kapal : {nama_kapal}, tahun, status} = this.summaryData.proyek;
        const exelFileName = `${nama_kapal} -DD- ${tahun} - ${status} Variant`;
        this.exportToExcel.exportToExcel(this.workAreaData, "AddOn", exelFileName);
    }

    extendTable(conds) {
        if(conds) {
            this.variantWorkNavButton = this.replaceData
            .replace(this.variantWorkNavButton, "Extend", "Reduce", 'name')
            this.variantWorkNavButton = this.replaceData
            .replace(this.variantWorkNavButton, "chevron-down-outline", "chevron-right-outline", 'icon')
        }
        if(!conds) {
            this.variantWorkNavButton = 
            this.replaceData.replace(this.variantWorkNavButton, "Reduce", "Extend", 'name')
            this.variantWorkNavButton = this.replaceData
            .replace(this.variantWorkNavButton, "chevron-right-outline", "chevron-down-outline", 'icon')
        }
        this.viewWorkArea.extendOrReduce()
    }

    updateWorkAreaDialog(title, data) {
        if(!data) data = this.summaryData.proyek;
        this.commonFunction.openDialog({
            dialogData : {
                title,
                data,
                label : "AddOn",
            },
            component : WorkAreasDialogComponent
        })
        .onClose
        .pipe(takeUntil(this.destroy$))
        .subscribe(newData => newData 
            ? this.onUploadData('Reconstruct Work Area', newData)
            : null
        );
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

    quickAddWorkArea(title) {
        this.commonFunction.openDialog({
            dialogData : { 
                title,
                data : this.summaryData.proyek,
                label : 'AddOn',
            },
            component : WorkAreasDialogComponent
        })
        .onClose
        .pipe(takeUntil(this.destroy$))
        .subscribe(newData => newData
            ? this.onUploadData(title, newData)
            : null
        );
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
        .subscribe(newData => newData
            ? this.onUploadData(title, newData)
            : null
        );
    }

    variantWorkDetail(data) {
        const title = "Variant Work Detail"
        this.commonFunction.openDialog({
            dialogData : { 
              title, data
            },
            component : WorkVariantDetailDialog
        })
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
        let variant_work;
        let successmsg;

        if(title == 'Reconstruct Work Area') {
            variant_work = this.commonFunction.reconstructDatas({
                workData : this.summaryData.variant_work, 
                newData : data,
                targetIndex : data.id,
            })
            successmsg = `Your work area has been updated > ${data.jobName}`
        }

        if(title == 'Quick Add') {
            variant_work = this.commonFunction.reconstructDatas({
                workData : this.workAreaData,
                newData : data,
                targetIndex : data.jobNumber,
                sortBy : 'jobNumber'
            })
        }

        if(title == 'Delete Job') {
            variant_work = this.commonFunction.reconstructDatas({
                workData : this.workAreaData, 
                targetIndex : data.id,
                status : 'delete'
            })
            successmsg = `Your job ${data.jobName} has been deleted`
        }

        this.reportService.updateReportVarianWork({variant_work}, this.summaryData.id_proyek)
        .subscribe(
            () => this.toastr.onUpload(),
            () => this.toastr.onError(),
            () => {
                this.toastr.onSuccess('Your variant work area has been updated.');
                this.generateTableData(variant_work);
                this.viewWorkArea.setWorkArea(this.workAreaData);
                this.refreshPage.emit();
            }
        )
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}