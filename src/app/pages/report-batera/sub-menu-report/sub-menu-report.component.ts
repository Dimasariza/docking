import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Route } from '@angular/router';

@Component({
  selector: 'ngx-sub-menu-report',
  templateUrl: './sub-menu-report.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SubMenuReportComponent implements OnInit  {
  constructor (
    public activatedRoute : ActivatedRoute,
    public location : Location,
    private dialogRef: MatDialogRef<SubMenuReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    ) {  }
  
  public subMenuData
  public work_area 
  ngOnInit(): void {
    console.log(this.data)
    this.subMenuData = this.location.getState()
    // this.work_area = this.subMenuData.work_area.work_area[this.subMenuData.data]
    // console.log(this.subMenuData)
  }

  logActivity : any = []


  ngDestroy(){
    this.subMenuData
  }

  submitSpesification(data){
    console.log(data)
  }

  close(){ this.dialogRef.close()}
}

