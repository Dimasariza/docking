import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddShipComponent } from './add-ship/add-ship.component';
import { HomeService } from './home-batera.service';

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
      .subscribe(({data} : any) => {
        this.shipData = data;
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

