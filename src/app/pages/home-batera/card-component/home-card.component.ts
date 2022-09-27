import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HomeService } from '../home-batera.service';
import { UpdateShipComponent } from '../update-ship/update-ship.component';

@Component({
  selector: 'ngx-home-card',
  templateUrl: './home-card.component.html',
})
export class HomeCardComponent {
  onSuccess : EventEmitter<any> = new EventEmitter<any>()
  constructor(
    private homeservice: HomeService,
    public dialog : MatDialog
  ){}

  @Input() image
  @Input() imgIndex
  flipped = false;
  toggleView() {
    this.flipped = !this.flipped;
  }

  public deleteStatus : any
  @Output() removeShip = new EventEmitter<string>();
  deleteShip(){
    let id_kapal = this.image.id_kapal
    this.homeservice.deleteShip(id_kapal).subscribe(res => {
      console.log(res)
      this.deleteStatus = res
      this.deleteStatus = this.deleteStatus.status
      this.removeShip.emit(this.deleteStatus);
      // this.onSuccess.emit()
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
