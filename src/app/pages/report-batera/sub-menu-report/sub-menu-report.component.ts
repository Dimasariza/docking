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
  public showActivity : boolean = false
  public expandText : string = 'Expand'
  logActivity : any = [1]

  ngOnInit(): void {
    this.subMenuData = this.location.getState()
  }

  extendPanel(){
    this.showActivity = !this.showActivity
    this.showActivity ? this.expandText = 'Hide' : this.expandText = 'Expand'
  }

  submitSpesification(data){
    console.log(data)
  }

  close(){ this.dialogRef.close()}
}

