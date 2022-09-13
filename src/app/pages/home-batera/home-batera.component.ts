import { Component, Input, OnInit } from '@angular/core';
import { HomeBateraService } from './home-batera.service';

interface Item {
  imageSrc: string;
  imageAlt: string;
}
@Component({
  selector: 'ngx-home-batera',
  templateUrl: './home-batera.component.html',
})
export class HomeBateraComponent implements OnInit{
  title = "image-gallery"
  data : any;

  constructor(
    private homeBateraService : HomeBateraService
  ){

  }
  ngOnInit(): void {
    this.getDataHome()
  }

  getDataHome(){
    this.homeBateraService.getDataHome().subscribe(res => {
      this.data = res
      console.log(res)
    }) 
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
        <img src="{{image.imageSrc}}" alt="{{image.imageAlt}}" class="h-100">
        <div class="card-body">
          <h6>{{image.shipName}}</h6>
        </div>
      </div>
    </nb-card>
  </nb-card-front>
  <nb-card-back>
    <nb-card size="small" class="bg-secondary">
      <nb-icon icon="chevron-right-outline" pack="eva" class="flip-icon" (click)="toggleView()"></nb-icon>
      <div class="p-5">
        <h6 style="color: rgb(0, 208, 208);">{{image.shipName}}</h6>
        <div class="back-card--desc mt-5">
          <h2>35%</h2>
          <span class="font-weight-bold">Status : </span>
          <span class="font-weight-bolder"> in-progress</span> <br>
          <span class="font-weight-bolder">{{image.shipName}}-dd-2022</span>
        </div>
      </div>
    </nb-card>      
  </nb-card-back>
</nb-flip-card>`
})

export class HomeCardComponent {
  flipped = false;
  @Input() image;
  constructor() { }
  ngOnInit(): void {
  }

  toggleView() {
    this.flipped = !this.flipped;
  }
}

