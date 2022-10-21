import { Component, Injectable, OnInit } from '@angular/core';
import pdfMake from "pdfmake/build/pdfmake";  
import pdfFonts from "pdfmake/build/vfs_fonts";  
import { take } from 'rxjs/operators';
import { PDFService } from './pdf-service.component';
pdfMake.vfs = pdfFonts.pdfMake.vfs; 

@Injectable({
  providedIn: 'root'
})
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

  async generatePDFBasedOnJob(data, projectData) {
    const pdfData = await this.populatePDFDataPerJob(data, projectData)


    pdfMake.createPdf(pdfData).open();  
  }

  getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");

      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL("image/png");

        resolve(dataURL);
      };

      img.onerror = error => {
        reject(error);
      };

      img.src = url;
    });
  }

  reGroupJobData(data){
    let {jobNumber, jobName, rank, unit, category, progress, remarks, items} = data
    progress === undefined ||
    progress === null ? progress = 0 : null
    return [{
            layout: 'lightHorizontalLines',
            margin : [0 , 3],
            table: {
              headerRows: 1,
              widths: [ '*', 180, '*', 60, 60, 30],  
              body: [
                [ 
                  { text :'SFI', fontSize : 10, bold : true}, 
                  { text :'Item Name', fontSize : 10, bold : true}, 
                  { text :'Priority', fontSize : 10, bold : true}, 
                  { text :'Type', fontSize : 10, bold : true},
                  { text :'Category', fontSize : 10, bold : true}, 
                  { text :'%', fontSize : 10, bold : true}, 
                ],
                [
                  { text : jobNumber, fontSize : 9,}, 
                  { text : jobName, fontSize : 9,}, 
                  { text : rank.name, fontSize : 9,}, 
                  { text : unit.name, fontSize : 9,},   
                  { text : category.name, fontSize : 9,}, 
                  { text : progress, fontSize : 9,}, 
                ],
                [ 
                  { text :'Description', fontSize : 9, bold : true}, 
                  { text :remarks , fontSize : 9, colSpan : 5}, 
                  '', '', '', '',
                ],
              ]
            }
          },
          items?.length ? this.regroupSubJobData(items) : {}
        ]
  }

  subJobCollection : any = []
  regroupSubJobData(data){
    data.forEach(subjob => {
      let {jobNumber, jobName, rank, unit, category, progress, remarks, items} = subjob
      progress === undefined ||
      progress === null ? progress = 0 : null
      this.subJobCollection.push(
                          {layout: {
                                    hLineWidth: function (i, node) {
                                    if (i === 0 || i === node.table.body.length) {
                                      return 0;
                                    }
                                    return 1;
                                    },
                                    vLineWidth: function (i) {
                                      return 0;
                                    },
                                    hLineColor: function (i) {
                                      return '#aaa';
                                    },
                                    paddingLeft: function (i) {
                                      return i === 0 ? 0 : 8;
                                    },
                                    paddingRight: function (i, node) {
                                      return (i === node.table.widths.length - 1) ? 0 : 8;
                                    }
                                  },
                          margin : [0 , 3],
                          table: {
                            headerRows: 1,
                            widths: [ '*', 180, '*', 60, 60, 30],  
                            body: [
                              [
                                { text : jobNumber, fontSize : 9,}, 
                                { text : jobName, fontSize : 9,}, 
                                { text : rank.name, fontSize : 9,}, 
                                { text : unit.name, fontSize : 9,},   
                                { text : category.name, fontSize : 9,}, 
                                { text : progress, fontSize : 9,}, 
                              ],
                              [ 
                                { text :'Description', fontSize : 9, bold : true}, 
                                { text :remarks , fontSize : 9, colSpan : 5}, 
                                '', '', '', '',
                              ],
                            ]
                          }
                        }
      )
      items?.length ? this.regroupSubJobData(items) : {}
    })
  }

  async populatePDFDataPerJob(data, projectData){
    const url = await this.getBase64ImageFromURL('./assets/images/Logo/Logo Sikomodo.jpeg')
    const head = projectData.kapal.nama_kapal + ' -DD- ' + projectData.tahun
    const {Status, jobNumber, jobName, rank, responsible, remarks} = data
    const job = jobNumber + '.' + jobName
    let regroupContent
    let content = [
      {
        image : url,
        fit: [100, 100],
        alignment : 'right'
      },
      {  
        text: head,  
        fontSize: 16,  
        color: '#222'  
      }, 
      {  
        text: job,  
        fontSize: 12,  
        color: '#047886',
        margin : [0 , 6],
      }, 
      {
        layout: 'noBorders',
        margin : [0 , 6],
        table: {
          headerRows: 1,
          widths: [ '*', '*', '*', '*'],  
    
          body: [
            [ 
              { text :'Vessel', fontSize : 10, bold : true}, 
              { text : projectData?.kapal?.nama_kapal, fontSize : 10}, 
              { text :'Component', fontSize : 10, bold : true}, 
              { text :'', fontSize : 10},  
            ],
            [ 
              { text :'Type/Serial No', fontSize : 10, bold : true}, 
              { text :'', fontSize : 10}, 
              { text :'Maker', fontSize : 10, bold : true}, 
              { text :'', fontSize : 10},  
            ],
            [ 
              { text :'Start Date', fontSize : 10, bold : true}, 
              { text : data?.Start, fontSize : 10}, 
              { text :'End Date', fontSize : 10, bold : true}, 
              { text : data?.Stop, fontSize : 10},  
            ],
            [ 
              { text :'Status', fontSize : 10, bold : true}, 
              { text : Status, fontSize : 10}, 
              { text :'Priority', fontSize : 10, bold : true}, 
              { text : rank.name, fontSize : 10},  
            ],
            [ 
              { text :'Responsible', fontSize : 10, bold : true}, 
              { text : responsible.name, fontSize : 10}, 
              { text :'', fontSize : 10, bold : true}, 
              { text :'', fontSize : 10},  
            ],
          ]
        }
      },
      {
        layout: 'noBorders',
        margin : [0 , 3],
        table: {
          headerRows: 1,
          widths: ['*'],  
    
          body: [
            [ 
              { text :'Description', fontSize : 10, bold : true}, 
            ],
            [
              { text : remarks, fontSize : 10, margin : [0, 4]}, 
            ],
          ]
        }
      },
    ]
    regroupContent = this.reGroupJobData(data)
    regroupContent.push(...this.subJobCollection)
    content.push(...regroupContent)
    return {
      content : content
    }
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




