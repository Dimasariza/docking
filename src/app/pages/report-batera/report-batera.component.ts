import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { ProjectBateraService } from '../project-batera/project-batera.service';
import { ProjectStatusComponent } from './project-status/project-status.component';
import { ReportBateraService } from './report-batera.service';

@Component({
  selector: 'ngx-report-batera',
  templateUrl: './report-batera.component.html',
})
export class ReportBateraComponent implements OnInit, OnDestroy  {
  constructor(private reportBateraService : ReportBateraService,
              private dialog : MatDialog,
              private activatedRoute : ActivatedRoute,
              private projectService : ProjectBateraService
    ) {
  }

  projectData : any
  subProjectData : any
  subscription : Subscription[] = []
  
  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id')
    const _subs1 = this.reportBateraService.getWorkPerProject(id)
    .pipe(take(1))
    .subscribe(({data} : any) => {
      this.projectData = data
    })

    const _subs2 = this.projectService.getSubProjectData(id) 
    .pipe(take(1))
    .subscribe(({data} : any) => {
      this.subProjectData = data
      this.subProjectData['head'] = `${data.kapal.nama_kapal}-DD-${data.tahun}`
    })

    this.subscription.push(_subs1)
    this.subscription.push(_subs2)
  }

  projectStatusDial(){
    this.dialog.open(ProjectStatusComponent, {
      disableClose : true, 
      autoFocus:true, 
      data : this.projectData
    })
  }

  ngOnDestroy(): void {
    this.subscription.forEach((subs) => subs.unsubscribe())
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