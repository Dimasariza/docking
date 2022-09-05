import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NbIconLibraries } from '@nebular/theme';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';


interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface FSEntry {
  Title: string;
  Type?: string;
  Status?:string;
  "%"?:string;
  Start: string;
  Stop?: string;
  Responsible?: string;
  'Last Change'?: string;
  Approval?: boolean
  kind: string;
}

@Component({
  selector: 'ngx-work-progress',
  templateUrl: './work-progress.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class WorkProgressComponent {
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
  defaultColumns = [ 'Type', 'Status', '%', 'Start', 'Stop', 'Responsible', 'Last Change' ];
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
      data: { Title: 'Plan Docking', Type: 'Phase', Status: '', '%':'', Start: '15-09-2018', Stop:'15-12-2018' , Responsible:'', 'Last Change': '22-11-18 22:07 SS' , kind: 'dir' },
    },
    {
      data: { Title: 'Spesifications', Type: 'Phase', Status: '', '%':'', Start: '15-09-2018', Stop:"15-12-2018" , Responsible:'', 'Last Change': '22-11-18 22:07 SS', kind: 'dir', },
      children: [
        { data: { Title: 'D-12 Registration dock jobs', Type: 'Activity', Status: '', Start: '15-09-2018', Stop:"15-12-2018", Responsible:'', 'Last Change': '22-11-18 22:07 SS',kind: 'doc'} },
        { data: { Title: 'D-10 1st inspection', Type: 'Activity', Status: '',  Start: '15-09-2018', Stop:"15-12-2018", Responsible:'', 'Last Change': '22-11-18 22:07 SS', kind: 'doc' } },
        { data: { Title: 'D-9 to D-6 Draft docking spec', Type: 'Activity', Status: '', Start: '15-09-2018', Stop:"15-12-2018", Responsible:'', 'Last Change': '22-11-18 22:07 SS' , kind: 'doc'} },
        { data: { Title: 'D-9 to D-6 Produce Spares stores and services', Type: 'Activity', Status: '', Start: '15-09-2018', Stop:"15-12-2018", Responsible:'', 'Last Change': '22-11-18 22:07 SS' , kind: 'doc'} },
        { data: { Title: 'D-5 Prepare docking spec', Type: 'Activity', Status: '', Start: '15-09-2018', Stop:"15-12-2018", Responsible:'', 'Last Change': '22-11-18 22:07 SS', kind: 'doc'} },
        { data: { Title: 'D-5 Spesification approved', Type: 'Milestone', Status: '', Start: '15-09-2018', Stop:"15-12-2018", Responsible:'', 'Last Change': '22-11-18 22:07 SS', kind: 'doc'} },
      ],
    },
    {
    data: { Title: 'Quote', Type: 'Phase', Status: '', Start: '15-09-2018',  Stop:"15-12-2018", Responsible:'', 'Last Change': '22-11-18 22:07 SS', kind: 'dir'},
      children: [
        { data: { Title: 'D-12 Registration dock jobs', Type: 'Active', Status: '', Start: '15-09-2018', Stop:"15-12-2018", Responsible:'', 'Last Change': '22-11-18 22:07 SS',  kind: 'doc' } },
        { data: { Title: 'D-12 Registration dock jobs', Type: 'Active', Status: '', Start: '15-09-2018', Stop:"15-12-2018", Responsible:'', 'Last Change': '22-11-18 22:07 SS',  kind: 'doc' } },
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
    {
      icon: 'arrow-right-outline',
      desc: 'Add Microflow'
    },
    {
      icon: 'external-link',
      desc: 'Export to Excel'
    },
    {
      icon: 'plus-square-outline',
      desc: 'Expand'
    },
    {
      icon: 'minus',
      desc: 'Collapse'
    }
  ]
}
