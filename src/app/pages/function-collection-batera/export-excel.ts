import { Injectable, Pipe, PipeTransform } from "@angular/core";
import * as XLSX from 'xlsx/xlsx.mjs';
import * as FileSaver from 'file-saver';
import { DatePipe } from "@angular/common";
import { FunctionCollection } from "./function-collection.component";

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable({
    providedIn: 'root'
})
export class ExportToExcel{
    constructor(public datePipe : DatePipe,
                private FNCOL : FunctionCollection
        ){}
    public excelData : any [] = [] 

    public exportToExcel(workProgressData, work) {
        this.excelData = []
        this.reconstructJobsToExcel(workProgressData[work])
        this.exportAsExcelFile(this.excelData, workProgressData?.head)
    }

    public reconstructJobsToExcel(datas) {
        datas.map(job => {
            const {jobNumber, jobName, start, end, category, status, unit, responsible, rank, items, progress, remarks, id} = job
            const parentId = id.toString().split('')
            let useUnit = parentId?.length == 1 
            ? this.FNCOL.jobUnit 
            : this.FNCOL.subJobUnit
            this.excelData.push({
                "Job Number" : jobNumber,
                "Job Name" : jobName,
                Start : this.datePipe.transform(start, 'dd-MM-yyyy'),
                Stop : this.datePipe.transform(end, 'dd-MM-yyyy'),
                Unit : useUnit[unit],
                Category : this.FNCOL.category[category] ,
                Responsible : responsible?.name,
                Status : this.FNCOL.status[status],
                Priority : this.FNCOL.rank[rank],
                Percentage : progress,
                remarks
            })
            items?.length ? this.reconstructJobsToExcel(items) : null
        })
    }

    public exportAsExcelFile(json : any[], excelFileName: string) : void{
        const worksheet : XLSX.WorkSheet = XLSX.utils.json_to_sheet(json)
        const woorkbook : XLSX.WoorkBook = {Sheets : {'data' : worksheet}, SheetNames : ['data']}
        const excelBuffer : any = XLSX.write(woorkbook, {bookType : 'xlsx', type : 'array' });
        this.saveAsExcelFile(excelBuffer, excelFileName)
    }

    public saveAsExcelFile(buffer : any, fileName : string) : void {
        const data : Blob = new Blob([buffer], {type : EXCEL_TYPE});
        FileSaver.saveAs(data, fileName + '_BATERA_' + new Date().getTime() + EXCEL_EXTENSION)
    }

}