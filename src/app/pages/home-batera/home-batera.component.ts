import { Component, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EventEmitter } from 'stream';
import { AddShipComponent } from './add-ship/add-ship.component';
import { HomeService } from './home-batera.service';
import { UpdateShipComponent } from './update-ship/update-ship.component';

@Component({
  selector: 'ngx-home-batera',
  templateUrl: './home-batera.component.html',
})
export class HomeBateraComponent implements OnInit {
  public shipData: any;
  constructor(
    private homeservice:HomeService,
    public dialog : MatDialog
  ) {}
  
  ngOnInit() {
    this.homeservice.getPosts()
      .subscribe(response => {
        this.shipData = response;
        this.shipData = this.shipData.data
    });
  }

  openDialog(){
    const dialog = this.dialog.open(AddShipComponent ,{
      disableClose : true,
      autoFocus : true
    })

    dialog.componentInstance.onSuccess.asObservable().subscribe(()=> {
      this.ngOnInit()
    })
  }
}

