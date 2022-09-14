import { Component, Input, OnInit } from '@angular/core';
import { NbIconLibraries, NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';

@Component({
  selector: 'ngx-close-out',
  templateUrl: './close-out.component.html',
})
export class CloseOutComponent implements OnInit {


  ngOnInit(): void {
  }
  
  evaIcons = [];
  constructor(
    iconsLibrary: NbIconLibraries,
    ) {
    this.evaIcons = Array.from(iconsLibrary.getPack('eva').icons.keys())
      .filter(icon => icon.indexOf('outline') === -1);
    iconsLibrary.registerFontPack('fa', { packClass: 'fa', iconClassPrefix: 'fa' });
    iconsLibrary.registerFontPack('far', { packClass: 'far', iconClassPrefix: 'fa' });
    iconsLibrary.registerFontPack('ion', { iconClassPrefix: 'ion' });
  }
  
  shipData = [
    {
      "vessel": "Batera Batam-DD-2019",
      "shortcuts": ['plus-square-outline', 'trash-2-outline', 'book-outline', 'checkmark-square', 'archive-outline'],
      "customer": "Batera Line",
      "start": "15:09:19",
      "R": true,
      "P": true,
      "E": true
    },
    {
      "vessel": "Batera Project3-DD-2019",
      "shortcuts": ['plus-square-outline', 'trash-2-outline', 'book-outline', 'checkmark-square', 'archive-outline'],
      "customer": "Batera Line",
      "start": "15:08:19",
      "R": true,
      "P": true,
      "E": true
    },
    {
      "vessel": "Batera Kapuas-DD-2019",
      "shortcuts": ['plus-square-outline', 'trash-2-outline', 'book-outline', 'checkmark-square', 'archive-outline'],
      "customer": "Batera Line",
      "start": "15:07:19",
      "R": true,
      "P": true,
      "E": true
    },
    {
      "vessel": "Batera Medan-1-DD-2019",
      "shortcuts": ['plus-square-outline', 'trash-2-outline', 'book-outline', 'checkmark-square', 'archive-outline'],
      "customer": "Batera Line",
      "start": "15:06:19",
      "R": true,
      "P": true,
      "E": true
    },
    {
      "vessel": "Batera Express-DD-2019",
      "shortcuts": ['plus-square-outline', 'trash-2-outline', 'book-outline', 'checkmark-square', 'archive-outline'],
      "customer": "Batera Line",
      "start": "15:05:19",
      "R": true,
      "P": true,
      "E": true
    },
    {
      "vessel": "Relance-DD-2019",
      "shortcuts": ['plus-square-outline', 'trash-2-outline', 'book-outline', 'checkmark-square', 'archive-outline'],
      "customer": "Batera Line",
      "start": "15:04:19",
      "R": true,
      "P": true,
      "E": true
    },
    {
      "vessel": "Batera Gorontalo-DD-2019",
      "shortcuts": ['plus-square-outline', 'trash-2-outline', 'book-outline', 'checkmark-square', 'archive-outline'],
      "customer": "Batera Line",
      "start": "15:03:19",
      "R": true,
      "P": true,
      "E": true,
    }
  ]

  
  useIcons = [
    {
      icon: 'refresh',
      desc: 'Refresh'
    },
    {
      icon: 'file-text-outline',
      desc: 'Add Document'
    },
  ]
}

