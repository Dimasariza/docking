import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CommonFunction } from "../../../component/common-function/common-function";
import { ProjectDialogComponent } from "../../project/project-dialog/project-dialog.component";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ProjectService } from "../../project/project.service";
import { ToastrComponent } from "../../../component/toastr-component/toastr.component";

@Component({
    selector: 'ngx-sub-project-summary',
    templateUrl: './sub_project-summary.html',
})
export class SubProjectSummary implements OnInit {
    constructor(
        private commonFunction : CommonFunction,
        private router : Router,
        private projectService : ProjectService,
        private toastr : ToastrComponent,
    ) { }

    ngOnInit(): void {
        this.generateTableDatas()
        this.generateCurrencyTable()
    }

    Object = Object;
    @Input() projectData;
    @Input() allWorkArea : any;
    @Output("refresh") refreshPage: EventEmitter<any> = new EventEmitter();
    private destroy$: Subject<void> = new Subject<void>();

    currencyTable : any = {};
    summaryTable : any;

    generateCurrencyTable() {
        this.currencyTable = this.commonFunction.category
        .map(category => ({
            name : category,
            budget : 0,
            contract : 0,
            actual : 0
        }));

        const { projectWorkArea, tenderWorkArea, reportWorkArea } = this.allWorkArea;
        if(this.commonFunction.arrayNotEmpty(projectWorkArea)) 
            this.findFromWorkArea(projectWorkArea, "Budget")
        if(this.commonFunction.arrayNotEmpty(tenderWorkArea)) 
            this.findFromWorkArea(tenderWorkArea, "Contract")
        if(this.commonFunction.arrayNotEmpty(reportWorkArea)) 
            this.findFromWorkArea(reportWorkArea, "Actual")

        this.currencyTable = this.currencyTable.map(({name, budget = 0, contract = 0, actual = 0} : any) => {
            budget = this.commonFunction.convertToCurrency(this.summaryTable["Base Currency"], budget)
            contract = this.commonFunction.convertToCurrency(this.summaryTable["Base Currency"], contract)
            actual = this.commonFunction.convertToCurrency(this.summaryTable["Base Currency"], actual)
            return {name, budget, contract, actual};
        })
    }

    findFromWorkArea(work_area, label) {
        work_area.forEach(work => {
            this.commonFunction.category.forEach((category, index) => {
                if(work.category == category) {
                    this.currencyTable[index][`${label.toLowerCase()}`] += 
                    this.commonFunction.priceAmount(work[`unitPrice${label}`])  || 0;
                };
            })
        });
    }

    generateTableDatas() {
        const {kapal : {nama_kapal}, phase, mata_uang, 
        off_hire_start, off_hire_end, off_hire_period, off_hire_deviasi, 
        off_hire_bunker_per_day, repair_start, repair_end, repair_period,
        repair_in_dock_start, repair_in_dock_end, repair_in_dock_period,
        repair_additional_day} = this.projectData;

        this.summaryTable = 
        {  
            "Phase"             : phase.split('_').join(" "),
            "Vessel"            : nama_kapal,
            "Base Currency"     : mata_uang,
            "Off Hire Period"   : `( ${off_hire_period} Days )  ${off_hire_start} - ${off_hire_end}`,
            "-Deviation"        : `${off_hire_deviasi} Days`,
            "-Charter Rate"     : `${ this.commonFunction.convertToCurrency(mata_uang, off_hire_bunker_per_day) }`,
            "-Bunker"           : `${ this.commonFunction.convertToCurrency(mata_uang, off_hire_bunker_per_day)}`,
            "Repair Period"     : `( ${repair_period} Days )  ${repair_start} - ${repair_end}`,
            "-In Dock"          : `( ${repair_in_dock_period} Days )  ${repair_in_dock_start} - ${repair_in_dock_end}`,
            "Additional Days"   : repair_additional_day,
        };
    }

    columns = [
        { title : 'Totals' , prop : 'name', width : '200'},
        { title : 'Budget' , prop : 'budget', width : '100'},
        { title : 'Contract' , prop : 'contract', width : '100'},
        { title : 'Actual' , prop : 'actual', width : '100'}
    ];

    handleClickButton(button, data = null) {
        if(button == 'Monitoring')
        this.router.navigateByUrl('/pages/report/' + this.projectData.id_proyek);

        if(button == 'Update Project') this.updateProjectDialog(button)
    }

    updateProjectDialog(title) {
        this.commonFunction.openDialog({
          dialogData : {
            title,
            data : this.projectData
          },
          component : ProjectDialogComponent 
        })
        .onClose
        .pipe(takeUntil(this.destroy$))
        .subscribe(newData => this.onUploadData(title, newData));
    }

    onUploadData(title, data){
        if(!data) return;

        let subscribe;
        let successMsg;
        let errorMsg = "Please try again."

        if(title == 'Update Project') {
            subscribe = this.projectService.updateProject(data)
            successMsg = 'Your Project has been updated.'
        }

        subscribe
        .pipe(takeUntil(this.destroy$))
        .subscribe(
            () => this.toastr.onUpload(),
            () => this.toastr.onError(errorMsg),
            () => {
                this.refreshPage.emit();
                this.toastr.onSuccess(successMsg)
                setTimeout(() => this.ngOnInit(), 500);
            }
        );
    }
}