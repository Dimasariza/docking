import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-home-batera',
  templateUrl: './home-batera.component.html',
  styleUrls: ['./home-batera.component.scss']
})

export class HomeBateraComponent implements OnInit {
  title = "image-gallery"

  data = [
    {
      imageSrc : '../../../assets/images/Ship/KM SALMON MUSTAFA.png',
      imageAlt : 'MT SALMON MUSTAFA SHIP',
      shipName : 'MT SALMON MUSTAFA'
    },
    {
      imageSrc : 'https://www.pupuk-indonesia.com/public/uploads/2020/11/IMG_20181117_202559_3241605578072_berita.jpg',
      imageAlt : 'MT SULTAN MAHMUD BADARUDDIN II SHIP',
      shipName : 'MT SULTAN MAHMUD BADARUDDIN II'
    },
    {
      imageSrc : '../../../assets/images/Ship/KM PUSRI INDONESIA I.png',
      imageAlt : 'KM PUSRI INDONESIA I SHIP',
      shipName : 'KM PUSRI INDONESIA I'

    },
    {
      imageSrc : '../../../assets/images/Ship/KM ABUSAMAH.png',
      imageAlt : 'KM ABUSAMAH SHIP',
      shipName : 'KM ABUSAMAH'
    },
    {
      
      imageSrc : '../../../assets/images/Ship/KM IBRAHIM ZAHIER.png',
      imageAlt : 'KM IBRAHIM ZAHIER SHIP',
      shipName : 'KM IBRAHIM ZAHIER'
    },
    {
      imageSrc : '../../../assets/images/Ship/KM JULIANTO.png',
      imageAlt : 'KM JULIANTO MOELIODIHARDJO SHIP',
      shipName : 'KM JULIANTO MOELIODIHARDJO'
    },
  ]

  constructor() { }

  ngOnInit(): void {
  }
}
