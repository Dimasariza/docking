import { Component } from '@angular/core';
import { ChartOptions } from '../../charts/apexchart/apexchart.component';

@Component({
  selector: 'ngx-sub-menu-report',
  templateUrl: './sub-menu-report.component.html',
  styleUrls: ['./sub-menu-report.component.scss']
})
export class SubMenuReportComponent   {
    data = [
      {title: 'Batera 01', phases: [true, true, false], periode: '12/12/2022'},
      {title: 'Batera 02', phases: [true, true, false], periode: '12/12/2022'},
      {title: 'Batera 03', phases: [true, true, false], periode: '12/12/2022'},
      {title: 'Batera 04', phases: [true, true, false], periode: '12/12/2022'}
    ]
  
    chartOptions: Partial<ChartOptions> = {
      series: [ 
        {
          data: [
            {
              x: 'Batera 01',
              y: [
                new Date('2019-03-02').getTime(),
                new Date('2019-03-04').getTime()
              ]
            },
            {
              x: 'Batera 02',
              y: [
                new Date('2019-03-04').getTime(),
                new Date('2019-03-08').getTime()
              ]
            },
            {
              x: 'Batera 03',
              y: [
                new Date('2019-03-08').getTime(),
                new Date('2019-03-12').getTime()
              ]
            },
            {
              x: 'Batera 04',
              y: [
                new Date('2019-03-12').getTime(),
                new Date('2019-03-18').getTime()
              ]
            }
          ]
        }
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
}
