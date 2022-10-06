import { Component, OnInit } from '@angular/core';
import { ApexAxisChartSeries } from 'ng-apexcharts';
import { ChartOptions } from '../charts/apexchart/apexchart.component';
import { TrackingBateraService } from './tracking-batera.service';
import * as moment from 'moment'

@Component({
  selector: 'ngx-tracking-batera',
  templateUrl: './tracking-batera.component.html',
  styleUrls: ['./tracking-batera.component.scss']
})
export class TrackingBateraComponent implements OnInit {
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

  constructor(
    private trackingService : TrackingBateraService,
  ) { }

  public trackingData : any
  series: ApexAxisChartSeries

  ngOnInit(): void {
    this.trackingService.getDataTracking()
    .subscribe(({data} : any) => {
      console.log(data)
      this.chartOptions.chart.height = data.length * 156
      this.trackingData = data.map(({nama_kapal, created_at, updated_at, id_kapal}) => ({
        "Ship Name": nama_kapal, phases: [true, true, false], periode: created_at, updated_at: moment(updated_at).add(1, 'day'), id_kapal : id_kapal
      }))
      this.series = [{
        name : "rencana",
        data:  data.map(({nama_kapal, created_at, updated_at}) => ({
          x: nama_kapal,
          y: [
            new Date(created_at).getTime(),
            new Date(updated_at).getTime() + (3600*24*1000) // tambah 1 hari
          ]
        }))
      },
      {
        name : "actual",
        data:  data.map(({nama_kapal, created_at, updated_at}) => ({
          x: nama_kapal,
          y: [
            new Date(created_at).getTime(),
            new Date(updated_at).getTime() + (3600*24*1000) // tambah 1 hari
          ]
        }))
      }
    ]
    })
  } 

  exportToPDF(id){
    this.trackingService.getPDF(id)
    .subscribe(res =>{
      console.log(res)
    })
  }
}
