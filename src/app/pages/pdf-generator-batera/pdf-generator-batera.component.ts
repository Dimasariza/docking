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

  /*
  * This use of this function is to create pdf based on jobs
  */
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
    if(data === null) return
    const jobDatas =  data.map(job => {
      const {jobNumber, jobName, rank, unit, category, progress, remarks, items, id} = job
      const parentId = id.toString().split('')
      let useUnit =
      parentId.length === 1 
      ? this.FNCOL.jobUnit
      : this.FNCOL.subJobUnit
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
              { text : this.FNCOL.rank[rank], fontSize : 9,}, 
              { text : useUnit[unit] , fontSize : 9,},   
              { text : this.FNCOL.category[category] , fontSize : 9,}, 
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

  /*
  * The use of this function is to create pdf based on all projects summary
  */

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
    const costDetails = this.getCostDetails(projectDetail, workProject, yardDatas)
    const cardProject = this.cardProjectSummary(projectDetail, workProject, yardDatas)

    this.regroupJobData(work_area, 'work_area')
    this.regroupJobData(variant_work, 'variant_work')
    const footer = (currentPage, pageCount, pageSize) => {
      return { text : currentPage, alignment : 'right', fontSize : 8, margin : [12,12]}
    }
    const content = [
      projectHead,
      cardProject,
      {text : "Summary" ,fontSize : 12, bold : true, color: '#047886', margin : [0, 10, 0, 0]},
      summaryHead,
      ...projectSummary,
      ...priceSummary,
      {text : "" ,fontSize : 12, bold : true, color: '#047886', pageBreak:'after'},
      {text : "Cost Details" ,fontSize : 12, bold : true, color: '#047886'},
      ...costDetails,
      {text : "" ,fontSize : 12, bold : true, color: '#047886', pageBreak:'after'},
      {text : "Jobs Summary" ,fontSize : 12, bold : true, color: '#047886'},
      this.dataHeading(),
      ...this.jobCollection,
      {text : "" ,fontSize : 12, bold : true, color: '#047886', pageBreak:'after'},
      {text : "Variant Jobs Summary" ,fontSize : 12, bold : true, color: '#047886'},
      this.dataHeading(),
      ...this.variantCollection,
      {
        layout: 'noBorders',
        margin : [0 , 3],
        table: {
          headerRows: 1,
          widths: [ 'auto', 'auto' ],  
          body: [[
            { svg : this.pieChartProgress()},
            { svg : this.barChartPrice()},
          ]]
        }
      }
    ]
    pdfMake.createPdf({footer, content}).open();  
  }

  cardProjectSummary(projectDetail, workProject, yardDatas) {
    return {
      layout: {
        hLineWidth: (i, node) => {
          if(i === 0) return 1; 
          if(i === node.table.body.length) return 3
        return 0},
        vLineWidth: () => 1,
        vLineColor: () => '#aaa',
        hLineColor: (i, node) => {
          if(i === 0) return '#aaa'; 
          if(i === node.table.body.length) return '#047886'
        return 'fff'},
        paddingLeft: (i) => 5,
        paddingRight: (i, node) => 5,
      },
      table: {
        widths: [ '*', '*' ],  
        body: [
          [
            {
              columns : [
                { width: '*', text: 'IDR', fontSize: 12, color : '#047886'},
                { width: '*', text: 'Estimate At Completion', fontSize: 10, style : {alignment : 'right'}},
              ]
            },
            {
              columns : [
                { width: '*', text: 'ETD', fontSize: 12, color : '#047886'},
                { width: '*', text: 'Planned', style : {alignment : 'right', fontSize: 10}},
              ]
            },
          ],
          [
            {
              columns : [
                { width: '*', text: '3,596,085,724', fontSize: 10, bold : true, color : '#047886', alignment : 'center'},
                { width: 'auto', text: '|', fontSize: 10, alignment : 'center'},
                {
                  columns : [
                    { width: 'auto', text: '-3.36% ', fontSize: 10, color : 'green', margin : [4, 0]},
                    { width: 'auto', text: '(125.158.000)', fontSize: 6, color : 'gray', margin : [0, 3]},
                  ]
                }
              ]
            },
            {
              columns : [
                { width: '*', text: '4,596,085,724', fontSize: 10, bold : true, color : '#047886', alignment : 'center'},
                { width: 'auto', text: '|', fontSize: 10, alignment : 'center'},
                { width: '*', text: '-4.36%', fontSize: 10, color : 'green', alignment : 'center'},
              ]
            },
          ],
          [
            {
              columns : [
                { width: '*', text: 'Owner', fontSize: 8, bold : true},
                { width: 'auto', text: ':', fontSize: 8, bold : true, margin : [4, 0]},
                { width: '*', text: '796,464,600', fontSize: 8, bold : true},
                { width: 'auto', text: '|', fontSize: 8},
                {
                  columns : [
                    { width: 'auto', text: '0% ', fontSize: 8, color : 'green', margin : [2, 0]},
                    { width: 'auto', text: '(0)', fontSize: 6, color : 'gray', margin : [0, 2]},
                  ]
                }
              ]
            },
            {
              columns : [
                { width: '*', text: 'Planned', fontSize: 8, bold : true},
                { width: 'auto', text: ':', fontSize: 8, margin : [4, 0]},
                { width: '*', text: '30.08.2022', fontSize: 8},
              ]
            },
          ],
          [
            {
              columns : [
                { width: '*', text: 'Yard', fontSize: 8, bold : true},
                { width: 'auto', text: ':', fontSize: 8, bold : true, margin : [4, 0]},
                { width: '*', text: '2,799,464,600', fontSize: 8, bold : true},
                { width: 'auto', text: '|', fontSize: 8},
                {
                  columns : [
                    { width: 'auto', text: '-4.280% ', fontSize: 8, color : 'green', margin : [2, 0]},
                    { width: 'auto', text: '(125.198.000)', fontSize: 6, color : 'gray', margin : [0, 2]},
                  ]
                }
              ]
            },
            {
              columns : [
                { width: '*', text: 'Delayed Critical Jobs', fontSize: 8, bold : true},
                { width: 'auto', text: ':', fontSize: 8, margin : [4, 0]},
                { width: '*', text: '0', fontSize: 8},
              ]
            },
          ],
        ]
      }
    }
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
              { text :'Owner Additional Job', fontSize : 10, bold : true, color : '#FF0000'}, 
              { text :'', fontSize : 10, colSpan : 2},
              '', ''
            ],
            [ 
              { text :'Owner Canceled Jobs', fontSize : 10, bold : true}, 
              { text :'', fontSize : 10, colSpan : 2},
              '', ''
            ],
            [ 
              { text :'Amortization Job', fontSize : 10, bold : true}, 
              { text :'Dok Pantai Lamongan', fontSize : 10}, 
              { text :'State', fontSize : 10, bold : true}, 
              { text :'Pending', fontSize : 10},
            ],
            [ 
              { text :'Depreciation Job', fontSize : 10, bold : true}, 
              { text :'0', fontSize : 10}, 
              { text :'0', fontSize : 10, bold : true}, 
              { text :'0', fontSize : 10},
            ],
            [ 
              { text :'Yard Cost', fontSize : 10, bold : true}, 
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


  // Cost details
  getCostDetails(projectDetail, workProject, yardDatas) {
    console.log(projectDetail)
    console.log(workProject)
    const {work_area} = workProject
    const constDetails =  work_area.map(job => {
      const {jobName, 'Price Budget': priceBudget = 0, 'Price Contract' : priceContract = 0, 'Price Actual' : priceActual = 0, 'Price Add On' : priceAddOn = 0, progress, category} = job
      console.log('create pdf')
      return [
        { text : jobName, fontSize : 9, bold : true}, 
        { text : priceBudget, fontSize : 9}, 
        { text : priceContract, fontSize : 9}, 
        { text : priceActual, fontSize : 9},
        { text : priceAddOn, fontSize : 9},
        { text : category, fontSize : 9},
        { text : progress, fontSize : 9},
      ]
    })
    return [
      {
        layout: 'lightHorizontalLines',
        margin : [0 , 3],
        table: {
          headerRows: 1,
          widths: [ '*', '*', '*', '*', '*', '*', 'auto' ],  
          body: [
            [ 
              { text :'Yard Cost', fontSize : 9, bold : true}, 
              { text :'Budget', fontSize : 9, bold : true}, 
              { text :'Contract', fontSize : 9, bold : true}, 
              { text :'Actual', fontSize : 9, bold : true},
              { text :'Added', fontSize : 9, bold : true},
              { text :'Cancelled', fontSize : 9, bold : true},
              { text :'Progress Accumulated', fontSize : 9, bold : true},
            ],
            ...constDetails
          ]
        }
      },

      {text : "EXPECTED", fontSize: 9, bold : true},
      {
        columns : [
          { width: 'auto', text: 'TOTAL YARD', fontSize: 8},
          { width: 'auto', text: '2,796,222', fontSize: 8, margin : [4, 0]},
        ]
      },

      {text : "RISKS", fontSize: 9, bold : true},
      {text : "No Risks registered", fontSize: 8},
    ]
  }

  /*
  * Pie Chart Variables
  */

  pieChartProgress(){
    const done = 10 * 31.42 / 100
    const cancelled = 30 * 31.42 / 100
    const notStarted = 50 * 31.42 / 100
    const amountCompleted = 10
    return `
    <svg height="200" width="150" viewBox="0 0 20 30">
      <g>
        <circle r='10' cx="10" cy="10" fill="red" opacity='0.65'/>
        <circle r='5' cx="10" cy="10" fill="transparent" stroke="green" transform="rotate(-90) translate(-20)" opacity='0.65' stroke-width="10" stroke-dasharray="${notStarted} 31.42"  />
        <circle r='5' cx="10" cy="10" fill="transparent" stroke="purple" transform="rotate(-90) translate(-20)" opacity='0.65' stroke-width="10" stroke-dasharray="${cancelled} 31.42" />
        <circle r='5' cx="10" cy="10" fill="transparent" stroke="blue" transform="rotate(-90) translate(-20)" opacity='0.65' stroke-width="10" stroke-dasharray="${done} 31.42" />
        <circle r='5' cx="10" cy="10" fill="white" />
      </g>
      <g>
        <circle r='0.3' cx="1" cy="22.6" fill="red" />
        <text x="1.8" y="23" font-size="1px">In Progress (${amountCompleted})</text>
        <circle r='0.3' cx="12" cy="22.6" fill="green" />
        <text x="12.8" y="23" font-size="1px">Not Started (${amountCompleted})</text>
        <circle r='0.3' cx="12" cy="24" fill="purple" />
        <text x="12.8" y="24.4" font-size="1px">Cancelled (${amountCompleted})</text>
        <circle r='0.3' cx="1" cy="24" fill="blue" />
        <text x="1.8" y="24.4" font-size="1px">Done (${amountCompleted})</text>
      </g>
    </svg>
    `
  }

  barChartPrice(){
    const price = 100000
    const budget = 10
    const contract = 15
    const actual = 20
    return `
      <svg height="200" width="300" viewBox="0 0 20 30">
        <g transform="translate(1, 1) scale(1.1)" >
          <line x1="0" y1="0" x2="31" y2="0" stroke-dasharray=".5, .5" style="stroke:rgba(0,0,0, .2);stroke-width:.08" />
          <line x1="0" y1="2" x2="31" y2="2" stroke-dasharray=".5, .5" style="stroke:rgba(0,0,0, .2);stroke-width:.08" />
          <line x1="0" y1="4" x2="31" y2="4" stroke-dasharray=".5, .5" style="stroke:rgba(0,0,0, .2);stroke-width:.08" />
          <line x1="0" y1="6" x2="31" y2="6" stroke-dasharray=".5, .5" style="stroke:rgba(0,0,0, .2);stroke-width:.08" />
          <line x1="0" y1="8" x2="31" y2="8" stroke-dasharray=".5, .5" style="stroke:rgba(0,0,0, .2);stroke-width:.08" />
          <line x1="0" y1="10" x2="31" y2="10" stroke-dasharray=".5, .5" style="stroke:rgba(0,0,0, .2);stroke-width:.08" />
          <line x1="0" y1="12" x2="31" y2="12" stroke-dasharray=".5, .5" style="stroke:rgba(0,0,0, .2);stroke-width:.08" />
          <line x1="0" y1="14" x2="31" y2="14" stroke-dasharray=".5, .5" style="stroke:rgba(0,0,0, .2);stroke-width:.08" />
          <line x1="0" y1="16" x2="31" y2="16" stroke-dasharray=".5, .5" style="stroke:rgba(0,0,0, .2);stroke-width:.08" />
          <line x1="0" y1="18" x2="31" y2="18" stroke-dasharray=".5, .5" style="stroke:rgba(0,0,0, .2);stroke-width:.08" />
          <line x1="0" y1="20" x2="31" y2="20" style="stroke:rgba(0,0,0, .5);stroke-width:.1" />
          <line x1="0" y1="0" x2="0" y2="20" style="stroke:rgba(0,0,0, .5);stroke-width:.2" />
          <rect x="-3" width="5" height="${budget}" style="fill:rgba(0,0,255, .1);stroke-width:.1;stroke:rgba(0,0,255,.3)" transform="rotate(180) translate(-5, -20)" />
          <rect x="-13" width="5" height="${contract}" style="fill:rgba(0,255,0, .1);stroke-width:.1;stroke:rgba(0,255,0,.3)" transform="rotate(180) translate(-5, -20)" />
          <rect x="-23" width="5" height="${actual}" style="fill:rgba(255,0,0, .1);stroke-width:.1;stroke:rgba(255,0,0,.3)" transform="rotate(180) translate(-5, -20)" />
          <text x="3.6" y="21" font-size="1px">Budget</text>
          <text x="13.5" y="21" font-size="1px">Contract</text>
          <text x="24" y="21" font-size="1px">Actual</text>
          <text x="-6" y="18.4" font-size="1px">${price }</text>
          <text x="-6" y="16.4" font-size="1px">${price * 2}</text>
          <text x="-6" y="14.4" font-size="1px">${price * 4}</text>
          <text x="-6" y="12.4" font-size="1px">${price * 6}</text>
          <text x="-6" y="10.4" font-size="1px">${price * 8}</text>
          <text x="-6" y="8.4" font-size="1px">${price * 10}</text>
          <text x="-6" y="6.4" font-size="1px">${price * 12}</text>
          <text x="-6" y="4.4" font-size="1px">${price * 14}</text>
          <text x="-6" y="2.4" font-size="1px">${price * 16}</text>
          <text x="-6" y="0.4" font-size="1px">${price * 18}</text>
        </g>
      </svg>
    `
  }
      
  buttons = [
    {desc : 'show'},
    {desc : 'download'}
  ]
}






