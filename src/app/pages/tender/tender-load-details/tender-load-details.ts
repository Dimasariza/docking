import { Component, EventEmitter, Output, ViewChild } from "@angular/core";
import { CommonFunction, ReplaceData } from "../../../component/common-function/common-function";
import { WorkAreasComponent } from "../../../component/work-areas/work-areas.component";
import { WorkAreasDialogComponent } from "../../../component/work-areas/work-areas-dialog/work-areas-dialog.component";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { ReportService } from "../../report/report.service";
import { ToastrComponent } from "../../../component/toastr-component/toastr.component";
import { HomeService } from "../../home/home.service";
import { TenderService } from "../tender.service";

@Component({
    selector: 'ngx-tender-load-details',
    templateUrl: './tender-load-details.html',
})

export class TenderLoadDetails { 
    constructor(
        private commonFunction : CommonFunction,
        private replace : ReplaceData,
        private reportService : ReportService,
        private toastr : ToastrComponent,
        private homeService : HomeService,
        private tenderService : TenderService
    ) {}

    activeProject : any = {};
    private destroy$: Subject<void> = new Subject<void>();
    @Output("refresh") refreshPage: EventEmitter<any> = new EventEmitter();
    @ViewChild(WorkAreasComponent) viewWorkArea : WorkAreasComponent;

    generateTableDatas(data) {
        let {projectTitle = '', id_tender = '', work_area = [], approved = false,
        yard : {work_area : tenderWorkArea = []} = '', yard} = data;
        if(yard) work_area = tenderWorkArea;
        if(this.commonFunction.arrayNotEmpty(work_area)) this.workAreaData = work_area;
        else this.workAreaData = [];

        this.viewWorkArea.setWorkArea(this.workAreaData);

        this.activeProject = {...data, projectTitle};
        this.tableDetails = this.replace
        .replace(this.tableDetails, 'Confirm Contract', (!id_tender && !approved), 'disabled');
    }

    workAreaData : any = [];
    tableDetails = {style :{ width : '3400px', "max-height" : '300px' }, 
        button : [{ name : 'Confirm Contract', disabled : true }]
    };
    columnType = [ 
        { type : 'numb', width : 100, prop : 'jobNumber' }, 
        { type : 'icon', width : 50, prop : 'rank' ,
            icon : [ 
                {name : 'info-outline', color : 'rankColor', popOver : 'rank'},
            ]
        }, 
        { type : 'text', width : 150, prop : 'jobName' }, 
        { type : 'text', width : 250, prop : 'department' }, 
        { type : 'date', width : 150, prop : 'startContract' }, 
        { type : 'date', width : 200, prop : 'endContract' }, 
        { type : 'text', width : 200, prop : 'volume' },
        { type : 'text', width : 200, prop : 'unit' },
        { type : 'text', width : 200, prop : 'unitPriceContract' },
        { type : 'curr', width : 200, prop : 'totalPriceContract' },
        { type : 'text', width : 200, prop : 'category' },
        { type : 'text', width : 250, prop : 'remarks' },
        { type : 'butt', width : 100, prop : 'approved' ,
            button : [
                { name : 'Approve Job', icon : 'square-outline', status : 'basic', disabled : false, size : 'tiny'},
            ] 
        },
        { type : 'butt', width : 100, prop : 'edit',
            button : [
                { name : 'Update Job', icon : 'edit-outline', status : 'info'},
            ] 
        },
    ]

    tableHead = [ 
        { type : 'text', placeholder : 'Job Number' },
        { type : 'text', placeholder : 'Rank' },
        { type : 'text', placeholder : 'Job Name' },
        { type : 'text', placeholder : 'Department' },
        { type : 'text', placeholder : 'Start' },
        { type : 'text', placeholder : 'End' },
        { type : 'text', placeholder : 'Volume' },
        { type : 'text', placeholder : 'Unit' },
        { type : 'text', placeholder : 'Unit Price Contract' },
        { type : 'text', placeholder : 'Total Price Contract' },
        { type : 'text', placeholder : 'Category' },
        { type : 'text', placeholder : 'Remarks' },
        { type : 'drop-down', placeholder : 'Approved', 
            option : ['All', ...this.commonFunction.rank], title : 'Filter Table' 
        },
        { type : 'text', placeholder : '' },
    ]

    handleClickButton(title, data) {
        if(title == 'Update Job') this.updateWorkArea(title, data)
        if(title == 'Confirm Contract') this.updateProjectSummary()
    }

    updateWorkArea(title, data) {
        this.commonFunction.openDialog({
            dialogData : { 
                title,
                data,
                label : 'Contract',
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

    updateProjectSummary() {
        let postBody = this.activeProject;
        this.homeService.getUserLogin()
        .subscribe(({data} : any) => postBody.approved_by = data.id_user)
        postBody.approved = this.commonFunction.transformDate(new Date());
        this.reportService.updateProjectSummary(postBody)
        .subscribe(
            () => this.toastr.onUpload(),
            () => this.toastr.onError(),
            () => {
                this.toastr.onSuccess('Your project summary has been approved.')
                this.refreshPage.emit()
            }
        )

        const {proyek : {work_area}} = this.activeProject;
        this.reportService.updateReportWorkArea({work_area}, this.activeProject.id_proyek)
        .subscribe(
            () => this.toastr.onUpload(),
            () => this.toastr.onError(),
            () => {
                this.toastr.onSuccess('All jobs has been added to report progress.');
                this.refreshPage.emit();
            }
        )
    }

    onUploadData(title, data) {
        if(title == 'Update Job') {
            this.workAreaData = this.commonFunction.reconstructDatas({
                workData : this.workAreaData,
                newData : data,
                targetIndex : data.id
            })
            this.tenderService.updateContractWorkArea({work_area : this.workAreaData}, this.activeProject.id_tender)
            .subscribe(
                () => this.toastr.onUpload(),
                () => this.toastr.onError(),
                () => this.toastr.onSuccess("Your work area has been updated.")
            )
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}




// approveByRank(id) {
//   const tenderApproval = {tenderApproval : true}
//   // this.workAreaContainer.forEach(work => {
//   //   if(id == 0) this.approvedData([work], tenderApproval)
//   //   if(id != 0 && id - 1 == work.rank) this.approvedData([work], tenderApproval)
//   // })
//   // this.updateWorkApproval(this.workAreaContainer)
// }

// approvedByYard(newData){
//   const tenderApproval = {tenderApproval : true}
//   this.approvedData(newData, tenderApproval)
//   // this.updateWorkApproval(this.workAreaContainer)
// }

// approvedData(newData, approve) {
//   newData.map(work => {
//     const postData = { ...work, ...approve}
//     // this.workAreaContainer = this.FNCOL.updateWorkAreaData(this.workAreaContainer, work.id, postData)
//     if(work?.items?.length) this.approvedData(work.items, approve) 
//   })
// }