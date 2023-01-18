import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { FunctionCollection } from '../function-collection-batera/function-collection.component';
import { TenderBateraService } from '../tender-batera/tender-batera.service';
import { FrappeGanttComponent } from './frappe-gant/frappe-gantt.component';

@Injectable({ providedIn: 'root' })
@Component({
  selector: 'ngx-tracking-batera',
  templateUrl: './tracking-batera.component.html',
  styleUrls: ['./tracking-batera.component.scss']
})
export class TrackingBateraComponent implements OnInit {
  constructor(private tenderService : TenderBateraService,
              public FNCOL : FunctionCollection,
  ) {  }

  public trackingData : any 
  chartTask : any [] = []
  tasks: any [] = []
  @ViewChild(FrappeGanttComponent) gantChart : FrappeGanttComponent
  
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
    const workArea = chartTask.proyek.work_area.length ? chartTask.proyek.work_area : []
    const variantWork = chartTask.variant_work.length ? chartTask.variant_work : [] 
    const task = [
      ...workArea, ...variantWork
    ]
    let jobContainer = new Array
    const regroupData = (task) => {
      task.map(work => {
        const {jobName, start, end, 'Price Budget' : priceBudget = 0, progress, 'Price Contract' : priceContract = 0, items, id} = work
        const parentIndex = id.toString().split('').map(number => parseInt(number))
        parentIndex.pop()
        const dependenciesId =
        parentIndex.length ? parentIndex.join('') : null
        const jobItem = {
          id : id.toString(),
          name: jobName,
          price: 100,
          start, end,
          progress_log: [
              {progress : 10, date: '2016-1-15'},
              {progress : 20, date: '2016-1-21'},
          ],
          dependencies:  [dependenciesId]
        }
        jobContainer.push(jobItem)
        if(this.tasks.length < jobContainer.length) this.tasks.push(jobItem);
        items?.length ? regroupData(items) : null
      })
      return jobContainer
    }
    this.tasks = regroupData(task)
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


}
