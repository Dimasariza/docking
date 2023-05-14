import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { Subject } from "rxjs";
import { WorkAreasDialogComponent } from "../../../component/work-areas/work-areas-dialog/work-areas-dialog.component";
import { takeUntil } from "rxjs/operators";
import { CommonFunction, ReplaceData } from "../../../component/common-function/common-function";
import { WorkAreasComponent } from "../../../component/work-areas/work-areas.component";
import { ProjectService } from "../../project/project.service";
import { ToastrComponent } from "../../../component/toastr-component/toastr.component";
import { DeleteDialogComponent } from "../../../component/delete-dialog/delete-dialog.component";
import * as XLSX from 'xlsx/xlsx.mjs';
import { CheckFile } from "../../../component/common-function/onUploadFile";

@Component({
    selector: 'ngx-sub-project-work-area',
    templateUrl: './sub_project-work-area.html',
})
export class SubProjectWorkArea implements OnInit{
    constructor(
        public commonFunction : CommonFunction,
        public replaceData : ReplaceData,
        private projectService : ProjectService,
        private toastr : ToastrComponent,
        private checkFile : CheckFile
    ) { }

    ngOnInit(): void {
        const { work_area, mata_uang } = this.projectData;
        this.tableDetails = this.replaceData.replace(this.tableDetails, 'currency', mata_uang + ' ', 'currency')
        if(this.commonFunction.arrayNotEmpty(work_area)) this.workAreaData = work_area;
    }

    @Output("refresh") refreshPage: EventEmitter<any> = new EventEmitter();
    @ViewChild(WorkAreasComponent) viewWorkArea : WorkAreasComponent;
    @ViewChild('importExcel', {static : false}) importExcel : ElementRef;
    @Input() projectData : any = {};

    private destroy$: Subject<void> = new Subject<void>();

    workAreaData : any[] = [];
    tableDetails = {style :{ width : '2800px', "max-height" : '300px' }, currency : 'currency'};
    columnType = [ 
        { type : 'numb', width : 200, prop : 'jobNumber' }, 
        { type : 'icon', width : 80, prop : 'rank' ,
            icon : [ 
                {name : 'info-outline', color : 'rankColor', popOver : 'rank'},
            ]
        }, 
        { type : 'text', width : 300, prop : 'jobName' }, 
        { type : 'text', width : 150, prop : 'department' }, 
        { type : 'date', width : 200, prop : 'start' }, 
        { type : 'date', width : 200, prop : 'end' },
        { type : 'text', width : 200, prop : 'volume' },
        { type : 'text', width : 200, prop : 'unit' },
        { type : 'curr', width : 200, prop : 'unitPriceBudget' },
        { type : 'text', width : 200, prop : 'totalPriceBudget' },
        { type : 'text', width : 200, prop : 'category' },
        { type : 'text', width : 400, prop : 'remarks' },
        { type : 'resp', width : 200, prop : 'responsible' },
        { type : 'butt', width : 200, prop : 'edit' ,
            button : [
                { name : 'Add Sub Job', icon : 'plus-outline', status : 'success'},
                { name : 'Update Job', icon : 'edit-outline', status : 'info'},
                { name : 'Delete Job', icon : 'trash-outline', status : 'danger'},
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
        { type : 'text', placeholder : 'Vol' },
        { type : 'text', placeholder : 'Unit' },
        { type : 'text', placeholder : 'Unit Price Budget' },
        { type : 'text', placeholder : 'Total Price Budget' },
        { type : 'text', placeholder : 'Category' },
        { type : 'text', placeholder : 'Remarks' },
        { type : 'text', placeholder : 'Responsible' },
        { type : 'text', placeholder : '' },
    ];
    
    workAreaNavButton = ["Add Job", "Quick Add", "Extend", "Refresh", "Import"]

    handleClickButton(button, data = null) {
        switch(button) {
            case 'Add Job':
            case 'Add Sub Job':
            case 'Update Job':
                this.updateWorkAreaDialog(button, data);
            break;
            case 'Quick Add':
                this.quickAddWorkArea(button)
            break;
            case 'Delete Job':
                this.deleteJobDialog(button, data);
            break;
            case 'Extend':
                this.extendTable(true);
            break;
            case 'Reduce':
                this.extendTable(false);
            break;
            case 'Refresh':
                this.refreshPage.emit();
            break;
            case 'Import':
                this.importExcel.nativeElement.click()
            break;
        }
    }

    extendTable(conds) {
        this.workAreaNavButton = 
        conds 
        ? this.replaceData.replace(this.workAreaNavButton, "Extend", "Reduce")
        : this.replaceData.replace(this.workAreaNavButton, "Reduce", "Extend")
        this.viewWorkArea.extendOrReduce()
    }

    importExcelFIle(event) {
        if(!event) return;
        const formData = this.checkFile.extension(event, 'numeric file');
        if(!formData) return;

        const fileName = event.target.files[0];
        if(!fileName) return;
        const fileReader = new FileReader();
        fileReader.readAsBinaryString(fileName);
        fileReader.onload = (e : any) => { 
          const binaryData = e.target.result;
          const workbook = XLSX.read(binaryData, {type : 'binary'});
          const sheet = workbook.Sheets['WORK ORDER']
          let index = 0;
          let looping = true;
          while(looping) {
            const obj = "A" + index;
            if(index > 100) looping = false;
            if(sheet[obj]) {
                looping = false;
                break;
            }
            index++;
          }
          const data = XLSX.utils.sheet_to_json(sheet, {range: index - 1, defval: ""});
          this.reconstructDataExcel(data);
        }
    }

    transformExcelDate = (date) => new Date(Math.round((date - 25569) * 86400 * 1000))

    reconstructDataExcel(data) {
        const user =  JSON.parse(localStorage.getItem('user'));
        const date = this.commonFunction.transformDate(new Date(), 'yyyy-MM-dd hh-mm a');
        data = data.map(details => {
            let {
                ['Job Number']  : jobNumber,
                ['Job Name']    : jobName,
                ['Departement'] : department,
                ['Start']       : start,
                ['Stop']        : end,
                ['Vol']         : volume,
                ['Unit']        : unit,
                ['Unit Price']  : unitPriceBudget,
                ['Total Price'] : totalPriceBudget,
                ['Category']    : category,
                ['Remarks']     : remarks,
                ['Responsible'] : nama_lengkap,
                ['Rank']        : rank,
            } = details;
            const progress = [{ progress : '0', date, updateBy : user.nama_lengkap, 
                remarksProgress : `${user.nama_lengkap} importing Data From Excel` 
            }]
            return {jobNumber, jobName, department, rank, progress, responsible : { nama_lengkap },
                start : this.commonFunction.transformDate(this.transformExcelDate(start)), 
                end : this.commonFunction.transformDate(this.transformExcelDate(end)),
                volume, unit, unitPriceBudget, totalPriceBudget, category, remarks, 
                created_at : date, last_update : date, 
            }
        })
        data.forEach(job => {
            this.workAreaData = this.commonFunction.reconstructDatas({
              workData : this.workAreaData,
              newData : job,
              targetIndex : job.jobNumber,
              sortBy : 'jobNumber'
            })
        });
        this.onUploadData('Import Excel', this.workAreaData);
    }

    quickAddWorkArea(title) {
        this.commonFunction.openDialog({
            dialogData : { 
                title,
                data : this.projectData,
                label : 'Budget',
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

    updateWorkAreaDialog(title, data) {
        if(!data) data = this.projectData;
        this.commonFunction.openDialog({
            dialogData : { 
                title,
                data,
                label : 'Budget',
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
            : null);
    }

    onUploadData(title, data : any) {
        if(!data) return;
        let successmsg;
        let work_area;

        if(title == 'Import Excel') work_area = this.workAreaData

        if(title == 'Reconstruct Work Area') {
            work_area = this.commonFunction.reconstructDatas({
                workData : this.projectData.work_area, 
                newData : data,
                targetIndex : data.id,
            })
            successmsg = `Your work area has been updated > ${data.jobName}`
        }

        if(title == 'Delete Job') {
            work_area = this.commonFunction.reconstructDatas({
                workData : this.projectData.work_area, 
                targetIndex : data.id,
                status : 'delete'
            })
            successmsg = `Your job ${data.jobName} has been deleted`
        }

        if(title == 'Quick Add') {
            work_area = this.commonFunction.reconstructDatas({
                workData : this.projectData.work_area, 
                newData : data,
                targetIndex : data.jobNumber,
                sortBy : 'jobNumber'
            })
            successmsg = `Your work area has been updated > ${data.jobName}`
        }

        this.projectService.updateProjectWorkArea({work_area}, this.projectData.id_proyek)
        .subscribe(
        () => this.toastr.onUpload(),
        () => this.toastr.onError(),
        () => {
            this.toastr.onSuccess(`Your job ${data.jobName} has been deleted`);
            this.refreshPage.emit();
            this.viewWorkArea.setWorkArea(work_area)
            }
        )
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}