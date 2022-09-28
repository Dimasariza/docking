import { DatePipe, KeyValue } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NbDateService } from '@nebular/theme';
import { ProjectBateraService } from '../project-batera.service';

@Component({
  selector: 'ngx-add-new-project',
  templateUrl: './add-new-project.component.html',
})
export class AddNewProjectComponent implements OnInit {
  orderOriginal = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
    return 0
  }
  objectKeys = Object.keys;
  min: Date;
  constructor(
    protected dateService: NbDateService<Date>,
    private dialogRef: MatDialogRef<AddNewProjectComponent>,
    private service:ProjectBateraService,
    public datepipe: DatePipe) { 
    this.min = this.dateService.addMonth(this.dateService.today(), 0);
  }

  newProjectForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
  });

  vesselData : any
  ngOnInit(): void {
    this.service.getShip()
    .subscribe(res => {
      this.vesselData = res
      this.vesselData = this.vesselData.data
      this.vesselData.forEach(ship => {
        this.newProjectMenu.Vessel.push(ship.nama_kapal) 
      });
    })
  }
  
  @ViewChild('inDockDate') inDockDate: ElementRef;
  @ViewChild('offHirePeriodDate') offHirePeriodDate: ElementRef;
  @ViewChild('repairPeriodDate') repairPeriodDate: ElementRef;

  public addProjectData = {
    "id_kapal" : "17",
    "tahun" : "2023",
    "nama_proyek" : "MT Salmon",
    "mata_uang" : "IDR",
    "off_hire_start" : "2022-08-13",
    "off_hire_end" : "2022-08-29",
    "off_hire_deviasi" : "3",
    "off_hire_rate_per_day" : "1500000",
    "off_hire_bunker_per_day" : "1250000",
    "repair_start" : "2022-08-15",
    "repair_end" : "2022-08-25",
    "repair_in_dock_start" : "2022-08-16",
    "repair_in_dock_end" : "2022-08-24",
    "repair_additional_day" : "0",

    "owner_supplies" : "5000000",
    "owner_services" : "6000000",
    "owner_class" : "1500000",
    "owner_other" : "0",
    "owner_cancel_job" : "0",
    "yard_cost" : "13000000",
    "yard_cancel_job" : "0"
  }

  addNewProject(data){
    let repairPeriode = this.repairPeriodDate.nativeElement.value.split("-")
    let startRepairPeriode = this.datepipe.transform(repairPeriode[0], 'yyyy-MM-dd');
    let endRepairPeriode = this.datepipe.transform(repairPeriode[1], 'yyyy-MM-dd');
    
    let offhirePeriod = this.offHirePeriodDate.nativeElement.value.split("-")
    let startOffhirePeriod = this.datepipe.transform(offhirePeriod[0], 'yyyy-MM-dd');
    let endOffhirePeriod = this.datepipe.transform(offhirePeriod[1], 'yyyy-MM-dd');

    let inDockPeriod = this.inDockDate.nativeElement.value.split("-")
    let startInDockPeriod = this.datepipe.transform(inDockPeriod[0], 'yyyy-MM-dd');
    let endInDockPeriod = this.datepipe.transform(inDockPeriod[1], 'yyyy-MM-dd');

    this.addProjectData.repair_start = startRepairPeriode
    this.addProjectData.repair_end = endRepairPeriode
    this.addProjectData.off_hire_start = startOffhirePeriod
    this.addProjectData.off_hire_end = endOffhirePeriod
    this.addProjectData.repair_in_dock_start = startInDockPeriod
    this.addProjectData.repair_in_dock_end = endInDockPeriod

    this.addProjectData.off_hire_deviasi = data.value.deviation
    this.addProjectData.repair_additional_day = data.value.additionalDay
    this.addProjectData.off_hire_rate_per_day = data.value.charterRate
    this.addProjectData.off_hire_bunker_per_day = data.value.bunker
    this.addProjectData.tahun = data.value.yearProject

    this.service.addDataProject(this.addProjectData)
    .subscribe(res => {
      console.log(res)
      // this.close()
    })

  }

  baseCurrency(e){
    this.addProjectData.mata_uang = this.newProjectMenu.BaseCurrency[e]
  }

  responsible(e){
    console.log(this.newProjectMenu.responsible[e])
  }

  vesselName(e){
    this.addProjectData.nama_proyek = this.vesselData[e].nama_kapal
    this.addProjectData.id_kapal = this.vesselData[e].id_kapal
  }

  newProjectMenu = {
    "Vessel": [],
    "Phase": ['Requisition','In Progress','Finish', 'Evaluation'],
    "BaseCurrency": ['IDR', 'EURO', 'US'],
    "responsible" : ['SM', 'MT', 'BP'],
  }

  close(){this.dialogRef.close();}



}
