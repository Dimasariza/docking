import { Component, Inject } from '@angular/core';  
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectBateraService } from '../project-batera.service';

@Component({
  selector: 'ngx-work-area',
  templateUrl: './work-area.component.html',
})
export class WorkAreaComponent {
  constructor(
    private service:ProjectBateraService,
    public dialog : MatDialog,
    private dialogRef: MatDialogRef<WorkAreaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  
  workAreaData : any
  numberOfPage = 1
  subJob : boolean = false
  
  "work_area" = {
    sfi : "1",
    pekerjaan : "Pemindahan Kapal",
    type : "pekerjaan",
    start : "2022-09-15",
    end : "2022-09-20",
    departemen : "CM",
    responsible : "shipyard",
    volume : 2,
    harga_satuan : 400000,
    kontrak : 0,
    additional : 0,
    satuan : '',
    kategori : '',
    catatan : ''
  }
  

  onSubmit(data){
    if (this.numberOfPage !== 1){
      this.service.addProjectJob(this.workAreaData, this.data)
      .subscribe(res => console.log(res))
    }
    if (this.numberOfPage === 1){
      this.service.addProjectJob(data, this.data)
      .subscribe(res => console.log(res))
    }
    console.log(data)
  }
  
  close(){ this.dialogRef.close();}
  public category = ["Owner Exp- Supplies", "Services", "Class", "Others" ,"Yard cost", "Yard cancelled jobs"]
  public rank = ["Critical", "High", "Medium", "Low"]
  public unitType = [ ["Lumpsum"], ["Ls", "m2", "m3", "kg", "pcs", "Mtr (meter length)", "Hours", "times", "unit", "unit.Hours", "shift", "Days", "kWh.Days", "Lines.Days", "Person.Days"]]
  public useUnit

  ngOnInit(){
    this.useUnit = this.unitType[0]
  }

  // addSubJob(data : NgForm){
  //   this.numberOfPage === 4 ? this.numberOfPage = this.numberOfPage : this.numberOfPage++
  //   this.numberOfPage === 1 ? this.useUnit = this.unitType[0] : this.useUnit = this.unitType[1]
  //   if ( this.numberOfPage === 2 ) {
  //     Object.assign(
  //       this.work_area, {items : [data.value]
  //     })
  //   } else if ( this.numberOfPage === 3 ) {
  //     Object.assign(
  //       this.work_area[0]['items'], {items : [data.value]
  //     })
  //   } else if ( this.numberOfPage === 4 ) {
  //     Object.assign(
  //       this.work_area[0]['items'][0]['items'], {items : [data.value]
  //     })
  //   }

  //   console.log(data.value)
  //   console.log(this.work_area)
  //   console.log(this.numberOfPage)
  //   data.reset()
  // }
}
