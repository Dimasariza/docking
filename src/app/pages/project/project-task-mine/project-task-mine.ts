import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { CommonFunction, ReplaceData } from "../../../component/common-function/common-function";
import { WorkAreasComponent } from "../../../component/work-areas/work-areas.component";

@Component({
    selector: 'ngx-project-task-mine',
    templateUrl: './project-task-mine.html',
})
export class ProjectTaskMine implements OnInit {
  constructor(
    public commonFunction : CommonFunction,
    public replace : ReplaceData,
  ) { }

  ngOnInit(): void {
    this.projectData.map(data => {
      let { projectTitle , work_area = [] } = data;

      if(!this.projectTitle.includes(projectTitle)) 
        this.projectTitle.push(projectTitle); 

      if(this.commonFunction.arrayNotEmpty(work_area)) {
        work_area = this.commonFunction.refillWorkArea(work_area, {projectTitle})
        work_area.forEach(item => {
          const responsible = item.responsible;
          if(!this.responsible.includes(responsible) && responsible) 
            this.responsible.push(responsible); 
            this.workAreaData.push(item);
        })
      }
    })

    this.tableHead = this.replace.replace(this.tableHead, 'Project', this.projectTitle, 'option')
    this.tableHead = this.replace.replace(this.tableHead, 'Responsible', this.responsible, 'option')
  }

  @Input() projectData;
  @ViewChild(WorkAreasComponent) viewWorkArea : WorkAreasComponent;
  
  workAreaData = [];
  tableDetails : any = {style :{ width : '1900px', "max-height" : '300px' }, searchBar : true};
  columnType = [ 
    { type : 'numb', width : 100, prop : 'jobNumber' }, 
    { type : 'text', width : 150, prop : 'jobName' }, 
    { type : 'text', width : 250, prop : 'projectTitle' }, 
    { type : 'text', width : 150, prop : 'status' }, 
    { type : 'resp', width : 250, prop : 'responsible' }, 
    { type : 'date', width : 200, prop : 'end' }
  ]
  
  tableHead = [ 
    { type : 'text', placeholder : 'Job Number' },
    { type : 'text', placeholder : 'Tasks' },
    { type : 'drop-down', placeholder : 'Project', option : ['All'], title : 'Filter Table' , unsort : true},
    { type : 'drop-down', placeholder : 'Status', option : ['All', ...this.commonFunction.jobStatus], title : 'Filter Table', unsort : true },
    { type : 'drop-down', placeholder : 'Responsible', option : ['All'], title : 'Filter Table', unsort : true },
    { type : 'text', placeholder : 'Due' }
  ]

  responsible = ['All'];
  projectTitle = ['All'];
  filterTable : any = {
    projectTitle : 'All',
    responsible : 'All',
    status : 'All'
  };

  handleClickButton(title, data) {
    if(title == 'Filter Table') this.sortTableByFilter(data)
  }

  sortTableByFilter({column, value}) {
    this.filterTable[column] = value;
    let sortingData = this.workAreaData;
    const sortBy = Object.keys(this.filterTable).filter(sort => this.filterTable[sort] != 'All')
    for(let sort of sortBy) 
      sortingData = sortingData.filter(data => data[sort] == this.filterTable[sort])
    this.viewWorkArea.setWorkArea(sortingData);
  }
}