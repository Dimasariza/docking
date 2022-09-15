import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddShipComponent } from './add-ship/add-ship.component';
import { HomeService } from './home-batera.service';

export class ShipData{
  constructor(
    public shipImg,
    public shipName,
    public shipUrl
  ){  }
}

@Component({
  selector: 'ngx-home-batera',
  templateUrl: './home-batera.component.html',
})
export class HomeBateraComponent implements OnInit {
  data: any;

  shipModel = new ShipData('MT Toba', 'Kapal Toba', 'kapaltoba.com')

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
    this.dialog.open(AddShipComponent)
    console.log("open dialog")
  }

  title : string = "this is my title"
}

@Component({
  selector: 'ngx-home-card',
  template: `
  <nb-flip-card [showToggleButton]="false" [flipped]="flipped">
    <nb-card-front>
      <nb-card size="small">
        <nb-icon icon="chevron-right-outline" pack="eva" class="flip-icon" (click)="toggleView()"></nb-icon>
        <div class="card h-100">
          <img src="{{image.foto}}" alt="{{image.nama_kapal}}" class="h-100">
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

export class HomeCardComponent implements OnInit{
  flipped = false;
  @Input() image;

  constructor() { }
  ngOnInit(): void {
  }

  toggleView() {
    this.flipped = !this.flipped;
  }
}

