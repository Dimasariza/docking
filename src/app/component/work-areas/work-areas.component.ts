import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { CommonFunction } from '../common-function/common-function';

interface FSEntry{}
@Component({
  selector: 'ngx-work-areas',
  templateUrl: './work-areas.component.html',
})  
export class WorkAreasComponent implements OnInit {
  constructor(
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>,
    private commonFunction : CommonFunction
    ){ }

  ngOnInit(): void {
    this.allColumns = this.columnType.map(column => column.prop);
    if(!this.commonFunction.arrayNotEmpty(this.workAreaData)) this.workAreaData = [];
    this.workAreaData = this.defineRankColor(this.workAreaData)
    this.dataTable = this.commonFunction.populateData(this.workAreaData, this.extendTable);
    this.dataSource = this.dataSourceBuilder.create(this.dataTable);
  }

  defineRankColor(workArea) {
    return workArea.map(work => {
        if(work.items?.length) 
            work.items = this.defineRankColor(work.items);
        const rankColor = this.commonFunction.rankColor(work.rank);
        return {...work, rankColor};
    })
  }

  @Input() workAreaData : any;
  @Input() tableDetails : any;
  @Input() columnType : any;
  @Input() tableHead : any;
  @Output("sendToParent") sendToParent: EventEmitter<any> = new EventEmitter();
  
  allColumns : any [];
  dataTable : any;
  dataSource;
  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  public setWorkArea(workArea) {
    this.workAreaData = workArea;
    this.ngOnInit();
  }

  private extendTable = false;
  public extendOrReduce() {
    this.extendTable = !this.extendTable;
    this.ngOnInit();
  }

  handleClickButton(title, data = null) {
    if(title == 'Update All Progress') 
      data = {...data, ...this.progressForm}
    this.sendToParent.emit({title, data});
  }

  progressForm : any = {};
  formValue(title, value) {
    this.progressForm[title] = value;
  }

  updateSort(sortRequest: NbSortRequest): void {
    this.sortColumn = sortRequest.column;
    this.sortDirection = sortRequest.direction;
  }

  getSortDirection(column: string): NbSortDirection {
    if (this.sortColumn === column) 
      return this.sortDirection;
    return NbSortDirection.NONE;
  }

  getShowOn(index: number) {
    const minWithForMultipleColumns = 400;
    const nextColumnStep = 100;
    return minWithForMultipleColumns + (nextColumnStep * index);
  }
}
