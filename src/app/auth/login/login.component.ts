import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NbAuthService, NbLoginComponent,} from '@nebular/auth';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';

interface TreeNode<T> {
    data: T;
    children?: TreeNode<T>[];
    expanded?: boolean;
}

interface FSEntry {
    no: string;
    size: string;
    kind: string;
    items?: number;
}

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class NgxLoginComponent extends NbLoginComponent {
  customColumn = 'NOMOR';
  defaultColumns = [ 'NAMA DIKLAT', 'WAKTU PELAKSANAAN', 'TEMPAT PELAKSANAAN', 'AKSI' ];
  allColumns = [ this.customColumn, ...this.defaultColumns ];

  dataSource: NbTreeGridDataSource<FSEntry>;

  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  constructor(public dataSourceBuilder : NbTreeGridDataSourceBuilder<FSEntry>, public service: NbAuthService, public cd: ChangeDetectorRef, public router: Router) {
    super(service, {}, cd, router)
    this.dataSource = this.dataSourceBuilder.create(this.data)
  }

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
      data: { no: 'Projects', size: '1.8 MB', items: 5, kind: 'dir' },
      children: [
        { data: { no: 'project-1.doc', kind: 'doc', size: '240 KB' } },
        { data: { no: 'project-2.doc', kind: 'doc', size: '290 KB' } },
        { data: { no: 'project-3', kind: 'txt', size: '466 KB' } },
        { data: { no: 'project-4.docx', kind: 'docx', size: '900 KB' } },
      ],
    },
    {
      data: { no: 'Reports', kind: 'dir', size: '400 KB', items: 2 },
      children: [
        { data: { no: 'Report 1', kind: 'doc', size: '100 KB' } },
        { data: { no: 'Report 2', kind: 'doc', size: '300 KB' } },
      ],
    },
    {
      data: { no: 'Other', kind: 'dir', size: '109 MB', items: 2 },
      children: [
        { data: { no: 'backup.bkp', kind: 'bkp', size: '107 MB' } },
        { data: { no: 'secret-note.txt', kind: 'txt', size: '2 MB' } },
      ],
    },
  ];

  getShowOn(index: number) {
    const minWithForMultipleColumns = 400;
    const nextColumnStep = 100;
    return minWithForMultipleColumns + (nextColumnStep * index);
  }
}

@Component({
    selector: 'ngx-fs-icon',
    template: `
      <nb-tree-grid-row-toggle [expanded]="expanded" *ngIf="isDir(); else fileIcon">
      </nb-tree-grid-row-toggle>
      <ng-template #fileIcon>
        <nb-icon icon="file-text-outline"></nb-icon>
      </ng-template>
    `,
  })
  export class FsIconComponent {
    @Input() kind: string;
    @Input() expanded: boolean;
  
    isDir(): boolean {
      return this.kind === 'dir';
    }
  }