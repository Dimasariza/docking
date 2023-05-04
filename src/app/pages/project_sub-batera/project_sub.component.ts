import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ProjectBateraService } from "../project-batera/project-batera.service";
import { take, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { TableFunctions } from "../../component/global-component/global-data";
import { NbDialogService } from "@nebular/theme";
import { ProjectDialogComponent } from "../project-batera/project-dialog/project-dialog.component";
import { ToastrComponent } from "../../component/toastr-component/toastr.component";
import { WorkAreasDialogComponent } from "../../component/work-areas/work-areas-dialog/work-areas-dialog.component";

@Component({
    selector: 'ngx-project-sub',
    templateUrl: './project_sub.component.html',
})
export class ProjectSubComponent implements OnInit{
    constructor(
        private dialogService: NbDialogService,
        private route: ActivatedRoute,
        private projectService : ProjectBateraService,
        private tableFunction : TableFunctions,
        private router : Router,
        private toastr : ToastrComponent
    ) {
    }

    ngOnInit(): void {
        const projectId = this.route.snapshot.paramMap.get('id');

        this.projectService.getSubProjectData(projectId)
        .pipe(takeUntil(this.destroy$), take(1))
        .subscribe(
            ({data} : any) => this.generateTableDatas(data),
            () => this.toastr.onError()
        );

        this.currencyTable = this.tableFunction.category
        .map(category => ({
            name : category,
            budget : 0,
            contract : 0,
            actual : 0
        }));
    }

    private destroy$: Subject<void> = new Subject<void>();
    changingValue: Subject<boolean> = new Subject();
    Object = Object;

    projectDatas : any;
    workAreaData = [];

    summaryTable : any;

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
    

    currencyTable;
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
    ]

    columns = [
        { title : 'Totals' , prop : 'name', width : '200'},
        { title : 'Budget' , prop : 'budget', width : '100'},
        { title : 'Contract' , prop : 'contract', width : '100'},
        { title : 'Actual' , prop : 'actual', width : '100'}
    ]

    generateTableDatas(data) {
        const {kapal : {nama_kapal}, 
        tahun, status, work_area, phase, mata_uang, 
        off_hire_start, off_hire_end, off_hire_period, off_hire_deviasi, 
        off_hire_bunker_per_day, repair_start, repair_end, repair_period,
        repair_in_dock_start, repair_in_dock_end, repair_in_dock_period,
        repair_additional_day} = data;
        const projectTitle = `${nama_kapal} -DD- ${tahun} ${status.toUpperCase()}`;
        this.projectDatas = {...data, projectTitle}
        this.summaryTable = 
        {  
            "Phase"             : phase.split('_').join(" "),
            "Vessel"            : nama_kapal,
            "Base Currency"     : mata_uang,
            "Off Hire Period"   : `( ${off_hire_period} Days )  ${off_hire_start} - ${off_hire_end}`,
            "-Deviation"        : `${off_hire_deviasi} Days`,
            "-Charter Rate"     : `${ this.tableFunction.convertToCurrency(mata_uang, off_hire_bunker_per_day) }`,
            "-Bunker"           : `${ this.tableFunction.convertToCurrency(mata_uang, off_hire_bunker_per_day)}`,
            "Repair Period"     : `( ${repair_period} Days )  ${repair_start} - ${repair_end}`,
            "-In Dock"          : `( ${repair_in_dock_period} Days )  ${repair_in_dock_start} - ${repair_in_dock_end}`,
            "Additional Days"   : repair_additional_day,
        };

        if(this.tableFunction.arrayNotEmpty(work_area))
            this.workAreaData = work_area.map(work => {
                this.allColumns.forEach(column => work?.[column] ? null : work[column] = "");
                return work;
            })
        this.dataTable = this.tableFunction.populateData(this.workAreaData, false)
    }

    workAreaNavButton = ["Add Job" ,"Extend","Refresh","Import"]

    onHandleClick(button, data = null) {
        switch(button) {
            case 'Add Job':
                this.addJobDialog()
            break;
            case 'Extend':
                this.extendTable(true)
            break;
            case 'Reduce':
                this.extendTable(false)
            break;
            case 'Refresh':
                this.ngOnInit();
            break;
            case 'Import':
            break;
            case 'Update Project':
                this.updateProjectDialog()
            break;
            case 'Monitoring':
                this.router.navigateByUrl('/pages/report-batera/' + this.projectDatas.id_proyek);
            break;
        }
    }

    addJobDialog() {
        this.openDialog({
            dialogData : {
              title : 'Add',
              data : "test "
            },
            component : WorkAreasDialogComponent
        })
    }
    
    updateProjectDialog() {
        this.openDialog({
          dialogData : {
            title : 'Update Project',
            data : this.projectDatas
          },
          component : ProjectDialogComponent 
        })
    }

    openDialog({dialogData, component} : any){
        this.dialogService.open(component, {
          hasBackdrop : true,
          closeOnBackdropClick : false,
          context: {
            dialogData 
          },
        })
        .onClose
        .pipe(takeUntil(this.destroy$), take(1))
        .subscribe(data => this.onUploadData(data, dialogData.title));
    }

    onUploadData(data, title) {
        console.log(data)

    }

    extendTable(conds) {
        conds 
        ? this.workAreaNavButton[1] = "Reduce"
        : this.workAreaNavButton[1] = "Extend"
        this.dataTable = this.tableFunction.populateData(this.workAreaData, conds)    
        this.changingValue.next(this.dataTable);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}