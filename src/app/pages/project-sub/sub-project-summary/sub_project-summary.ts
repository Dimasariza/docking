import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CommonFunction } from "../../../component/common-function/common-function";
import { ProjectDialogComponent } from "../../project/project-dialog/project-dialog.component";
import { Router } from "@angular/router";

@Component({
    selector: 'ngx-sub-project-summary',
    templateUrl: './sub_project-summary.html',
})
export class SubProjectSummary implements OnInit {
    constructor(
        private commonFunction : CommonFunction,
        private router : Router,
    ) { }

    ngOnInit(): void {
        this.currencyTable = this.commonFunction.category
        .map(category => ({
            name : category,
            budget : 0,
            contract : 0,
            actual : 0
        }));
        this.generateTableDatas(this.projectData)
    }

    Object = Object;
    @Input() projectData;
    @Output("refresh") refreshProject: EventEmitter<any> = new EventEmitter();

    currencyTable;
    summaryTable : any;

    generateTableDatas(data) {
        const {kapal : {nama_kapal}, phase, mata_uang, 
        off_hire_start, off_hire_end, off_hire_period, off_hire_deviasi, 
        off_hire_bunker_per_day, repair_start, repair_end, repair_period,
        repair_in_dock_start, repair_in_dock_end, repair_in_dock_period,
        repair_additional_day} = data;

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

    onHandleClick(button, data = null) {
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
    }
}