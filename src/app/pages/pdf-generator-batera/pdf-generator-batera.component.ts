import { Component, OnInit } from '@angular/core';
import pdfMake from "pdfmake/build/pdfmake";  
import pdfFonts from "pdfmake/build/vfs_fonts";  
import { take } from 'rxjs/operators';
import { PDFService } from './pdf-service.component';
pdfMake.vfs = pdfFonts.pdfMake.vfs; 

@Component({
  selector: 'ngx-pdf-generator-batera',
  templateUrl: './pdf-generator-batera.component.html',
})
export class PdfGeneratorBateraComponent implements OnInit {
  constructor(private pdfService : PDFService
  ) { }

  projectDatas : any
  projectSummary : any
  chooseProject : any
  pdfDocumentation : any

  ngOnInit(): void {
    this.pdfService.getProjectSummary('', '', '', '')
    .pipe(take(1))
    .subscribe(({data} : any) => {
      this.projectSummary = data
      this.projectDatas = data.map(p => ({
        name : p.proyek.kapal.nama_kapal + ' -DD- ' + p.proyek.tahun,
        projectId : p.id_proyek
      }))
    })
  }

  getProjectSummary(id){
    this.chooseProject = this.projectSummary[id]
  }

  clickAction(desc){
    switch(desc) {
      case 'show' :
        pdfMake.createPdf(pdfExample).open();  
      break;
    case 'download' :
        pdfMake.createPdf(pdfExample).download();  
      break;
    }
  }

  buttons = [
    {desc : 'show'},
    {desc : 'download'}
  ]
}

const pdfExample = 
{  
  header:  [{
    text : 'Batera Docking Apps',
    alignment : 'right',
    margin : [5,5,5,5],
    fontSize: 6,  
    color : ''
  }] ,  
  content: [
  {  
    text: 'BATERA DOCKING',  
    fontSize: 20,  
    color: '#047886'  
  },  
  {  
    text: 'REPORT SUMMARY',  
    fontSize: 12,  
    bold: true,  
    color: 'skyblue' ,
    margin : [1, 0, 1, 10] 
  },
  {  
    text: 'KM ABUSAMAH -DD- 2022',  
    fontSize: 8,  
    color: 'black' ,
    margin : [0, 6] 
  },
  [
    {
      layout: 'lightHorizontalLines',
      margin : [0 , 6],
      table: {
        headerRows: 1,
        widths: [ '*', '*', '*', '*' , '*'],  
  
        body: [
          [ { text :'Number', fontSize : 10, bold : true}, { text : 'Tasks', fontSize : 10, bold : true} , { text : 'Status', fontSize : 10, bold : true}, { text : 'Responsible', fontSize : 10, bold : true} ,   { text :'Due', fontSize : 10, bold : true} ],
          [ { text :'Value 1', fontSize : 9, bold : true}, { text : 'Value 2', fontSize : 9, bold : true} , { text : 'Value 3', fontSize : 9, bold : true}, { text : 'Value 4', fontSize : 9, bold : true} ,   { text :'Value 5', fontSize : 9, bold : true} ],
          [ { text :'Value 1', fontSize : 9, bold : true}, { text : 'Value 2', fontSize : 9, bold : true} , { text : 'Value 3', fontSize : 9, bold : true}, { text : 'Value 4', fontSize : 9, bold : true} ,   { text :'Value 5', fontSize : 9, bold : true} ],
          [ { text :'Value 1', fontSize : 9, bold : true}, { text : 'Value 2', fontSize : 9, bold : true} , { text : 'Value 3', fontSize : 9, bold : true}, { text : 'Value 4', fontSize : 9, bold : true} ,   { text :'Value 5', fontSize : 9, bold : true} ],
        ]
      }
    },
    {
      layout: 'lightHorizontalLines',
      margin : [0 , 6],
      table: {
        headerRows: 1,
        widths: [ '*', '*', '*', '*' , '*'],  
  
        body: [
          [ { text :'Number', fontSize : 10, bold : true}, { text : 'Tasks', fontSize : 10, bold : true} , { text : 'Status', fontSize : 10, bold : true}, { text : 'Responsible', fontSize : 10, bold : true} ,   { text :'Due', fontSize : 10, bold : true} ],
          [ { text :'Value 1', fontSize : 9, bold : true}, { text : 'Value 2', fontSize : 9, bold : true} , { text : 'Value 3', fontSize : 9, bold : true}, { text : 'Value 4', fontSize : 9, bold : true} ,   { text :'Value 5', fontSize : 9, bold : true} ],
          [ { text :'Value 1', fontSize : 9, bold : true}, { text : 'Value 2', fontSize : 9, bold : true} , { text : 'Value 3', fontSize : 9, bold : true}, { text : 'Value 4', fontSize : 9, bold : true} ,   { text :'Value 5', fontSize : 9, bold : true} ],
          [ { text :'Value 1', fontSize : 9, bold : true}, { text : 'Value 2', fontSize : 9, bold : true} , { text : 'Value 3', fontSize : 9, bold : true}, { text : 'Value 4', fontSize : 9, bold : true} ,   { text :'Value 5', fontSize : 9, bold : true} ],
        ]
      }
    },
  ],

  {
    // if you specify both width and height - svg will be stretched
    svg: '<svg width="300" height="200" viewBox="0 0 300 200"></svg>',
    width: 600,
    height: 400
  },
  {
    // you can also fit the svg inside a rectangle
    svg: '<svg width="300" height="200" viewBox="0 0 300 200"></svg>',
    fit: [150, 100]
  },
]
};