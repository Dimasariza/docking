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

@Component({
  selector: 'ngx-inspection-menu',
  template: 
  `<div *ngFor = "let items of objectKeys(dataStatus)" class="row">
  <div *ngIf="dataStatus.Date; else elseBlock" class="col-6 d-flex" >
  <div class="col-xl-3 col-lg-3 col-md-3 col-sm-6 " >{{items}}</div>
  <div class="col-xl-3 col-lg-3 col-md-3 col-sm-6 ml-auto" >{{dataStatus[items]}}</div>
  </div>
  </div>`,
})
export class InspectionMenuComponent {
  objectKeys = Object.keys;
  dataStatus = {
    Start: '19.11.2018',
    Done: '03.12.2018',
    Responsible : 'Slamet Saputro',
    Projects: '	Batera Ship 01',
    Area: '',
    Date: {
      Created_date : '04.05.2015',
      Created_time : '14.18',
      Created_person: 'Adminstrator',
      Last_date: '06.10.2018',
      Last_time: '03.44',
      Last_person : 'Slamet Saputro',
    },
    Type: 'Activity 2',
    Status: '',
    Progress: ''}
}
