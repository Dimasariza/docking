import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { switchMap } from 'rxjs-compat/operator/switchMap';
import { AddShipComponent } from './add-ship/add-ship.component';
import { HomeBateraService } from './home-batera.service';

@Component({
  selector: 'ngx-home-batera',
  templateUrl: './home-batera.component.html',
})
export class HomeBateraComponent implements OnInit {
  public shipData: any;
  constructor(
    private homeservice:HomeBateraService,
    public dialog : MatDialog,
  ) {}
  
  ngOnInit() {
    this.homeservice.getAllShip()
    .subscribe(({data} : any) => {
      data.length? this.shipData = data : null
    }); 
  }

  openDialog(){
    const dialog = this.dialog.open(AddShipComponent ,{
      disableClose : true,
      autoFocus : true
    })

    dialog.componentInstance.onSuccess.asObservable().subscribe(()=> {
      this.ngOnInit()
    })
  }
}


@Component({
  selector: 'ngx-require',
  template : `
  <div>test</div>
  `
})
export class RequireComponent {
  @Input() name : string
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