import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { TenderService } from '../tender/tender.service';
import { FrappeGanttComponent } from './frappe-gant/frappe-gantt.component';
import { CommonFunction } from '../../component/common-function/common-function';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
@Component({
  selector: 'ngx-tracking-component',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.scss']
})
export class TrackingComponent implements OnInit {
  constructor(
    private tenderService : TenderService,
    private router : Router,
    public commonFunction : CommonFunction,
  ) {  }

  @ViewChild(FrappeGanttComponent) gantChart : FrappeGanttComponent
  public trackingData : any [] = [];
  public projectData : any;
  chartTask : any [] = [];
  public tasks: any [] = [];
  
  ngOnInit(): void {
    this.tenderService.getProjectSummary({})
    .subscribe(({data} : any) => {
      console.log(data);
      
      this.trackingData = data;
      this.vesselFilter();
      this.chartTask = data;
    })
  }

  columns = [
    { name: 'Ship Name', type : 'navTo', prop : 'nama_kapal', width : 320, title : 'Nav To'},
    { name: 'Year', type : 'text', prop : 'tahun', width : 100},
    { name: 'R', type : 'phase', prop : 'phaseStatus', width : 40, unSort : true},
    { name: 'P', type : 'phase', prop : 'phaseStatus', width : 40, unSort : true},
    { name: 'E', type : 'phase', prop : 'phaseStatus', width : 40, unSort : true},
    { name: 'F', type : 'phase', prop : 'phaseStatus', width : 80, unSort : true},
    { name: 'Start', type : 'date', prop : 'off_hire_start', width : 280},
    { name: 'End', type : 'date', prop : 'off_hire_end', width : 280},
    { name : '', type : 'button', width : 150, unSort : true,
      button :  [ 
            { menu : 'Gant Chart', status : 'primary', placeholder : 'Gant Chart' },
      ], 
    },
  ];

  handleClickButton(button, data = null) {
    if(button == 'Gant Chart') this.showGantChart(data)
    if(button == 'Nav To')
    this.router.navigateByUrl('/pages/report/' + data.id_proyek);
  }

  vesselFilter(filter = null){
    this.projectData = this.trackingData.map(({proyek, work_area : reportWorkArea, variant_work}) => {
      const {kapal : {nama_kapal, status : shipStatus}, tahun, phase} = proyek;
      const phaseStatus = this.commonFunction.setPhase(phase);
      return {...proyek, phaseStatus, nama_kapal, tahun, shipStatus, reportWorkArea, variant_work};
    })
    if(filter == 'Asset') {
      this.projectData = this.projectData.filter(project => project.shipStatus == 1);
    }
  }

  showGantChart(data) {
    let { reportWorkArea = [], variant_work = [] } = data;
    if(!this.commonFunction.arrayNotEmpty(reportWorkArea)) reportWorkArea = [];
    if(!this.commonFunction.arrayNotEmpty(variant_work)) variant_work = [];
    const allWorkArea = [...reportWorkArea, ...variant_work];
    let tasks = [];
    let date = this.commonFunction.transformDate(new Date());
    reconstructData(allWorkArea)
    function reconstructData(work_area) {
      let price : any = 0;
      let dependencies = [];
      work_area.forEach(({ id, jobName : name, unitPriceActual = "", 
        unitPriceAddOn = "", start, end, items = [], progress, 
      }) => {
        if(unitPriceActual) price = unitPriceActual;
        if(unitPriceAddOn) price = unitPriceAddOn;
        if(items?.length) reconstructData(items)
        if(typeof progress != 'object') progress = [{progress : 0, date}];
        tasks.push({id, name, price, start, end, progress_log: progress, dependencies})
      })
    }
    this.tasks = tasks;
    this.gantChart.viewGantChart(tasks)
  }
}