import { Component, OnDestroy, OnInit } from '@angular/core';
import { HomeService } from './home.service';
import { environment } from "../../../environments/environment"
import { takeUntil } from 'rxjs/operators';
import { Subject} from 'rxjs';
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
    
  private destroy$: Subject<void> = new Subject<void>();
  shipData: any  = null ;

  toggleView = (id) => this.shipData[id].flipped = !this.shipData[id].flipped;

  ngOnInit() {
    this.homeService.getAllShips({})
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      ({data} : any) => {
        if(this.commonFunction.arrayNotEmpty(data))
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
        if(this.commonFunction.arrayNotEmpty(data))
        this.generateMilestone(data)
      },
      () => this.toastr.onError()
    );
  }

  generateMilestone(data) {
    const progressData = data.map(summary => {
      let {proyek : {id_kapal, tahun, phase, kapal : {nama_kapal}}, 
      work_area = [], variant_work = [], id_proyek} = summary;
      const head = `${nama_kapal} - DD - ${tahun}`;
      if(!this.commonFunction.arrayNotEmpty(work_area)) work_area = [];
      if(!this.commonFunction.arrayNotEmpty(variant_work)) variant_work = [];
      const workProgress = [...work_area, ...variant_work];
      let progress : any = 0.0;
      for(let job of workProgress) progress += job.progress.at(-1).progress;
      if(progress != 0) progress = progress / workProgress?.length;
      return {id_kapal, head, phase : phase.split('_').join(" "), progress : parseFloat(progress).toFixed(2), id_proyek};
    })

    if(!this.shipData?.length || !progressData) return;
    this.shipData = this.shipData.map(ship => { 
      const check = progressData.find(({id_kapal}) => id_kapal === ship.id_kapal)
      if(check) return {...ship, ...check}
      return {...ship};
    })
  }

  handleClickButton(title, data = null) {
    const {role} =  JSON.parse(localStorage.getItem('user'));
    let warnmsg = "You have no access to do this request."
    if(role == 'shipyard') return this.toastr.onWarning({warnmsg}) 
    
    if(title == 'Add Ship') this.addShipDialog(title)
    if(title == 'Update Ship') this.updateShipDialog(title, data)
    if(title == 'Delete Ship') this.deleteShipDialog(title, data)
    if(title == 'Add To Assets') this.addToAssets(data)
  }

  addShipDialog(title) {
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

  addToAssets(data) {
    data.status == 0
    ? data.status = 1
    : data.status = 0
    this.onUploadData('Add To Assets', data);
  }

  updateShipDialog(title, data) {
    this.commonFunction.openDialog({
      dialogData : {
        title,
        data : this.shipData[data]
      },
      component : ShipDialogComponent 
    })
    .onClose
    .pipe(takeUntil(this.destroy$))
    .subscribe(newData => newData
      ? this.onUploadData(title, newData)
      : null);
  }

  deleteShipDialog(title, id) {
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
    .subscribe(newData => newData
      ? this.onUploadData(title, newData)
      : null);
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

    if(title == 'Add To Assets') {
      subscribe = this.homeService.updateShip(data);
      successMsg = 'Your Ship has been added to assets.'
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



