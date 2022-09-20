import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddShipComponent } from './add-ship/add-ship.component';
import { HomeService } from './home-batera.service';



@Component({
  selector: 'ngx-home-batera',
  templateUrl: './home-batera.component.html',
})
export class HomeBateraComponent implements OnInit {
  data: any;

  constructor(
    private homeservice:HomeService,
    public dialog : MatDialog
    ) {}
  
  ngOnInit() {
    this.homeservice.getPosts()
      .subscribe(response => {
        this.data = response;
        this.data = this.data.data
        console.log(this.data)
    });
  }

  openDialog(){
    const dialogConfig = new MatDialogConfig();
    const dialogRef = this.dialog.open(AddShipComponent ,{disableClose : true})
    console.log("open dialog")

    dialogConfig.autoFocus = true;

    dialogRef.afterClosed().subscribe(res=>{
        console.log(res);
      }
    );
  }
}












@Component({
  selector: 'ngx-home-card',
  template: `
  <nb-flip-card [showToggleButton]="false" [flipped]="flipped">
    <nb-card-front>
      <nb-card size="small">
        <nb-icon icon="chevron-right-outline" pack="eva" class="flip-icon" (click)="toggleView()"></nb-icon>
        <div class="card h-100">
          <img src="http://env-6573880.jh-beon.cloud/uploads/{{image.foto}}" crossorigin="anonymous" alt="{{image.nama_kapal}}" class="h-100">
          <div class="card-body">
            <h6>{{image.nama_kapal}}</h6>
          </div>
        </div>
      </nb-card>
    </nb-card-front>
    <nb-card-back>
      <nb-card size="small" class="bg-secondary">
        <nb-icon icon="chevron-right-outline" pack="eva" class="flip-icon" (click)="toggleView()"></nb-icon>
        <div class="p-5">
          <h6 style="color: rgb(0, 208, 208);">{{image.nama_kapal}}</h6>
          <div class="back-card--desc mt-5">
            <h2>35%</h2>
            <span class="font-weight-bold">Status : </span>
            <span class="font-weight-bolder"> in-progress</span> <br>
            <span class="font-weight-bolder">{{image.nama_kapal}}-dd-2022</span>
          </div>
        </div>
      </nb-card>      
    </nb-card-back>
  </nb-flip-card>
  `
})
export class HomeCardComponent{
  flipped = false;
  @Input() image;

  toggleView() {
    this.flipped = !this.flipped;
  }
}
