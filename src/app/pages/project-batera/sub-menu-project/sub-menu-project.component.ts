import { KeyValue } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { ProjectBateraService } from '../project-batera.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { WorkAreaComponent } from '../work-area/work-area.component';
import { SubJobWorkareaComponent } from '../work-area/sub-job-workarea.component';

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface FSEntry {
  "Job No": string;
  Job? : string;
  Dept?: string;
  Resp? : string;
  Start? : string;
  Stop? : string;
  "Unit Price Budget"?: string;
  "Total Price Budget"? : string;
  "Category"?: string;
  Remarks?: string;
  Edit?: boolean
  kind: string;
}

@Component({
  selector: 'ngx-sub-menu-project',
  templateUrl: './sub-menu-project.component.html',
})

export class SubMenuProjectComponent implements OnInit {
  constructor(
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>,
    private route: ActivatedRoute,
    public dialog : MatDialog,
    private service : ProjectBateraService){
  }

  @Input() shipName 
  public id_proyek : any
  work_area: any

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')
    this.id_proyek = id
    this.service.getSubProjectData(id)
    .subscribe(({data} : any) => {
      const {work_area, kapal} = data
      this.work_area = work_area
      this.shipName = kapal.nama_kapal
      
      this.dataSource = this.dataSourceBuilder.create(work_area.map(work => this.populateData(work, 'dir')) as TreeNode<FSEntry>[])
    })
  }

  defaultColumns = ['Job', 'Dept', 'Resp', 'Start', 'Stop', 'Vol', 'Unit', 'Unit Price','Total Price Budget', 'Category', 'Remarks'];
  allColumns = ['Job No', ...this.defaultColumns, 'add job', 'action']

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

  getShowOn(index: number) {
    const minWithForMultipleColumns = 400;
    const nextColumnStep = 100;
    return minWithForMultipleColumns + (nextColumnStep * index);
  }

  populateData = (work, kind) => {          
    const {items, sfi, pekerjaan, start, end, departemen, volume, harga_satuan, kontrak , type, remarks, updated_at, id } = work           
    return {
      data: {
        "Job No": sfi,
        "Job": pekerjaan,
        "Dept": departemen,
        "Start": start,
        "Stop": end,
        "Vol" : volume,
        "Unit" : '',
        "Unit Price": harga_satuan,
        "Total Price Budget" : kontrak,
        "Category" : type,
        "Remarks" : updated_at,
        "index" : id,
        // ...work,
        kind: items?.length ? 'dir' : 'doc'
      },
      children: items?.length ? items.map(child => this.populateData(child, 'doc')) : []
    }
  }
  
  menuButton = [
    {
      position: 'top',
      icon: 'list-outline',
      text : 'List'
    },
        {
      position: 'top',
      icon: 'list-outline',
      text : 'List'
    },
    {
      position: 'top',
      icon: 'calendar-outline',
      text: 'Schedule'
    },
    {
      position: 'top',
      icon: 'file-add-outline',
      text: 'Extract Data File'
    },
    {
      position: 'top',
      icon: 'clipboard-outline',
      text: 'Gant'
    },
    {
      position: 'bottom',
      text : 'Add Job',
    },
    {
      position: 'bottom',
      text : 'Remarks'
    },
    {
      position: 'bottom',
      text : 'Export To PDF'
    },
    {
      position: 'bottom',
      text : 'Expand All'
    },
    {
      position: 'bottom',
      text : 'Refresh'
    },
    {
      position: 'bottom',
      text : 'Show Budget'
    },
    {
      position: 'bottom',
      text: 'Show Contract'
    }
  ]

  btnAct(e){
    switch(e) {
      case 'Add Job':
        this.addWorkAreaDial()
        break;
    }
  }

  addWorkAreaDial(){
    const dialog = this.dialog.open(WorkAreaComponent, {
      disableClose : true,
      autoFocus:true, 
      data : this.id_proyek
    })    
    
    dialog.componentInstance.onSuccess.asObservable().subscribe(() => {
      this.ngOnInit()
    })
  }

  subJobDial(row){    
    console.log(row);
    
    const dialog = this.dialog.open(SubJobWorkareaComponent, {
      disableClose : true,
      autoFocus: true,
      data: {row, project_id : this.id_proyek}
    })

    dialog.componentInstance.onSuccess.asObservable().subscribe(() => {
      this.ngOnInit()
    })
  }

  delete(id: string) {
    console.log(id);
    
    let parentIndex = id.toString().split('')

    const reconstructData = (data) => {
      return data.map((w, i) => {
        if (parentIndex.length > 1 && i == parentIndex[0]) {
          parentIndex = parentIndex.slice(1)
          return {...w, items: reconstructData(w.items)}
        } else if(i == parentIndex[0]) {
          return null
        }
        return w
      }).filter(f => f != null)
    }

    const work_area = reconstructData(this.work_area)
    this.service.addProjectJob({work_area}, this.id_proyek)
    .subscribe(res => {
      this.dataSource = this.dataSourceBuilder.create(work_area.map(work => this.populateData(work, 'dir')) as TreeNode<FSEntry>[])
    })
  }
}








@Component ({
  selector: 'ngx-sub-project-data',
  templateUrl: './sub-project-data.component.html',
})
export class SubProjectDataComponent implements OnInit{
  @Input() dataProyek : any
  constructor(private route: ActivatedRoute, private service : ProjectBateraService ) {}
  ngOnInit(): void {
      const id = this.route.snapshot.paramMap.get('id')
      this.service.getSubProjectData(id )
      .subscribe((res) => {
        this.dataProyek = res
        this.reportData.Vessel.value = this.dataProyek.data.kapal.nama_kapal
        this.reportData["Base Currency"].value = this.dataProyek.data.mata_uang
        this.reportData["- Bunker"].value = this.dataProyek.data.off_hire_bunker_per_day
        this.reportData["- Rate"].value = this.dataProyek.data.off_hire_rate_per_day
        this.reportData["- Deviation"].value = this.dataProyek.data.off_hire_deviasi
        this.reportData["Off Hire Period"].value = this.dataProyek.data.off_hire_period + ' days'
        this.reportData["Repair Period"].value = this.dataProyek.data.repair_period + ' days'
        this.reportData["- In Dock"].value = this.dataProyek.data.repair_in_dock_period + ' days'
        this.reportData["- Additional Days"].value = this.dataProyek.data.repair_additional_day + ' days'
      })
  }
  orderOriginal = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
    return 0
  }
  objectKeys = Object.keys;

  reportData = {
    "Vessel": {
      type : 'text',
      value : ''
    },
    "Phase": {
      type : 'drop-down',
      value: ['Requisition','In Progress', 'Evaluation', 'Finish']
    },
    "Selected Yard": {
      type : 'text',
      value : 'Batera Yard 01'
    },
    "Base Currency": {
      type : 'text',
      value : '*IDR'
    },
    "Off Hire Period": {
      type : 'text',
      value: ''
    },
    "- Deviation": {
      type : 'date',
      value: '4'
    },
    "- Rate": {
      type : 'price',
      value: '71050000', 
      subvalue : '1.421.000.000'
    } ,
    "- Bunker": {
      type : 'price',
      value : '',
      subvalue : '1.128.000.000'
    }, 
    "Repair Period": {
      type: 'text',
      value : '', 
    },
    "- In Dock": {
      type : 'text',
      value : '' 
    },
    "- Additional Days": {
      type : 'text',
      value : '',
    } 
  }
}




@Component({
  selector: 'ngx-sub-price-data',
  templateUrl: './sub-price-data.component.html'
})
export class SubPriceDataComponent implements OnInit {
  constructor(private route: ActivatedRoute, private service : ProjectBateraService ) {}

  private dataPrice : any
  ngOnInit() : void {
    const id = this.route.snapshot.paramMap.get('id')
      this.service.getSubProjectData(id)
      .subscribe((res) => {
        this.dataPrice = res
        this.dataPrice = this.dataPrice.data
        this.priceData['Owner Canceled Jobs'].Budget = this.dataPrice.owner_cancel_job
      })

  }

  orderOriginal = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
    return 0
  }
  objectKeys = Object.keys;
  priceHeadData = [
    'Totals', 'Budget', 'Contract', 'Actual'
  ]
  priceData = {
    'Offhire Days' : {
      type : 'title',
      Budget: 20,
      Contract: '_',
      Actual: 0,
    },
    'Owner Exp': {
      type : 'title',
      Budget: '1.412.000.000',
      Contract: '1.412.000.000',
      Actual: 0,
    },
    Supplies: {
      type : 'subTitle',
      Budget: '877.000.000',
      Contract: '877.000.000',
      Actual: 0,
    },
    Services: {
      type : 'subTitle',
      Budget: '350.000.000',
      Contract: '350.000.000',
      Actual: 0,
    },
    Class: {
      type : 'subTitle',
      Budget: 0,
      Contract: 0,
      Actual: 0,
    },
    Other: {
      type : 'subTitle',
      Budget: '185.000.000',
      Contract: '185.000.000',
      Actual: 0,
    },
    'Owner Canceled Jobs': {
      type : 'highlight',
      Budget: '_',
      Contract: 0,
      Actual: '_',
    },
    'Yard Cost': {
      type : 'title',
      Budget: '5.056.566.061',
      Contract: '4.541.787.983',
      Actual: 0,
    },
    'Yard Canceled Jobs' : {
      type : 'highlight',
      Budget: '_',
      Contract: 0,
      Actual: '_',
    },
    'Total Cost' : {
      type : 'title',
      Budget: '6.468.566.061',
      Contract: '5.953.787.983',
      Actual: 0,
    }
  } 
}
