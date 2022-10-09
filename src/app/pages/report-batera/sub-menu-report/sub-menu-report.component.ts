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
  ngOnInit(): void {
    this.subMenuData = this.location.getState()
  }

  ngDestroy(){
    this.subMenuData
  }


}

