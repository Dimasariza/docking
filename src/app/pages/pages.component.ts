import { Component, Injector, Input } from '@angular/core';

import { MENU_ITEMS } from './pages-menu';
import { PageBaseComponent } from '../@base/page-base.component';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent extends PageBaseComponent {
  menu = MENU_ITEMS;

  constructor(injector: Injector) {
    super(injector);    
  }

  ngOnInit() {
    const {role} = this.user
    this.menu = MENU_ITEMS.filter(m => m.data == undefined ? true : m.data.role.indexOf(role) > -1)
  }
}