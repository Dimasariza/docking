import { Component, Input, OnInit } from '@angular/core';
import { NbIconLibraries, NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';



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
  selector: 'ngx-surat-teguran',
  templateUrl: './surat-teguran.component.html',
})
export class SuratTeguranComponent implements OnInit {

  evaIcons = [];
  constructor(
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>,
    iconsLibrary: NbIconLibraries,
    ) {
    this.evaIcons = Array.from(iconsLibrary.getPack('eva').icons.keys())
      .filter(icon => icon.indexOf('outline') === -1);
    iconsLibrary.registerFontPack('fa', { packClass: 'fa', iconClassPrefix: 'fa' });
    iconsLibrary.registerFontPack('far', { packClass: 'far', iconClassPrefix: 'fa' });
    iconsLibrary.registerFontPack('ion', { iconClassPrefix: 'ion' });
    this.dataSource = this.dataSourceBuilder.create(this.data);
  }
  
  customColumn = 'Title';
  defaultColumns = [ 'Date', 'Last Change' ];
  allColumns = [ this.customColumn, ...this.defaultColumns ];
  
  dataSource: NbTreeGridDataSource<FSEntry>;
  
  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;
  
  
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
      icon: 'file-text-outline',
      desc: 'Add Document'
    },
  ]

  ngOnInit(): void {
  }
}

