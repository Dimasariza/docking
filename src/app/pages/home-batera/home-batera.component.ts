import { Component, OnDestroy, OnInit } from '@angular/core';
import { HomeBateraService } from './home-batera.service';
import { environment } from "../../../environments/environment"
import { take, takeUntil } from 'rxjs/operators';
import { Subject} from 'rxjs';
import { UserLoginData, TableFunctions } from '../../component/global-component/global-data';
import { ReportBateraService } from '../report-batera/report-batera.service';
import { ShipDialogComponent } from './ship-dialog/ship-dialog.component';
import { NbDialogService } from '@nebular/theme';
import { DeleteDialogComponent } from '../../component/delete-dialog/delete-dialog.component';
import { ToastrComponent } from '../../component/toastr-component/toastr.component';

@Component({
  selector: 'ngx-home-batera',
  templateUrl: './home-batera.component.html',
})
export class HomeBateraComponent implements OnInit, OnDestroy{
  constructor(
    private homeService : HomeBateraService,
    private userLoginData : UserLoginData,
    private tableFunction : TableFunctions,
    private reportService : ReportBateraService,
    private dialogService : NbDialogService,
    private toastr : ToastrComponent
  ){}
    
  private destroy$: Subject<void> = new Subject<void>();
  shipData: any  = null ;
  userAccess : boolean = false;
  currentUser;

  toggleView = (id) => this.shipData[id].flipped = !this.shipData[id].flipped;

  ngOnInit() {
    if(!this.userLoginData.getGlobalVar() || this.currentUser != this.userLoginData.getGlobalVar())
    this.homeService.getUserLogin()
    .pipe(takeUntil(this.destroy$), take(1))
    .subscribe(({data} : any) => {
      this.currentUser = data;
      this.userAccess = true;
      switch(data.role) {
        case 'shipyard':
        this.userAccess = false;
        break;
      }
      this.userLoginData.setGlobalVar(data)
    })

    this.homeService.getAllShip()
    .pipe(takeUntil(this.destroy$), take(1))
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
    
    this.reportService.getProjectSummary()
    .pipe(takeUntil(this.destroy$), take(1))
    .subscribe(
      ({data} : any) => {
        if(!data?.length) return;
        const progressData = data.map(summary => {
          let {proyek : {id_kapal, tahun, phase, kapal : {nama_kapal}}, 
          work_area, variant_work, id_proyek} = summary;
          const head = `${nama_kapal} - DD - ${tahun}`;
          if(!this.tableFunction.arrayNotEmpty(work_area)) work_area = [];
          if(!this.tableFunction.arrayNotEmpty(variant_work)) variant_work = [];
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
    this.openDialog({
      dialogData : {
        title : 'Add Ship',
      },
      component : ShipDialogComponent 
    })
  }

  addToAssets(data) {
    data.status == 0
    ? data.status = 1
    : data.status = 0
    this.onUploadData(data, 'Update');
  }

  updateShipDialog(id) {
    this.openDialog({
      dialogData : {
        title : 'Update Ship',
        data : this.shipData[id]
      },
      component : ShipDialogComponent 
    })
  }

  deleteShipDialog(id) {
    this.openDialog({
      dialogData : {
        title : 'Delete Ship',
        name : this.shipData[id].nama_kapal,
        id : this.shipData[id].id_kapal
      },
      component : DeleteDialogComponent 
    })
  }

  openDialog({dialogData, component} : any){
    if(!this.userAccess) return;
    this.dialogService.open(component, {
      hasBackdrop : true,
      closeOnBackdropClick : false,
      context: { dialogData },
    })
    .onClose
    .pipe(takeUntil(this.destroy$), take(1))
    .subscribe(data => this.onUploadData(data, dialogData.title));
  }

  onUploadData(data, title) {
    if(!data) return;
    let subscribe;
    let successMsg;
    if(title == 'Add Ship') {
      subscribe = this.homeService.addShipData(data);
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
    .pipe(takeUntil(this.destroy$), take(1))
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



