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
    private homeService : HomeBateraService,
    private profileService : ProfileBateraService,
    private projectService : ProjectBateraService,
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
        this.newProjectMenu.Vessel.push({
          nama_kapal : ship.nama_kapal, id_kapal : ship.id_kapal
        }) 
      });
    })

    this.homeService.getUserLogin()
    .subscribe(({data} : any) => {
      this.newProjectMenu.userId = data.id_user
    })

    this.profileService.getUserData(1, 10, '', "shipyard", '')
    .subscribe(({data} : any) => {
      this.newProjectMenu.responsible = data
      .map(user => {
        return {
          name : user.username, 
          id : user.id_user
        }
      })
    })
    console.log(this.newProjectMenu)
  }

  newProjectMenu = {
    Vessel: [],
    Phase: ['Requisition','In_Progress', 'Evaluasi','Finish'],
    BaseCurrency: ['IDR', 'EURO', 'US'],
    responsible : [],
    userId : null,
    shipManagement : null
  } 

  addNewProject(data){
    let useData = data.value
    const {offHirePeriod, repairPeriod, repairInDock} = useData
    useData['off_hire_start'] = this.datepipe.transform(offHirePeriod['start'] , 'yyyy-MM-dd');
    useData['off_hire_end'] = this.datepipe.transform(offHirePeriod['end'] , 'yyyy-MM-dd');
    useData['repair_start'] = this.datepipe.transform(repairPeriod['start'] , 'yyyy-MM-dd');
    useData['repair_end'] = this.datepipe.transform(repairPeriod['end'] , 'yyyy-MM-dd');
    useData['repair_in_dock_start'] = this.datepipe.transform(repairInDock['start'] , 'yyyy-MM-dd');
    useData['repair_in_dock_end']  = this.datepipe.transform(repairInDock['end'] , 'yyyy-MM-dd');
    this.projectService.addDataProject(useData)
    .subscribe(res => {
      console.log(res)
      this.onSuccess.emit()
    })
    this.close()
  }

  close(){this.dialogRef.close();}
}
