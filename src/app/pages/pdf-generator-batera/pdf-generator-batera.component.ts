import { Component, OnInit } from '@angular/core';
import pdfMake from "pdfmake/build/pdfmake";  
import pdfFonts from "pdfmake/build/vfs_fonts";  
pdfMake.vfs = pdfFonts.pdfMake.vfs; 

@Component({
  selector: 'ngx-pdf-generator-batera',
  templateUrl: './pdf-generator-batera.component.html',
  styles: [
  ]
})
export class PdfGeneratorBateraComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  generatePDF() {  
    let docDefinition = {  
      header:  [{
        text : 'Batera Docking Apps',
        alignment : 'right',
        margin : [5,5,5,5],
        fontSize: 6,  
        color : ''
      }] ,  
      content:       [{  
        text: 'ELECTRONIC SHOP',  
        fontSize: 16,  
        alignment: 'center',  
        color: '#047886'  
      },  
      {  
        text: 'INVOICE',  
        fontSize: 20,  
        bold: true,  
        alignment: 'center',  
        decoration: 'underline',  
        color: 'skyblue'  
      }]

    };  
   
    pdfMake.createPdf(docDefinition).open();  
  } 

}
