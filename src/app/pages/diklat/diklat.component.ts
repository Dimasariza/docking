import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-diklat',
  template: `
  <router-outlet></router-outlet>
  `,
  styleUrls: ['./diklat.component.scss']
})
export class DiklatComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
