import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NbDateService } from '@nebular/theme';
import { HomeBateraService } from '../../home-batera/home-batera.service';
import { ProfileBateraService } from '../../profile-batera/profil-batera.service';
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
    private projectService:ProjectBateraService,
    private homeService : HomeBateraService,
    private profileService : ProfileBateraService,
    public datepipe: DatePipe,
    public activatedRoute : ActivatedRoute,
    @Inject( MAT_DIALOG_DATA ) public data ) { 
    this.min = this.dateService.addMonth(this.dateService.today(), -1);
  }

  onSuccess : EventEmitter<any> = new EventEmitter<any>()


  ngOnInit(): void {
    this.homeService.getAllShip()
    .subscribe(({data} : any) => {
      data.forEach(ship => {
        this.newProjectMenu.Vessel.push({nama_kapal : ship.nama_kapal, id_kapal : ship.id_kapal}) 
      });
    })

    this.profileService.getCompanyProfile()
    .subscribe(({data}: any) => {
      this.newProjectData.shipManagement = data.profile_merk_perusahaan
    })

    this.homeService.getUserLogin()
    .subscribe(({data} : any) => {
      this.newProjectData.userId = data.id_user
    })

    this.profileService.getUserData()
    .subscribe(({data} : any) => {
      const resp = data.map(user => user.username)
      this.newProjectMenu.responsible = resp
    })
  }

  newProjectMenu = {
    Vessel: [],
    Phase: ['Requisition','In Progress', 'Evaluation','Finish'],
    BaseCurrency: ['IDR', 'EURO', 'US'],
    responsible : [],
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
      // id_user : this.newProjectData.userId,
      id_user : 3,
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
      repair_additional_day : useData.additionalDay,
      responsible : useData.responsible.toLowerCase(),
      phase : useData.phase.toLowerCase(),
      selected_yard : useData.selectedYard
    }

    this.projectService.addDataProject(postBody)
    .subscribe(res => {
      console.log(res)
      this.onSuccess.emit()
    })
    this.close()
  }

  close(){this.dialogRef.close();}
}
