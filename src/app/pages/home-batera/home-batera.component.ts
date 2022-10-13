import { Component, EventEmitter, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ShipActionComponent } from './ship-action/ship-action.component';
import { HomeBateraService } from './home-batera.service';
import { environment } from "../../../environments/environment"
import { UpdateShipComponent } from './update-ship/update-ship.component';

@Component({
  selector: 'ngx-home-batera',
  templateUrl: './home-batera.component.html',
})
export class HomeBateraComponent implements OnInit {
  constructor(
    private homeservice:HomeBateraService,
    private dialog : MatDialog,
  ){}
    
  onSuccess : EventEmitter<any> = new EventEmitter<any>()
  public shipData: any;
  public flipped : boolean = false;
  toggleView() {
    this.flipped = !this.flipped;
  }
  
  ngOnInit() {
    this.homeservice.getAllShip()
    .subscribe(({data} : any) => {
      data.length? this.shipData = data.map(item => ({
        apiUrl : environment.apiUrl,
        ...item
      })) : null;
    });

    this.homeservice.getUserLogin()
    .subscribe(({data} : any) => {
    });
  }

  addShipDial(){
    const dialog = this.dialog.open(ShipActionComponent ,{
      disableClose : true,
      autoFocus : true,
      data : {
        dial : "Add"
      }
    });

    dialog.componentInstance.onSuccess.asObservable().subscribe(()=> {
      this.ngOnInit()
    });
  }

  updateShipDial(id){
    const dialog = this.dialog.open(ShipActionComponent ,{
      disableClose : true,
      autoFocus : true,
      data : {
        id : id,
        dial : "Update"
      }
    });

    dialog.componentInstance.onSuccess.asObservable().subscribe(()=> {
      this.ngOnInit()
    });
  };

  deleteShip(id){
    this.homeservice.deleteShip(id)
    .subscribe( ({status} : any) => {
      this.ngOnInit();
    });
  };

}



