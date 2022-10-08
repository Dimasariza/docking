import { Component, EventEmitter, Injectable, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HomeBateraComponent } from '../home-batera.component';
import { HomeBateraService } from '../home-batera.service';
import { UpdateShipComponent } from '../update-ship/update-ship.component';
import { environment } from "../../../../environments/environment"

@Component({
  selector: 'ngx-home-card',
  templateUrl: './home-card.component.html',
})
export class HomeCardComponent {
  onSuccess : EventEmitter<any> = new EventEmitter<any>()
  constructor(
    private homeservice: HomeBateraService,
    public dialog : MatDialog,
  ){}
  @Input() apiUrl = environment.apiUrl
  @Input() image
  @Input() imgIndex
  flipped = false;
  toggleView() {
    this.flipped = !this.flipped;
  }

  deleteShip(){
    let id_kapal = this.image.id_kapal
    this.homeservice.deleteShip(id_kapal)
    .subscribe( ({status} : any) => {
      this.onSuccess.emit(null)
    })
  }

  updateShip(){
    let id_kapal = this.image.id_kapal
    console.log(id_kapal)
    const dialogRef = this.dialog.open(UpdateShipComponent ,{
      disableClose : true,
      autoFocus : true
    })
  }
}
