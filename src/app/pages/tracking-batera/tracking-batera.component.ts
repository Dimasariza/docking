import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  // series: ApexAxisChartSeries

  ngOnInit(): void {
    this.tenderService.getProjectSummary("", "", "", "")
    .subscribe(({data} : any) => {
      this.trackingData = data.map(({proyek, id_proyek}) => ({
        phases : this.FNCOL.phasesStatus(proyek.phase),
        nama_kapal : proyek.kapal.nama_kapal + ' -DD- ' + proyek.tahun,
        periode : proyek.repair_start,
        id_proyek
      }))
    })
  } 

        // data.map(({nama_kapal, id_kapal, proyek}) => (
      //   proyek.map(({id_proyek, phase, repair_start, repair_end}) => (
      //     dataContainer.push({
      //       nama_kapal: nama_kapal, 
      //       phases: this.FNCOL.phasesStatus(phase), 
      //       periode: repair_start, 
      //       updated_at: repair_end, 
      //       id_kapal : id_kapal, 
      //       id_proyek : id_proyek
      //     })
      //   ))
      // ))

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
