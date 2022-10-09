import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';

@Component({
  selector: 'ngx-sub-menu-report',
  templateUrl: './sub-menu-report.component.html',
})

export class SubMenuReportComponent implements OnInit  {
  constructor (
    public activatedRoute : ActivatedRoute,
    public location : Location
    ) {  }
  
  public subMenuData
  public work_area 
  ngOnInit(): void {
    this.subMenuData = this.location.getState()
    this.work_area = this.subMenuData.work_area.work_area[this.subMenuData.data]
    console.log(this.subMenuData)
  }

  ngDestroy(){
    this.subMenuData
  }


}

