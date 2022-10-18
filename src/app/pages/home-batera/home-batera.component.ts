import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ShipActionComponent } from './ship-action/ship-action.component';
import { HomeBateraService } from './home-batera.service';
import { environment } from "../../../environments/environment"
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-home-batera',
  templateUrl: './home-batera.component.html',
})
export class HomeBateraComponent implements OnInit, OnDestroy {
  constructor(
    private homeservice:HomeBateraService,
    private dialog : MatDialog,
  ){}
    
  onSuccess : EventEmitter<any> = new EventEmitter<any>()
  shipData: any;
  flipped : any = []
  subscription : Subscription

  toggleView(id) {
    this.flipped[id] = !this.flipped[id]
  }

  ngOnInit() {
    this.subscription = this.homeservice.getAllShip()
    .pipe(take(1))
    .subscribe(({data} : any) => {
      data.length? this.shipData = data.map(item => {
        this.flipped.push(false)
        return {
          apiUrl : environment.apiUrl,
          ...item
        }
      }) : null;
    });

    this.homeservice.getUserLogin()
    .pipe(take(1))
    .subscribe(({data} : any) => {}).unsubscribe();
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
    const dialog = this.dialog.open(DeleteDialogComponent ,{
      disableClose : true,
      autoFocus : true,
      data : {
        id : id,
        dial : "ship",
      }
    });

    dialog.componentInstance.onSuccess.asObservable().subscribe(()=> {
      this.ngOnInit()
    });
  };

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

}



