import { Component, Input, OnInit } from "@angular/core";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { CommonFunction } from "../../../../component/common-function/common-function";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
    selector: 'pdf-table-component',
    templateUrl: './pdf-table.component.html',
})
export class PDFTableComponent implements OnInit {
    constructor(
        public commonFunction : CommonFunction
    ) {}

    Math = Math
    ngOnInit(): void {
        pdfMake.tableLayouts = {
            exampleLayout: {
              hLineWidth: function (i, node) {
                if (i === 0 || i === node.table.body.length) return 0;
                return (i === node.table.headerRows) ? 2 : 1;
              },
              vLineWidth: (i) => 0,
              hLineColor: (i) => i === 1 ? 'black' : '#aaa',
              paddingLeft: (i) => i === 0 ? 0 : 8,
              paddingRight: (i, node) => (i === node.table.widths.length - 1) ? 0 : 8
            }
        };
        this.columns.forEach(column => this.dataPDFMake.widths.push(column.width));
        this.dataPDFMake = JSON.stringify(this.dataPDFMake)
    }

    public dataPDFMake : any = {"widths":[], "layout" : "exampleLayout"}
    public tableStyle : any = {'font-size' : '10px'};
    @Input() columns;
    @Input() rows : any = [];
    @Input() tableFooter : any[];

}