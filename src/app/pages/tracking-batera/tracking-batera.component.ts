import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Task } from './frappe-gant/lib';
import { FunctionCollection } from '../function-collection-batera/function-collection.component';
import { TenderBateraService } from '../tender-batera/tender-batera.service';
import { FrappeGanttComponent } from './frappe-gant/frappe-gantt.component';

@Component({
  selector: 'ngx-tracking-batera',
  templateUrl: './tracking-batera.component.html',
  styleUrls: ['./tracking-batera.component.scss']
})
export class TrackingBateraComponent implements OnInit {

  constructor(private tenderService : TenderBateraService,
              private route : Router,
              public FNCOL : FunctionCollection,
              
  ) { }

  @ViewChild(FrappeGanttComponent)  gantChart : FrappeGanttComponent
  public trackingData : any 
  chartTask : Task[] = []

  tasks: Task[] = [] 
  // [
  //   {
  //       id: 'Task 1',
  //       name: 'Redesign website',
  //       start: '2016-1-11',
  //       end: '2016-1-21',
  //       price: 500,
  //       progress_log: [
  //           {progress: 10, date: '2016-1-12'},
  //           {progress: 50, date: '2016-1-15'},
  //           {progress: 100, date: '2016-1-30'},
  //       ],
  //       // dependencies: 'Task 2, Task 3',
  //   },
  //   {
  //       id: 'Task 2',
  //       name: 'Redesign website 2',
  //       start: '2016-1-21',
  //       end: '2016-1-25',
  //       price: 300,
  //       progress_log: [
  //           {progress: 100, date: '2016-1-24'}
  //       ],
  //       dependencies: 'Task 1',
  //   },
  //   {
  //       id: 'Task 3',
  //       name: 'Redesign website 3',
  //       start: '2016-1-25',
  //       end: '2016-1-31',
  //       price: 200,
  //       progress_log: [
  //           {progress: 100, date: '2016-1-31'},
  //       ],
  //       dependencies: 'Task 2',
  //   },
  //   {
  //       id: 'Task 4',
  //       name: 'Redesign website',
  //       start: '2016-1-11',
  //       end: '2016-1-21',
  //       price: 100,
  //       progress_log: [
  //           {progress: 50, date: '2016-1-15'},
  //           {progress: 100, date: '2016-1-21'},
  //       ],
  //       // dependencies: 'Task 2, Task 3',
  //   },
  // ]
  // // series: ApexAxisChartSeries

  ngOnInit(): void {
    this.tenderService.getProjectSummary("", "", "", "")
    .subscribe(({data} : any) => {
      this.chartTask = data
      this.trackingData = data.map(({proyek, id_proyek}) => ({
        phases : this.FNCOL.phasesStatus(proyek.phase),
        nama_kapal : proyek.kapal.nama_kapal,
        start : proyek.repair_start,
        end : proyek.repair_end,
        year : proyek.tahun,
        id_proyek
      }))
    })
  } 

  showGantChart(data) {
    const {id_proyek} = data
    const chartTask = this.chartTask
    .find(({proyek}) => proyek.id_proyek === id_proyek)
    const task = [
      ...chartTask.proyek.work_area,
      ...chartTask.variant_work
    ]
    let jobContainer = new Array
    const regroupData = (task) => {
      task.map(work => {
        console.log(work)
        const {jobName, jobNumber, start, end, 'Price Budget' : priceBudget, progress, items} = work
        const jobItem = {
          id: this.tasks.length,
          name: jobNumber,
          price: 100,
          start, end,
          progress_log: [
              {progress : 10, date: '2016-1-15'},
              {progress : 20, date: '2016-1-21'},
          ],
          dependencies: items?.length ? [this.tasks.length - 1] : null,
        }
        this.tasks.push(jobItem)
        jobContainer.push(jobItem)
        items ? regroupData(items) : null
      })
    }
    regroupData(task)

    console.log(jobContainer)
    this.tasks = jobContainer
    this.gantChart.ngOnInit()
  }

  topButton : any = [
    {icon : 'grid-outline', desc : 'Default'},
    {icon : 'star-outline', desc : 'All Assets'},
    {icon : 'menu-outline', desc : 'Docking Plan'},
  ]

  leftButton : any = [
    // {icon : 'book-outline', desc : 'Export to PDF'},
    {icon : 'chevron-down-outline', desc : 'Extend'},
    {icon : 'info-outline', desc : 'Extended Info'}
  ]

  rightButton : any = ['Day', 'Week', 'Month', 'Year']

  clickButton(desc){
    switch(desc){
      case 'Export to PDF':
        this.navigateToPdf()
        break
    }
  }

  vesselFilter(e){
    const {desc} = e[0]
    switch(desc) {
      case 'All Assets' :
        console.log('assets')
      break;
      case 'Docking Plan' :
        console.log('docking')
      break;
      case 'Default' :
        console.log('default')
      break;
    }
  }

  navigateToPdf(){
    this.route.navigateByUrl('/pages/export-pdf')
  }

}
