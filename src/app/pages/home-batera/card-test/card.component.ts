import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'card-test',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardTestComponent implements OnInit {
  flipped = false;

  constructor() { }

  ngOnInit(): void {
  }
  
  toggleView() {
    this.flipped = !this.flipped;
  }

}
