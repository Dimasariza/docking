import { Component, EventEmitter, Output, ViewChild } from "@angular/core";
import { CommonFunction, ReplaceData } from "../../../component/common-function/common-function";
import { WorkAreasComponent } from "../../../component/work-areas/work-areas.component";
import { WorkAreasDialogComponent } from "../../../component/work-areas/work-areas-dialog/work-areas-dialog.component";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { ReportService } from "../../report/report.service";
import { ToastrComponent } from "../../../component/toastr-component/toastr.component";
import { TenderService } from "../tender.service";

@Component({
    selector: 'ngx-tender-load-details',
    templateUrl: './tender-load-details.html',
})

export class TenderLoadDetails  { 
    constructor(
        private commonFunction : CommonFunction,
        private replace : ReplaceData,
        private reportService : ReportService,
        private toastr : ToastrComponent,
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
        this.tableDetails = this.replace.replace(this.tableDetails, 'Confirm Contract', !(id_tender && approved === ""), 'disabled');
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
        { type : 'date', width : 150, prop : 'start' }, 
        { type : 'date', width : 200, prop : 'end' }, 
        { type : 'text', width : 200, prop : 'volume' },
        { type : 'text', width : 200, prop : 'unit' },
        { type : 'text', width : 200, prop : 'unitPriceContract' },
        { type : 'curr', width : 200, prop : 'totalPriceContract' },
        { type : 'text', width : 200, prop : 'category' },
        { type : 'text', width : 250, prop : 'remarks' },
        { type : 'approval', width : 100, prop : 'tenderApproval',
            button : [
                { name : 'Approve Job', disabled : 'tenderApproval' },
            ] 
        },
        { type : 'butt', width : 100, prop : 'edit',
            button : [
                { name : 'Update Job', icon : 'edit-outline', status : 'info', disabled : 'tenderApproval'},
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
        { type : 'drop-down', placeholder : 'Approved', unsort : true,
            option : ['All', ...this.commonFunction.rank], title : 'Approve By Rank' 
        },
        { type : 'text', placeholder : '' },
    ]

    handleClickButton(title, data) {
        if(!this.activeProject.yard)
        return this.toastr.onWarning({
            warnmsg : 'Please select yard or tender for this project.',
            duration : 10000
        })

        if(!(this.activeProject.id_tender && 
            this.activeProject.approved === ""))
            return this.toastr.onWarning({
                warnmsg : `This Project has been confirmed at ${this.activeProject.approved}.`,
                duration : 10000
            })

        if(title == 'Update Job') this.updateWorkArea(title, data);
        if(title == 'Confirm Contract') this.updateProjectSummary();
        if(title == 'Approve Job') this.approvedByYard(title, data);
        if(title == 'Approve By Rank') this.approveByRank(title, data)
    }

    approveByRank(title, {value}) {
        if(value == 'All') 
            this.commonFunction.rank.forEach(value => {
                this.workAreaData = this.replace.replace(this.workAreaData, value, true, 'tenderApproval');
            })
        this.workAreaData = this.replace.replace(this.workAreaData, value, true, 'tenderApproval');
        this.onUploadData(title, this.workAreaData);
    }

    approvedByYard(title, data) {
        let approvalData = [{ ...data, tenderApproval : true }];
        this.commonFunction.collectItem([data], item => {
            approvalData = this.commonFunction.reconstructDatas({
                workData : approvalData,
                newData : { ...item, tenderApproval : true },
                targetIndex : item.id
            });
        });
        this.onUploadData('Update Job', approvalData[0]) 
    }

    updateWorkArea(title, data) {
        this.commonFunction.openDialog({
            dialogData : { 
                title,
                data : {...data, mata_uang : this.activeProject.proyek.mata_uang}, 
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
        const user =  JSON.parse(localStorage.getItem('user'));
        const postBody = { ...this.activeProject, 
            approved_by : user.id_user,
            approved : this.commonFunction.transformDate(new Date())
        };

        this.reportService.updateProjectSummary(postBody)
        .subscribe(
            () => this.toastr.onUpload(),
            () => this.toastr.onError(),
            () => {
                this.toastr.onSuccess('Your project summary has been approved.');
                this.refreshPage.emit();
            }
        )

        let {yard : {work_area}} = this.activeProject;
        
        work_area = work_area.filter(job => job.tenderApproval == true);
        this.reportService.updateReportWorkArea({work_area}, this.activeProject.id_proyek)
        .subscribe(
            () => this.toastr.onUpload(),
            () => this.toastr.onError(),
            () => {
                this.toastr.onSuccess('All jobs has been added to report progress.');
                this.tableDetails = this.replace.replace(this.tableDetails, 'Confirm Contract', true, 'disabled')
                this.refreshPage.emit();
            }
        )
    }

    onUploadData(title, data) {
        if(!data) return;
        let successmsg = "Your work area has been updated.";
        if(title == 'Update Job') {
            this.workAreaData = this.commonFunction.reconstructDatas({
                workData : this.workAreaData,
                newData : data,
                targetIndex : data.id
            })
        }

        const work_area = this.workAreaData;
        this.tenderService.updateContractWorkArea({work_area}, this.activeProject.id_tender)
        .subscribe(
            () => this.toastr.onUpload(),
            () => this.toastr.onError(),
            () => {
                this.toastr.onSuccess(successmsg);
                this.viewWorkArea.setWorkArea(work_area);
            }
        )
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}