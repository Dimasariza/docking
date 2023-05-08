import { Injectable } from "@angular/core";
import * as XLSX from 'xlsx/xlsx.mjs';
import * as FileSaver from 'file-saver';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
    providedIn: 'root'
})
export class ExportToExcel{
    constructor(
    ){}

    public excelData : any [] = [];
    private excelFileName : any;
    public label : string = ""; 

    public exportToExcel(workArea, label, excelFileName) {
        this.excelFileName = excelFileName;
        this.label = label;
        this.excelData = [];
        this.reconstructToExcelData(workArea)
        this.exportAsExcelFile(this.excelData, excelFileName)
    }

    reconstructToExcelData(workArea) {
        workArea.forEach(({
            jobNumber,
            jobName,
            department : Departement,
            volume : Vol,
            unit : Unit,
            category : Category,
            remarks : Remarks,
            responsible : {nama_lengkap : Responsible},
            rank : Rank,
            progress : Progress,
            items,
            ["start" + `${this.label}`] : Start,
            ["end" + `${this.label}`] : Stop,
            ["unitPrice" + `${this.label}`] : unitPrice,
            ["totalPrice" + `${this.label}`] : totalPrice,
        } : any) => {
            this.excelData.push({
                ["Job Number"] : jobNumber, ["Job Name"] :jobName, Departement, Vol, Unit, Category, Progress,
                Remarks, Responsible, Rank, Start, Stop, ["Unit Price"] : unitPrice, ["Total Price"] : totalPrice
            })
            if(items?.length) this.reconstructToExcelData(items);
        });
    }

    private exportAsExcelFile(json : any[], excelFileName: string) : void{
        const worksheet : XLSX.WorkSheet = XLSX.utils.json_to_sheet(json)
        const woorkbook : XLSX.WoorkBook = {Sheets : {'WORK ORDER' : worksheet}, SheetNames : ['WORK ORDER']}
        const excelBuffer : any = XLSX.write(woorkbook, {bookType : 'xlsx', type : 'array' });
        this.saveAsExcelFile(excelBuffer, excelFileName)
    }

    private saveAsExcelFile(buffer : any, excelFileName : string) : void {
        const data : Blob = new Blob([buffer], {type : EXCEL_TYPE});
        FileSaver.saveAs(data, excelFileName + '_BATERA_' + new Date().getTime() + EXCEL_EXTENSION);
    }
}