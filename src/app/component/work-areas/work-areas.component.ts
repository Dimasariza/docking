import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { Subject } from 'rxjs';

interface FSEntry{}
@Component({
  selector: 'ngx-work-areas',
  templateUrl: './work-areas.component.html',
})  
export class WorkAreasComponent implements OnInit {
  constructor(
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>,
    ){
      this.dataSource = this.dataSourceBuilder.create(this.dataTable);
  }

  ngOnInit(): void {
    this.dataSource = this.dataSourceBuilder.create(this.dataTable);
    this.changing.subscribe(data => { 
      this.dataTable = data;
      this.dataSource = this.dataSourceBuilder.create(this.dataTable);
    });
  }

  @Input() tableDetails : any;
  @Input() tableHead : any;
  @Input() allColumns : any;
  @Input() columnType : any;
  @Input() dataTable : any = [];
  @Input() changing: Subject<boolean>;

  dataSource;
  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  handleClickOption(target, value, column = null) {
    if(target == 'sort') {
      this.sortProjectMenu.emit({column, value});
    }
  }

  @Output("sortTableByFilter") sortProjectMenu: EventEmitter<any> = new EventEmitter();
  
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

  getShowOn(index: number) {
    const minWithForMultipleColumns = 400;
    const nextColumnStep = 100;
    return minWithForMultipleColumns + (nextColumnStep * index);
  }
}
