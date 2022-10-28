import { Component, Injectable, OnInit } from '@angular/core';
import pdfMake from "pdfmake/build/pdfmake";  
import pdfFonts from "pdfmake/build/vfs_fonts";  
import { FunctionCollection } from '../function-collection-batera/function-collection.component';
import { ProfileBateraService } from '../profile-batera/profil-batera.service';
import { TenderBateraService } from '../tender-batera/tender-batera.service';
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
  constructor(private pdfService : PDFService,
              private profileService : ProfileBateraService,
              private tenderService : TenderBateraService,
              private FNCOL : FunctionCollection,
  ) { }

  ngOnInit(): void {}

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

  async generatePDFBasedOnJob(projectData, data){
    // Document head
    const shipname = projectData.kapal.nama_kapal
    const head = shipname + ' -DD- ' + projectData.tahun
    const {jobNumber, jobName} = data
    const job = jobNumber + '.' + jobName
    const projectHead = await this.projectHead(head, job)

    // Document job details
    this.regroupJobData(data.items, 'work_area')
    const content = [
      projectHead,
      ...this.projectDetails({...data, shipname}),
      this.dataHeading(),
      ...this.jobCollection
    ]
    pdfMake.createPdf({content}).open();  
  }

  async projectHead(head, job){
    const url = await this.getBase64ImageFromURL('./assets/images/Logo/Logo Sikomodo.jpeg')
    return {
        columns : [
          [
            {  
              text: head,  
              fontSize: 16,  
              color: '#222',
              margin : [0 , 10, 0, 6],
            }, 
            {  
              text: job,  
              fontSize: 12,  
              color: '#047886',
              margin : [0 , 6],
            }, 
          ],
          {
            image : url,
            fit: [80, 80],
            alignment : 'right'
          },
        ],
      }
  }

  projectDetails(data){
    const {Status, rank, responsible, shipname, remarks} = data
    return [
        {
        layout: 'noBorders',
        margin : [0 , 6],
        table: {
          headerRows: 1,
          widths: [ '*', '*', '*', '*'],  
    
          body: [
            [ 
              { text :'Vessel', fontSize : 10, bold : true}, 
              { text : shipname, fontSize : 10}, 
              { text :'Responsible', fontSize : 10, bold : true}, 
              { text : responsible.name, fontSize : 10},
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
  }

  dataHeading() {
    return {
      layout: 'lightHorizontalLines',
      margin : [0 , 3],
      table: {
        headerRows: 1,
        widths: [ 60, 180, '*', 60, 60, 30],  
        body: [
          [ 
            { text :'Job Number', fontSize : 10, bold : true}, 
            { text :'Item Name', fontSize : 10, bold : true}, 
            { text :'Priority', fontSize : 10, bold : true}, 
            { text :'Type', fontSize : 10, bold : true},
            { text :'Category', fontSize : 10, bold : true}, 
            { text :'%', fontSize : 10, bold : true}, 
          ],
        ]
      }
    }
  }

  jobCollection : any = []
  variantCollection : any = []
  regroupJobData(data, jobDetails){
    data.map(job => {
      const {jobNumber, jobName, rank, unit, category, progress, remarks, items} = job
      const contentData = {
        layout: {
          hLineWidth: (i, node) => (i === 0 || i === node.table.body.length) ? 0 : 1,
          vLineWidth: () => 0,
          hLineColor: () => '#aaa',
          paddingLeft: (i) => i === 0 ? 0 : 8,
          paddingRight: (i, node) => (i === node.table.widths.length - 1) ? 0 : 8,
        },
        margin : [0 , 3],
        table: {
          headerRows: 1,
          widths: [ 60, 180, '*', 60, 60, 30],  
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
    if(jobDetails === 'work_area') this.jobCollection.push(contentData);
    if(jobDetails === 'variant_work') this.variantCollection.push(contentData);
    items?.length ? this.regroupJobData(items, jobDetails) : null
    })  
  }

  async generatePDFBasedOnProject(projectDetail, workProject, yardDatas){
    // Document head
    const {proyek : project, variant_work, id_tender} = projectDetail
    const {work_area} = workProject
    const {kapal, tahun} = project
    const {nama_kapal : shipname} = kapal
    const head = shipname + ' -DD- ' + tahun
    const job = 'Periodic Docking Report KIZ'
    const projectHead = await this.projectHead(head, job)
    
    //Summary
    const summaryHead = this.getSummmaryHead(projectDetail, workProject, yardDatas)
    const projectSummary = await this.getProjectSummay(projectDetail, workProject, yardDatas)
    const priceSummary = this.getPriceSummary(projectDetail, workProject, yardDatas)
    this.regroupJobData(work_area, 'work_area')
    this.regroupJobData(variant_work, 'variant_work')
    const content = [
      projectHead,
      {text : "Summary" ,fontSize : 12, bold : true, color: '#047886'},
      summaryHead,
      // {columns : [
        ...projectSummary,
        ...priceSummary,
      // ]},
      {text : "Jobs Summary" ,fontSize : 12, bold : true, color: '#047886'},
      this.dataHeading(),
      ...this.jobCollection,
      {text : "Variant Jobs Summary" ,fontSize : 12, bold : true, color: '#047886'},
      this.dataHeading(),
      ...this.variantCollection,
    ]
    pdfMake.createPdf({content}).open();  
  }

  getSummmaryHead(projectDetail, workProject, yardDatas){
    return [
    {
      layout: 'noBorders',
      margin : [0 , 3],
      table: {
        headerRows: 1,
        widths: [ '*', '*', '*', '*' ],  
        body: [
          [ 
            { text :'Responsible', fontSize : 10, bold : true}, 
            { text :'Nur asis', fontSize : 10}, 
            { text :'Issued', fontSize : 10, bold : true}, 
            { text :'Tanggal', fontSize : 10},
          ],
          [ 
            { text :'Approved By', fontSize : 10, bold : true}, 
            { text :'Responsible 1', fontSize : 10}, 
            { text :'Approved', fontSize : 10, bold : true}, 
            { text :'Accepted', fontSize : 10},
          ],
          [ 
            { text :'Yard', fontSize : 10, bold : true}, 
            { text :'Dok Pantai Lamongan', fontSize : 10}, 
            { text :'State', fontSize : 10, bold : true}, 
            { text :'Pending', fontSize : 10},
          ],
          [ 
            { text :'Summary', fontSize : 10, bold : true}, 
            { text :'Pending', fontSize : 10, colSpan : 2},
            '', ''
          ],
          [ 
            { text :'Cost', fontSize : 10, bold : true}, 
            { text :'', fontSize : 10, colSpan : 2},
            '', ''
          ],
          [ 
            { text :'Progress', fontSize : 10, bold : true}, 
            { text :'', fontSize : 10, colSpan : 2},
            '', ''
          ],
        ]
      }
    }]
  }

  async getProjectSummay(projectDetail, workProject, yardDatas){
    const {proyek : project, status} = projectDetail
    const {nama_galangan} = yardDatas
    const {kapal, phase, mata_uang, off_hire_start, off_hire_end, off_hire_period, off_hire_deviasi, off_hire_rate_per_day,
      off_hire_bunker_per_day, repair_period, repair_start, repair_end, repair_in_dock_start, repair_in_dock_end, repair_in_dock_period, repair_additional_day} = project
    return [
      {
        layout: 'noBorders',
        margin : [0 , 6],
        table: {
          headerRows: 1,
          widths: [ '*', '*', '*'],  
    
          body: [
            [ 
              { text :'Vessel', fontSize : 10, bold : true}, 
              { text : kapal.nama_kapal, fontSize : 10, colSpan : 2}, 
              ''
            ],
            [ 
              { text :'Phase', fontSize : 10, bold : true}, 
              { text : this.FNCOL.convertPhase(phase), fontSize : 10 ,colSpan : 2}, 
              ''
            ],
            [ 
              { text :'Selected Yard', fontSize : 10, bold : true}, 
              { text : nama_galangan , fontSize : 10, colSpan : 2}, 
              ''
            ],           
            [ 
              { text :'Base Currency', fontSize : 10, bold : true}, 
              { text : mata_uang, fontSize : 10, colSpan : 2}, 
              ''
            ],           
            [ 
              { text :'Off Hire Period', fontSize : 10, bold : true}, 
              { text : status, fontSize : 10, colSpan : 2}, 
              ''
            ],
            [ 
              { text :'Off Hire Period', fontSize : 10, bold : true}, 
              { text : `${off_hire_start} - ${off_hire_end}`, fontSize : 10}, 
              { text : `${off_hire_period} Days`, fontSize : 10}, 
            ],
            [ 
              { text :'- Deviation', fontSize : 10, bold : true}, 
              { text : `${off_hire_deviasi} Days` , fontSize : 10, colSpan : 2}, 
              ''
            ],            
            [ 
              { text :'- Rate', fontSize : 10, bold : true}, 
              { text : off_hire_rate_per_day, fontSize : 10, }, 
              { text : `${this.FNCOL.convertCurrency(mata_uang)} ${off_hire_rate_per_day * off_hire_period}`, fontSize : 10, },
            ],               
            [ 
              { text :'- Bunker', fontSize : 10, bold : true}, 
              { text : off_hire_bunker_per_day, fontSize : 10, }, 
              { text : `${this.FNCOL.convertCurrency(mata_uang)} ${off_hire_bunker_per_day * off_hire_period}`, fontSize : 10, },
            ],                
            [ 
              { text :'Repair Period', fontSize : 10, bold : true}, 
              { text : `${repair_start} - ${repair_end}`, fontSize : 10, }, 
              { text : `${repair_period} Days`, fontSize : 10, },
            ],                
            [ 
              { text :'- In Dock', fontSize : 10, bold : true}, 
              { text : `${repair_in_dock_start} - ${repair_in_dock_end}`, fontSize : 10, }, 
              { text : `${repair_in_dock_period} Days`, fontSize : 10, },
            ],            
            [ 
              { text :'Additional Day', fontSize : 10, bold : true}, 
              { text : repair_additional_day, fontSize : 10, colSpan : 2}, 
              ''
            ],            
          ]
        }
      },
    ]
  }

  getPriceSummary(projectDetail, workProject, yardDatas) {
    return [
      {
        layout: 'lightHorizontalLines',
        margin : [0 , 3],
        table: {
          headerRows: 1,
          widths: [ '*', '*', '*', '*' ],  
          body: [
            [ 
              { text :'Totals', fontSize : 10, bold : true}, 
              { text :'Budget', fontSize : 10, bold : true}, 
              { text :'Contract', fontSize : 10, bold : true}, 
              { text :'Actual', fontSize : 10, bold : true},
            ],
            [ 
              { text :'Offhire Days', fontSize : 10, bold : true}, 
              { text :'Responsible 1', fontSize : 10}, 
              { text :'Approved', fontSize : 10}, 
              { text :'Accepted', fontSize : 10},
            ],
            [ 
              { text :'Owner Exp', fontSize : 10, bold : true}, 
              { text :'Dok Pantai Lamongan', fontSize : 10}, 
              { text :'State', fontSize : 10, bold : true}, 
              { text :'Pending', fontSize : 10},
            ],
            [ 
              { text :'- Supplies', fontSize : 10, bold : true}, 
              { text :'Pending', fontSize : 10, colSpan : 2},
              '', ''
            ],
            [ 
              { text :'- Services', fontSize : 10, bold : true}, 
              { text :'', fontSize : 10, colSpan : 2},
              '', ''
            ],
            [ 
              { text :'- Class', fontSize : 10, bold : true}, 
              { text :'', fontSize : 10, colSpan : 2},
              '', ''
            ],
            [ 
              { text :'- Other', fontSize : 10, bold : true}, 
              { text :'', fontSize : 10, colSpan : 2},
              '', ''
            ],
            [ 
              { text :'Owner Canceled Jobs', fontSize : 10, bold : true}, 
              { text :'', fontSize : 10, colSpan : 2},
              '', ''
            ],
            [ 
              { text :'Owner Additional Cost', fontSize : 10, bold : true, color : '#FF0000'}, 
              { text :'', fontSize : 10, colSpan : 2},
              '', ''
            ],
            [ 
              { text :'Yard Cost', fontSize : 10, bold : true}, 
              { text :'', fontSize : 10, colSpan : 2},
              '', ''
            ],
            [ 
              { text :'- Yard Additional Cost', fontSize : 10, bold : true}, 
              { text :'', fontSize : 10, colSpan : 2},
              '', ''
            ],
            [ 
              { text :'Yard Cancelled Jobs', fontSize : 10, bold : true, color : '#FF0000'}, 
              { text :'', fontSize : 10, colSpan : 2},
              '', ''
            ],
            [ 
              { text :'Total Cost', fontSize : 10, bold : true}, 
              { text :'', fontSize : 10, colSpan : 2},
              '', ''
            ],
          ]
        }
      }]
  }

  buttons = [
    {desc : 'show'},
    {desc : 'download'}
  ]
}






