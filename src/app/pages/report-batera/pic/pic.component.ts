import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbIconLibraries, NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { ReportBateraService } from '../report-batera.service';


interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}
interface FSEntry {
  Title: string;
  Date?: string;
  'Last Change'?: string;
  kind?: string;
}
@Component({
  selector: 'ngx-pic',
  templateUrl: './pic.component.html',
})
export class PicComponent implements OnInit{
  customColumn = 'Title';
  defaultColumns = [ 'Date', 'Last Change' ];
  allColumns = [ this.customColumn, ...this.defaultColumns ];
  
  dataSource: NbTreeGridDataSource<FSEntry>;z
  
  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;
  
  evaIcons = [];
  constructor(
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>,
    iconsLibrary: NbIconLibraries,
    private reportService : ReportBateraService,
    public activatedRoute : ActivatedRoute   ,
    ) {
    this.evaIcons = Array.from(iconsLibrary.getPack('eva').icons.keys())
      .filter(icon => icon.indexOf('outline') === -1);
    iconsLibrary.registerFontPack('fa', { packClass: 'fa', iconClassPrefix: 'fa' });
    iconsLibrary.registerFontPack('far', { packClass: 'far', iconClassPrefix: 'fa' });
    iconsLibrary.registerFontPack('ion', { iconClassPrefix: 'ion' });
    this.dataSource = this.dataSourceBuilder.create(this.data);
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
    
  updateSort(sortRequest: NbSortRequest): void {
    this.sortColumn = sortRequest.column;
    this.sortDirection = sortRequest.direction;
  }
  
  getSortDirection(column: string): NbSortDirection {
    if (this.sortColumn === column) {
      return this.sortDirection;
    }
    return NbSortDirection.NONE;
  }
  
  private data: TreeNode<FSEntry>[] = [
    {
      data: { Title: 'Plan Docking', Date: '10.10.2022', 'Last Change': '22-11-18 22:07 SS' , kind: 'dir' },
    },
    {
      data: { Title: 'Spesifications', Date: '10.10.2022', 'Last Change': '22-11-18 22:07 SS', kind: 'dir', },
      children: [
        { data: { Title: 'D-12 Registration dock jobs',  Date: '10.10.2022', 'Last Change': '22-11-18 22:07 SS',kind: 'doc'} },
        { data: { Title: 'D-10 1st inspection', Date: '10.10.2022', 'Last Change': '22-11-18 22:07 SS', kind: 'doc' } },
        { data: { Title: 'D-9 to D-6 Draft docking spec',  Date: '10.10.2022', 'Last Change': '22-11-18 22:07 SS' , kind: 'doc'} },
        { data: { Title: 'D-9 to D-6 Produce Spares stores and services',  Date: '10.10.2022', 'Last Change': '22-11-18 22:07 SS' , kind: 'doc'} },
        { data: { Title: 'D-5 Prepare docking spec',  Date: '10.10.2022', 'Last Change': '22-11-18 22:07 SS', kind: 'doc'} },
        { data: { Title: 'D-5 Spesification approved',  Date: '10.10.2022', 'Last Change': '22-11-18 22:07 SS', kind: 'doc'} },
      ],
    },
    {
    data: { Title: 'Quote', Date: '10.10.2022', 'Last Change': '22-11-18 22:07 SS', kind: 'dir'},
      children: [
        { data: { Title: 'D-12 Registration dock jobs', Date: '10.10.2022', 'Last Change': '22-11-18 22:07 SS',  kind: 'doc' } },
        { data: { Title: 'D-12 Registration dock jobs', Date: '10.10.2022', 'Last Change': '22-11-18 22:07 SS',  kind: 'doc' } },
      ],
    },
  ];
  
  getShowOn(index: number) {
    const minWithForMultipleColumns = 400;
    const nextColumnStep = 100;
    return minWithForMultipleColumns + (nextColumnStep * index);
  }

  useIcons = [
    {
    icon: 'refresh',
    desc: 'Refresh'
    },
    {
      icon: 'plus',
      desc: 'Add Phase'
    },
    {
      icon: 'list',
      desc: 'Add Activity'
    },
    {
      icon: 'flag-outline',
      desc: 'Add Milestone'
    },
    {
      icon: 'clock-outline',
      desc: 'Add Meeting'
    },
    {
      icon: 'checkmark-square',
      desc: 'Add Task'
    },
  ]
  
  message : string = "this is ship id"
  ngOnInit(): void {

    this.reportService.getDataReport()
    .subscribe(res => {
      console.log(res)
    })
    
    this.activatedRoute.params.subscribe(res => {
      // this.id_kapal = res.id
      // console.log(this.id_kapal)
    })
  }
}

