import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Task } from './frappe-gant/lib';
import { FunctionCollection } from '../function-collection-batera/function-collection.component';
import { ReportBateraService } from '../report-batera/report-batera.service';
import { TenderBateraService } from '../tender-batera/tender-batera.service';
import { TrackingBateraService } from './tracking-batera.service';

@Component({
  selector: 'ngx-tracking-batera',
  templateUrl: './tracking-batera.component.html',
  styleUrls: ['./tracking-batera.component.scss']
})
export class TrackingBateraComponent implements OnInit {

  constructor(private tenderService : TenderBateraService,
              private route : Router,
              private reportService : ReportBateraService,
              public FNCOL : FunctionCollection,
              
  ) { }

  public trackingData : any 

  tasks: Task[] = [
    {
        id: 'Task 1',
        name: 'Redesign website',
        start: '2016-1-11',
        end: '2016-1-21',
        price: 500,
        progress_log: [
            {progress: 10, date: '2016-1-12'},
            {progress: 50, date: '2016-1-15'},
            {progress: 100, date: '2016-1-30'},
        ],
        // dependencies: 'Task 2, Task 3',
    },
    {
        id: 'Task 2',
        name: 'Redesign website 2',
        start: '2016-1-21',
        end: '2016-1-25',
        price: 300,
        progress_log: [
            {progress: 100, date: '2016-1-24'}
        ],
        dependencies: 'Task 1',
    },
    {
        id: 'Task 3',
        name: 'Redesign website 3',
        start: '2016-1-25',
        end: '2016-1-31',
        price: 200,
        progress_log: [
            {progress: 100, date: '2016-1-31'},
        ],
        dependencies: 'Task 2',
    },
    {
        id: 'Task 4',
        name: 'Redesign website',
        start: '2016-1-11',
        end: '2016-1-21',
        price: 100,
        progress_log: [
            {progress: 50, date: '2016-1-15'},
            {progress: 100, date: '2016-1-21'},
        ],
        // dependencies: 'Task 2, Task 3',
    },
  ]
  // series: ApexAxisChartSeries

  ngOnInit(): void {
    this.tenderService.getProjectSummary("", "", "", "")
    .subscribe(({data} : any) => {
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

  topButton : any = [
    {icon : 'star-outline', desc : 'All Assets'},
    {icon : 'menu-outline', desc : 'Docking Plan'},
    {icon : 'grid-outline', desc : 'Default'}
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

  navigateToPdf(){
    this.route.navigateByUrl('/pages/export-pdf')
  }

}
