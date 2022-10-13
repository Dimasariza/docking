import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ProjectBateraService } from '../project-batera/project-batera.service';
import { WorkAreaComponent } from '../project-batera/work-area/work-area.component';
import { ProjectStatusComponent } from './project-status/project-status.component';
import { ReportBateraService } from './report-batera.service';

const buttonKey = [
  { icon : "info-outline",
    menu : "Project Status"
  },
];

@Component({
  selector: 'ngx-report-batera',
  templateUrl: './report-batera.component.html',
})
export class ReportBateraComponent {
  constructor(
    private reportBateraService : ReportBateraService,
    private dialog : MatDialog,
    private activatedRoute : ActivatedRoute,
    ) {
  }

  buttonKey = buttonKey
  projectData : any
  
  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id')
    this.reportBateraService.getWorkPerProject(id)
    .subscribe(({data} : any) => {
      this.projectData = data
    })
  }

  projectStatusDial(){
    const dialogRef = this.dialog.open(ProjectStatusComponent, {
      // disableClose : true, 
      autoFocus:true, 
    })
  }

  buttonAct(desc){
    switch (desc){
      case "Project Status" :
        this.projectStatusDial()
        break; 
    }
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