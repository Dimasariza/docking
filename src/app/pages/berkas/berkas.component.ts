import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-berkas',
  template: `
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./berkas.component.scss']
})
export class BerkasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
