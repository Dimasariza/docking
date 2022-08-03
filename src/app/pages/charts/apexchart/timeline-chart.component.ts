import { Component, Input } from '@angular/core';
import { ChartOptions } from './apexchart.component';

@Component({
  selector: 'tl-apexchart',
  template: `<apexchart [chartOptions]="chartOptions"></apexchart>`,
  styles: []
})
export class TimelineApexchartComponent {
  chartOptions: Partial<ChartOptions> = {
    series: [
      {
        data: [
          {
            x: 'Code',
            y: [
              new Date('2019-03-02').getTime(),
              new Date('2019-03-04').getTime()
            ]
          },
          {
            x: 'Test',
            y: [
              new Date('2019-03-04').getTime(),
              new Date('2019-03-08').getTime()
            ]
          },
          {
            x: 'Validation',
            y: [
              new Date('2019-03-08').getTime(),
              new Date('2019-03-12').getTime()
            ]
          },
          {
            x: 'Deployment',
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
    }
  }
}
