import { Component, Input, OnInit } from '@angular/core';

interface Item {
  imageSrc: string;
  imageAlt: string;
}
@Component({
  selector: 'ngx-home-batera',
  templateUrl: './home-batera.component.html',
})
export class HomeBateraComponent{
  title = "image-gallery"
  data = [
    {
      imageSrc : './assets/images/Ship/KM SALMON MUSTAFA.png',
      imageAlt : 'MT SALMON MUSTAFA SHIP',
      shipName : 'MT SALMON MUSTAFA'
    },
    {
      imageSrc : 'https://www.pupuk-indonesia.com/public/uploads/2020/11/IMG_20181117_202559_3241605578072_berita.jpg',
      imageAlt : 'MT SULTAN MAHMUD BADARUDDIN II SHIP',
      shipName : 'MT SULTAN MAHMUD BADARUDDIN II'
    },
    {
      imageSrc : './assets/images/Ship/KM PUSRI INDONESIA I.png',
      imageAlt : 'KM PUSRI INDONESIA I SHIP',
      shipName : 'KM PUSRI INDONESIA I'

    },
    {
      imageSrc : './assets/images/Ship/KM ABUSAMAH.png',
      imageAlt : 'KM ABUSAMAH SHIP',
      shipName : 'KM ABUSAMAH'
    },
    {
      
      imageSrc : './assets/images/Ship/KM IBRAHIM ZAHIER.png',
      imageAlt : 'KM IBRAHIM ZAHIER SHIP',
      shipName : 'KM IBRAHIM ZAHIER'
    },
    {
      imageSrc : './assets/images/Ship/KM JULIANTO.png',
      imageAlt : 'KM JULIANTO MOELIODIHARDJO SHIP',
      shipName : 'KM JULIANTO MOELIODIHARDJO'
    },
  ]
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
          <span>status :</span>
          <span> in-progress</span> <br>
          <span>{{image.shipName}}-dd-2022</span>
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

