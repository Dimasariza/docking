import { Component, EventEmitter, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HomeBateraComponent } from '../home-batera.component';
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
    public dialog : MatDialog,
    private homeComponent : HomeBateraComponent
  ){}

  @Input() image
  @Input() imgIndex
  flipped = false;
  toggleView() {
    this.flipped = !this.flipped;
  }

  deleteShip(){
    let id_kapal = this.image.id_kapal
    this.homeservice.deleteShip(id_kapal).subscribe( ({status} : any) => {
      console.log(status)
    })

    this.homeComponent.ngOnInit()
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
