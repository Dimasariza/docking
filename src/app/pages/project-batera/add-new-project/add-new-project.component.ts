import { KeyValue } from '@angular/common';
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
    private service:ProjectBateraService) { 
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
        this.newProjectMenu.Vessel.value.push(ship.nama_kapal) 
      });
    })
  }
  
  @ViewChild('inDockDate') inDockDate: ElementRef;
  @ViewChild('offHirePeriodDate') offHirePeriodDate: ElementRef;
  @ViewChild('repairPeriodDate') repairPeriodDate: ElementRef;

  addNewProject(data){
    console.log(data)
    console.log(this.inDockDate.nativeElement.value)
    console.log(this.offHirePeriodDate.nativeElement.value)
    console.log(this.repairPeriodDate.nativeElement.value)

    let repairPeriode = this.repairPeriodDate.nativeElement.value
    console.log(repairPeriode.split("-"))
  }

  baseCurrency(e){
    console.log(e)
  }

  responsible(e){
    console.log(e)
  }

  vesselName(e){
    console.log(this.vesselData[e].nama_kapal)
    console.log(this.vesselData[e].id_kapal)
  }

  newProjectMenu = {
    "Vessel": {
      value : [],
    },
    "Phase": {
      value: ['Requisition','In Progress','Finish', 'Evaluation'],
    },
    "BaseCurrency": {
      value : ['*IDR', 'EURO', 'US'],
    },
    "responsible" : {
      value : [ 'SM', 'MT', 'BP' ]
    },
    "Off Hire Period": {
      value: ['2 Medium', '1 Hard'],
    },
  }

  close(){this.dialogRef.close();}

  addProjectData = {
    "id_kapal" : '',
    "tahun" : "",
    "nama_proyek" : "",
    "mata_uang" : "",
    "off_hire_start" : "",
    "off_hire_end" : "",
    "off_hire_deviasi" : "",
    "off_hire_rate_per_day" : "",
    "off_hire_bunker_per_day" : "",
    "repair_start" : "",
    "repair_end" : "",
    "repair_in_dock_start" : "",
    "repair_in_dock_end" : "",
    "repair_additional_day" : "",
    "owner_supplies" : "",
    "owner_services" : "",
    "owner_class" : "",
    "owner_other" : "",
    "owner_cancel_job" : "",
    "yard_cost" : "",
    "yard_cancel_job" : ""
  }
}
