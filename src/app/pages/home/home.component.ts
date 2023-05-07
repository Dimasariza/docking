import { Component, OnDestroy, OnInit } from '@angular/core';
import { HomeService } from './home.service';
import { environment } from "../../../environments/environment"
import { takeUntil } from 'rxjs/operators';
import { Subject} from 'rxjs';
import { CommonFunction } from '../../component/common-function/common-function';
import { ReportService } from '../report/report.service';
import { ShipDialogComponent } from './ship-dialog/ship-dialog.component';
import { NbDialogService } from '@nebular/theme';
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
    private dialogService : NbDialogService,
    private toastr : ToastrComponent
  ){}
    
  private destroy$: Subject<void> = new Subject<void>();
  shipData: any  = null ;
  userAccess : boolean = false;
  currentUser;

  toggleView = (id) => this.shipData[id].flipped = !this.shipData[id].flipped;

  ngOnInit() {
    this.homeService.getUserLogin()
    .pipe(takeUntil(this.destroy$))
    .subscribe(({data} : any) => {
      this.currentUser = data;
      this.userAccess = true;
      switch(data.role) {
        case 'shipyard':
        this.userAccess = false;
        break;
      }
    })

    this.homeService.getAllShips({})
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      ({data} : any) => {
        if(!data?.length) return;
        this.shipData = data.map(item => ({  
            ...item,
            imageURL : `${environment.apiUrl}/file/show/${item.foto}`,
            flipped : false,
        }))
      },  
      () => this.toastr.onError()
    );
    
    this.reportService.getProjectSummary({})
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      ({data} : any) => {
        if(!data?.length) return;
        const progressData = data.map(summary => {
          let {proyek : {id_kapal, tahun, phase, kapal : {nama_kapal}}, 
          work_area, variant_work, id_proyek} = summary;
          const head = `${nama_kapal} - DD - ${tahun}`;
          if(!this.commonFunction.arrayNotEmpty(work_area)) work_area = [];
          if(!this.commonFunction.arrayNotEmpty(variant_work)) variant_work = [];
          const workProgress = [...work_area, ...variant_work];
          let progress = 0;
          if(workProgress?.length) {
            workProgress.forEach(({progress} = 0) => progress += parseFloat(progress));
            progress = progress / workProgress.length;
          }
          return {id_kapal, head, phase : phase.split('_').join(" "), progress, id_proyek};
        })

        if(!this.shipData.length || !progressData) return;
        this.shipData = this.shipData.map(ship => { 
          const check = progressData.find(({id_kapal}) => id_kapal === ship.id_kapal)
          if(check) return {...ship, ...check}
          return {...ship};
        })
      },
      () => this.toastr.onError()
    );
  }

  addShipDialog() {
    const title = 'Add Ship';
    this.commonFunction.openDialog({
      dialogData : { title },
      component : ShipDialogComponent 
    })
    .onClose
    .pipe(takeUntil(this.destroy$))
    .subscribe(newData => this.onUploadData(title, newData));
  }

  addToAssets(data) {
    data.status == 0
    ? data.status = 1
    : data.status = 0
    this.onUploadData(data, 'Update Ship');
  }

  updateShipDialog(id) {
    const title = 'Update Ship';
    this.commonFunction.openDialog({
      dialogData : {
        title,
        data : this.shipData[id]
      },
      component : ShipDialogComponent 
    })
    .onClose
    .pipe(takeUntil(this.destroy$))
    .subscribe(newData => this.onUploadData(title, newData));
  }

  deleteShipDialog(id) {
    const title = 'Delete Ship';
    this.commonFunction.openDialog({
      dialogData : {
        title,
        name : this.shipData[id].nama_kapal,
        id : this.shipData[id].id_kapal
      },
      component : DeleteDialogComponent 
    })
    .onClose
    .pipe(takeUntil(this.destroy$))
    .subscribe(newData => this.onUploadData(title, newData));
  }

  onUploadData(title, data) {
    if(!data) return;
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



