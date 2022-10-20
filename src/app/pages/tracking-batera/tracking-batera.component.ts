import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApexAxisChartSeries } from 'ng-apexcharts';
import { ChartOptions } from '../charts/apexchart/apexchart.component';
import { TrackingBateraService } from './tracking-batera.service';

@Component({
  selector: 'ngx-tracking-batera',
  templateUrl: './tracking-batera.component.html',
  styleUrls: ['./tracking-batera.component.scss']
})
export class TrackingBateraComponent implements OnInit {
  lineChartOption: Partial<ChartOptions> = {
    series: [
      {
        name: "Rencana",
        data: [10, 30, 35, 40, 50, 62, 69, 91, 100],
        color: "#2665fc"
      },
      {
        name: "Actual",
        data: [10, 41, 45, 51, 59, 62, 69, 91, 100],
        color: "#008a2d"
      }
    ],
    legend: {
      show: false
    },
    chart: {
      height: 200,
      // width: 340,
      offsetX: 0,
      type: "line",
      zoom: {
        enabled: false
      },
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      lineCap: 'square',
    },
    // title: {
    //   text: "Product Trends by Month",
    //   align: "left"
    // },
    grid: {
      show: false
    },
    yaxis: {
      labels: {
        show: false
      },
      show: false
    },
    xaxis: {
      axisBorder: {
        show: false
      },
      labels: {
        show: false
      },
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep"
      ]
    },
  };

  chartOptions: Partial<ChartOptions> = {
    chart: {
      height: 300,
      type: 'rangeBar'
    },
    plotOptions: {
      bar: {
        horizontal: true
      }
    },
    grid: {
      show: false
    },
    xaxis: {
      type: 'datetime'
    },
    yaxis: {
      show: false  
    },
    dataLabels: {
      enabled: true,
      formatter: function(val, opts) {
        var label = opts.w.globals.labels[opts.dataPointIndex]
        // var a = moment(val[0])
        // var b = moment(val[1])
        // var diff = b.diff(a, 'days')
        return label // + ': ' + diff + (diff > 1 ? ' days' : ' day')
      },
    }
  }

  constructor(private trackingService : TrackingBateraService,
              private route : Router
  ) { }

  public trackingData : any 
  series: ApexAxisChartSeries

  phasesStatus(status){
    if(status === 'requisition'){
      status = [true, false, false, false]
    }
    if(status === 'in_progress'){
      status = [true, true, false, false]
    } 
    if(status === 'evaluasi'){
      status = [true, true, true, false]
    }
    if(status === 'finish'){
      status = [true, true, true, true]
    }
    return status
  }

  ngOnInit(): void {
    this.trackingService.getDataTracking()
    .subscribe(({data} : any) => {
      let dataContainer = new Array
      data.map(({nama_kapal, id_kapal, proyek}) => (
        proyek.map(({id_proyek, phase, repair_start, repair_end}) => (
          dataContainer.push({
            nama_kapal: nama_kapal, 
            phases: this.phasesStatus(phase), 
            periode: repair_start, 
            updated_at: repair_end, 
            id_kapal : id_kapal, 
            id_proyek : id_proyek
          })
        ))
      ))
      this.chartOptions.chart.height = dataContainer.length * 112
      
      this.trackingData = dataContainer
      // console.log(this.trackingData);
      
      this.series = [{
        name: "rencana",
        // type: "rangeBar",
        data:  this.trackingData.map(({nama_kapal, periode, updated_at}) => ({
          x: nama_kapal,
          y: [
            new Date(periode).getTime(),
            new Date(updated_at).getTime() + (3600*24*1000) // tambah 1 hari
          ]
        }))
      },
      {
        name: "actual",
        // type: "rangeBar",
        data:  this.trackingData.map(({nama_kapal, periode, updated_at}) => ({
          x: nama_kapal,
          y: [
            new Date(periode).getTime(),
            new Date(updated_at).getTime() + (3600*24*1000) // tambah 1 hari
          ]
        }))
      },
      // {
      //   name: "Kurva S",
      //   type: "line",
      //   data:  this.trackingData.map(({nama_kapal, periode, updated_at}) => ({
      //     x: nama_kapal,
      //     y: []
      //   }))
      // }
    ]
    }
    )
  } 

  topButton : any = [
    {icon : 'star-outline', desc : 'All Assets'},
    {icon : 'menu-outline', desc : 'Docking Plan'},
    {icon : 'grid-outline', desc : 'Default'}
  ]

  leftButton : any = [
    {icon : 'book-outline', desc : 'Export to PDF'},
    {icon : 'chevron-down-outline', desc : 'Extend'},
    {icon : 'info-outline', desc : 'Extended Info'}
  ]

  rightButton : any = ['Week', 'Month', 'Year']

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
