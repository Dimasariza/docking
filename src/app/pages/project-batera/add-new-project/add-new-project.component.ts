import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NbDateService } from '@nebular/theme';
import { HomeService } from '../../home-batera/home-batera.service';
import { ProjectBateraService } from '../project-batera.service';

@Component({
  selector: 'ngx-add-new-project',
  templateUrl: './add-new-project.component.html',
})
export class AddNewProjectComponent implements OnInit {
  min: Date;
  constructor(
    protected dateService: NbDateService<Date>,
    private dialogRef: MatDialogRef<AddNewProjectComponent>,
    private service:ProjectBateraService,
    private homeService : HomeService,
    public datepipe: DatePipe,
    @Inject( MAT_DIALOG_DATA ) public data ) { 
    this.min = this.dateService.addMonth(this.dateService.today(), -1);
  }

  ngOnInit(): void {
    this.service.getShip()
    .subscribe(({data} : any) => {
      data.forEach(ship => {
        this.newProjectMenu.Vessel.push({nama_kapal : ship.nama_kapal, id_kapal : ship.id_kapal}) 
      });
    })

    this.service.getProfilePerusahaan()
    .subscribe(({data}: any) => {
      this.newProjectData.shipManagement = data.profile_merk_perusahaan
    })

    this.homeService.getUserLogin()
    .subscribe(({data} : any) => {
      this.newProjectData.userId = data.id_user
    })
  }

  newProjectMenu = {
    Vessel: [],
    Phase: ['Requisition','In Progress','Finish', 'Evaluation'],
    BaseCurrency: ['IDR', 'EURO', 'US'],
    responsible : ['SA', 'FB'],
  } 

  public newProjectData = {
    offHirePeriod : "",
    repairPeriod :"",
    repairInDockDate : "",
    vessel : '',
    responsible : '',
    phase : '',
    baseCurrency : '',
    userId : '',
    shipManagement : ''
  }

  addNewProject(data){
    let useData = data.value
    console.log(data)
    const {offHirePeriod, repairPeriod, repairInDockDate} = this.newProjectData

    const off_hire_start  = this.datepipe.transform(offHirePeriod['start'] , 'yyyy-MM-dd');
    const off_hire_end  = this.datepipe.transform(offHirePeriod['end'] , 'yyyy-MM-dd');
    
    const repair_start = this.datepipe.transform(repairPeriod['start'] , 'yyyy-MM-dd');
    const repair_end  = this.datepipe.transform(repairPeriod['end'] , 'yyyy-MM-dd');

    const repair_in_dock_start = this.datepipe.transform(repairInDockDate['start'] , 'yyyy-MM-dd');
    const repair_in_dock_end  = this.datepipe.transform(repairInDockDate['end'] , 'yyyy-MM-dd');

    const postBody = {
      id_kapal : this.newProjectMenu.Vessel[useData.vessel].id_kapal,
      id_user : this.newProjectData.userId,
      // id_user : 3,
      tahun : useData.yearProject,
      mata_uang : this.newProjectMenu.BaseCurrency[useData.baseCurrency],
      off_hire_start : off_hire_start,
      off_hire_end : off_hire_end,
      off_hire_deviasi : useData.deviation,
      off_hire_rate_per_day : useData.charterRate,
      off_hire_bunker_per_day : useData.bunker,
      repair_start : repair_start,
      repair_end : repair_end,
      repair_in_dock_start : repair_in_dock_start,
      repair_in_dock_end : repair_in_dock_end,
      repair_additional_day : useData.additionalDay
    }

    this.service.addDataProject(postBody)
    .subscribe(res => {
      console.log(res)
    })
    this.close()
  }

  close(){this.dialogRef.close();}
}
