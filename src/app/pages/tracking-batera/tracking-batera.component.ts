import { Component, OnInit } from '@angular/core';
import { ApexAxisChartSeries } from 'ng-apexcharts';
import { ChartOptions } from '../charts/apexchart/apexchart.component';
import { TrackingBateraService } from './tracking-batera.service';

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
      console.log(dataContainer.length)
      this.chartOptions.chart.height = dataContainer.length * 114
      
      this.trackingData = dataContainer
      this.series = [{
        name : "rencana",
        data:  this.trackingData.map(({nama_kapal, periode, updated_at}) => ({
          x: nama_kapal,
          y: [
            new Date(periode).getTime(),
            new Date(updated_at).getTime() + (3600*24*1000) // tambah 1 hari
          ]
        }))
      },
      {
        name : "actual",
        data:  this.trackingData.map(({nama_kapal, periode, updated_at}) => ({
          x: nama_kapal,
          y: [
            new Date(periode).getTime(),
            new Date(updated_at).getTime() + (3600*24*1000) // tambah 1 hari
          ]
        }))
      }
    ]
    }
    )
  } 

  exportToPDF(id){
    this.trackingService.getPDF(id)
    .subscribe(res =>{
    })
  }
}
