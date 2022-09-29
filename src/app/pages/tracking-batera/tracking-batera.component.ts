import { Component, OnInit } from '@angular/core';
import { ChartOptions } from '../charts/apexchart/apexchart.component';
import { TrackingBateraService } from './tracking-batera.service';

@Component({
  selector: 'ngx-tracking-batera',
  templateUrl: './tracking-batera.component.html',
  styleUrls: ['./tracking-batera.component.scss']
})
export class TrackingBateraComponent implements OnInit {
  public chartData : any
  chartOptions: Partial<ChartOptions> = {
    series: [ 
      // {
      //   data: {
      //     x : 'nama kapal',
      //     y: [
      //       new Date('2019-03-02').getTime(),
      //       new Date('2019-03-04').getTime()
      //     ]
      //   }
      // }
    ],

    chart: {
      height: 350,
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
        return label// + ': ' + diff + (diff > 1 ? ' days' : ' day')
      },
    }
  }
  constructor(
    private trackingService : TrackingBateraService
  ) { }

  public trackingData : any

  ngOnInit(): void {
    this.trackingService.getDataTracking()
    .subscribe(({data} : any) => {
      let dataTracking = new Array
      let chartTracking = new Array
      data.forEach(item => {
        dataTracking.push(
          {'Ship Name': item.nama_kapal, phases: [true, true, false], periode: item.created_at}
        )

        const populateData = (item) => {
          const {nama_kapal} = item
          return {
            data: {
                x : nama_kapal,
                y: [
                  new Date('2019-03-02').getTime(),
                  new Date('2019-03-04').getTime()
                ]
            },
          }
        }
        // this.chartOptions.series =  [populateData(item)]
      });
      this.trackingData = dataTracking
      this.chartData = chartTracking
      console.log(this.chartData)
      
    })
  } 


}
