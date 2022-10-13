import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NbDateService } from '@nebular/theme';
import { HomeBateraService } from '../../home-batera/home-batera.service';
import { ProfileBateraService } from '../../profile-batera/profil-batera.service';
import { ProjectBateraService } from '../project-batera.service';

@Component({
  selector: 'ngx-project-data',
  templateUrl: './project-data.component.html',
})
export class ProjectDataComponent implements OnInit {
  constructor(
    protected dateService: NbDateService<Date>,
    private dialogRef: MatDialogRef<ProjectDataComponent>,
    private homeService : HomeBateraService,
    private profileService : ProfileBateraService,
    private projectService : ProjectBateraService,
    public datepipe: DatePipe,
    public activatedRoute : ActivatedRoute,
    @Inject( MAT_DIALOG_DATA ) public data ) { 
    this.min = this.dateService.addMonth(this.dateService.today(), -1);
  }
  min: Date;
  onSuccess : EventEmitter<any> = new EventEmitter<any>()

  newProjectMenu = {
    vessel: null,
    Phase: ['requisition','in_progress', 'evaluasi','finish'],
    phase: ['Requisition','In Progress', 'Evaluation','Finish'],
    BaseCurrency: ['IDR', 'EURO', 'US'],
    responsible : null,
    shipManagement : null
  } 

  public projectData : any = {}
  disabledData : boolean = false

  ngOnInit(): void {
    this.profileService.getUserData(1, 10, '', "shipyard", '')
    .subscribe(({data} : any) => {
      this.newProjectMenu.responsible = data
    });
    this.homeService.getAllShip()
    .subscribe(({data} : any) => {
      this.newProjectMenu.vessel = data
    });
    
    if(this.data.dial === "Update"){
      this.projectData = this.data.project
      this.disabledData = true
    } else {
      this.disabledData = false
    }
    this.profileService.getCompanyProfile()
    .subscribe(({data} : any) => {
      this.newProjectMenu.shipManagement = data.profile_merk_perusahaan
    })
  }

  submitProject(newData){
    if(this.data.dial === "Add") {
      this.addNewProject(newData)
    }
    if(this.data.dial === "Update"){
      this.updateProjectData(newData)
    }
  }
  
  checkPostBody = (postBody) => {
    Object.keys(postBody).filter(k => {
      if (postBody[k] === undefined || postBody[k] === null) return k;
    }).map(item => postBody[item] = "")
    return postBody
  }

  addNewProject(newData){
    let postBody = this.checkPostBody(newData.value)
    postBody = {
      ...postBody,
      ...this.transformDate(postBody)
    }
    this.projectService.addDataProject(postBody)
    .subscribe(res => {
      this.onSuccess.emit()
      this.close()
    })
  }

  transformDate = (data) => {
    const {offHirePeriod, repairPeriod, repairInDock} = data
    if(offHirePeriod){
      data.off_hire_start = this.datepipe.transform(offHirePeriod?.start , 'yyyy-MM-dd')
      data.off_hire_end = this.datepipe.transform(offHirePeriod?.end , 'yyyy-MM-dd')
    } 
    if(repairPeriod){
      data.repair_start = this.datepipe.transform(repairPeriod?.start , 'yyyy-MM-dd')
      data.repair_end = this.datepipe.transform(repairPeriod?.end , 'yyyy-MM-dd')
    }
    if(repairInDock){
      data.repair_in_dock_start = this.datepipe.transform(repairInDock?.start , 'yyyy-MM-dd')
      data.repair_in_dock_end = this.datepipe.transform(repairInDock?.end , 'yyyy-MM-dd')
    }
    return data
  }

  updateProjectData(newData){
    let postBody = this.checkPostBody(newData.value)
    postBody = {
      ...this.projectData, 
      ...postBody,
      ...this.transformDate(postBody)
    }
    this.projectService.updateProject(postBody)
    .subscribe(data => console.log(data))
    this.close()
  }

  close(){this.dialogRef.close();}
}
