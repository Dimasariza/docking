import { Component, OnDestroy, OnInit } from '@angular/core';
import { HomeService } from './home.service';
import { environment } from "../../../environments/environment"
import { map, takeUntil } from 'rxjs/operators';
import { Observable, Subject, forkJoin} from 'rxjs';
import { CommonFunction } from '../../component/common-function/common-function';
import { ReportService } from '../report/report.service';
import { ShipDialogComponent } from './ship-dialog/ship-dialog.component';
import { DeleteDialogComponent } from '../../component/delete-dialog/delete-dialog.component';
import { ToastrComponent } from '../../component/toastr-component/toastr.component';

@Component({
  selector: 'ngx-home-component',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy{
  constructor(
    private homeService : HomeService,
    private commonFunction : CommonFunction,
    private reportService : ReportService,
    private toastr : ToastrComponent,
  ){}
    
  destroy$: Subject<void> = new Subject<void>();
  result$: Observable<any>

  ngOnInit() {
    const shipdata$ = this.homeService.getAllShips({}).pipe(
      map((result: any) =>  result.data.map(item => ({  
          ...item,
          imageURL : `${environment.apiUrl}/file/show/${item.foto}`,
          flipped : false,
      })))
    )

    const progressData$ = this.reportService.getProjectSummary({})
    .pipe(
      map(({data}: any) => data.map(summary => {
        const {proyek : { id_kapal, tahun, phase, kapal : { nama_kapal } }, 
        work_area, variant_work, id_proyek} = summary;
        const workProgress = [...work_area.filter(w => w =! null) ?? [], ...variant_work.filter(w => w =! null) ?? []];
        let progress : any = 0;
        for(let job of workProgress) progress += job.progress.at(-1).progress;
        if(progress != 0) progress = progress / workProgress?.length;
        return {
          id_kapal, 
          id_proyek,
          projectTitle : `${nama_kapal} - DD - ${tahun}`, 
          phase : phase.split('_').join(" "), 
          progress : parseFloat(progress).toFixed(2), 
        };
      }))
    )
    
    this.result$ = forkJoin([shipdata$, progressData$])
      .pipe(
        map(([shipData, progressData]) => shipData.map(ship => { 
            const summary = progressData.find(({id_kapal}) => id_kapal === ship.id_kapal)
            if(summary) return {...ship, ...summary}
            return {...ship};
          })
        )
      )
  }

  addShipDialog() {
    const title = 'Add Ship'
    this.commonFunction.openDialog({
      dialogData : { title },
      component : ShipDialogComponent 
    })
    .onClose
    .pipe(takeUntil(this.destroy$))
    .subscribe(newData => newData
      ? this.onUploadData(title, newData)
      : null);
  }

  updateShipDialog(ship) {
    const title = 'Update Ship'
    this.commonFunction.openDialog({
      dialogData : {
        title,
        data : ship
      },
      component : ShipDialogComponent 
    })
    .onClose
    .pipe(takeUntil(this.destroy$))
    .subscribe(newData => newData
      ? this.onUploadData(title, newData)
      : null);
  }

  deleteShipDialog(ship) {
    const title = 'Delete Ship'
    this.commonFunction.openDialog({
      dialogData : {
        title,
        name : ship.nama_kapal,
        id : ship.id_kapal
      },
      component : DeleteDialogComponent 
    })
    .onClose
    .pipe(takeUntil(this.destroy$))
    .subscribe(newData => newData
      ? this.onUploadData(title, newData)
      : null);
  }

  onUploadData(title, data) {
    let subscribe;
    let successMsg;
    if(title == 'Add Ship') {
      subscribe = this.homeService.addShip(data);
      successMsg = 'Your Ship has been added.'
    }

    if(title == 'Update Ship') {
      subscribe = this.homeService.updateShip(data);
      successMsg = 'Your Ship has been updated.'
    }

    if(title == 'Delete Ship') {
      subscribe = this.homeService.deleteShip(data);
      successMsg = 'Your Ship has been deleted.'
    }
    
    subscribe
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      () => this.toastr.onUpload(),
      () => this.toastr.onError(),
      () => {
        this.toastr.onSuccess(successMsg);
        this.ngOnInit();
      }
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}



