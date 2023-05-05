import { Component, Input } from "@angular/core";
import { CommonFunction } from "../../../component/common-function/common-function";
import { Subject } from "rxjs";

@Component({
    selector: 'ngx-project-task-mine',
    templateUrl: './project-task-mine.html',
})
export class ProjectTaskMine{
  constructor(
    public commonFunction : CommonFunction
  ) { }

  workAreaData = [];
  @Input() projectData;

  ngOnInit(): void {
    this.generateTableDatas(this.projectData)
  }

  changingValue: Subject<boolean> = new Subject();

  dataTable : any;  
  tableDetails = {style :{ width : '1800px', "max-height" : '300px' }, searchBar : true};
  allColumns = [ 'jobNumber', 'jobName', 'projectTitle', 'status', 'responsible', 'end' ]; 
  columnType = [ 
    { type : 'number', width : 100 }, 
    { type : 'text', width : 150 }, 
    { type : 'text', width : 250 }, 
    { type : 'text', width : 150 }, 
    { type : 'text', width : 200 }, 
    { type : 'date', width : 200 }
  ]
  
  tableHead = [ 
    { type : 'text', placeholder : 'Job Number' },
    { type : 'text', placeholder : 'Tasks' },
    { type : 'drop-down', placeholder : 'Project', option : ['All'], target : 'sort' },
    { type : 'drop-down', placeholder : 'Status', option : ['All', ...this.commonFunction.jobStatus], target : 'sort' },
    { type : 'drop-down', placeholder : 'Responsible', option : ['All'], target : 'sort' },
    { type : 'text', placeholder : 'Due' }
  ]

  responsible = ['All'];
  projectTitle = ['All'];
  filterTable : any = {
    projectTitle : 'All',
    responsible : 'All',
    status : 'All'
  };

  sortTableByFilter({column, value} : any) {
    this.filterTable[column] = value;
    let sortingData = this.workAreaData;
    const sortBy = Object.keys(this.filterTable).filter(sort => this.filterTable[sort] != 'All')
    for(let sort of sortBy) 
      sortingData = sortingData.filter(data => data[sort] == this.filterTable[sort])

    this.dataTable = this.commonFunction.populateData(sortingData, false) 
    this.changingValue.next(this.dataTable);
  }

  generateTableDatas(data) {
    data.map(data => {
      const { projectTitle , work_area} = data;
      if(!this.projectTitle.includes(projectTitle)) 
        this.projectTitle.push(projectTitle); 
      if(this.commonFunction.arrayNotEmpty(work_area))
        work_area.forEach(item => {
          this.allColumns.forEach(column => item?.[column] ? null : item[column] = "");
          const responsible = item.responsible;
          if(!this.responsible.includes(responsible) && responsible) 
            this.responsible.push(responsible); 
            this.workAreaData.push({...item, projectTitle});
        })
    })

    this.tableHead[2].option = this.projectTitle;
    this.tableHead[4].option = this.responsible;
    this.dataTable = this.commonFunction.populateData(this.workAreaData, false)
  }
}