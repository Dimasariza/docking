import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TrackingBateraService } from './tracking-batera.service';

@Component({
  selector: 'ngx-tracking-batera',
  templateUrl: './tracking-batera.component.html',
  styleUrls: ['./tracking-batera.component.scss']
})
export class TrackingBateraComponent implements OnInit {

  constructor(private trackingService : TrackingBateraService,
              private route : Router
  ) { }

  public trackingData : any 
  // series: ApexAxisChartSeries

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
      
      this.trackingData = dataContainer
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
