import { Component, Input, OnInit } from '@angular/core';

interface Item {
  imageSrc: string;
  imageAlt: string;
}

@Component({
  selector: 'card-test',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})

export class CardTestComponent implements OnInit {
  flipped = false;
  @Input() image;
  constructor() { }
  ngOnInit(): void {
  }

  toggleView() {
    this.flipped = !this.flipped;
  }
}
