import { Component, EventEmitter, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ShipActionComponent } from './ship-action/ship-action.component';
import { HomeBateraService } from './home-batera.service';
import { environment } from "../../../environments/environment"
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { FunctionCollection } from '../function-collection-batera/function-collection.component';
import { TenderBateraService } from '../tender-batera/tender-batera.service';

@Component({
  selector: 'ngx-home-batera',
  templateUrl: './home-batera.component.html',
  styleUrls : ['./home.component.scss', '../../pages/pages.component.scss']
})
export class HomeBateraComponent implements OnInit {
  constructor(private homeservice:HomeBateraService,
              private dialog : MatDialog,
              private tenderService : TenderBateraService,
              private FNCOL : FunctionCollection,
  ){}
    
  onSuccess : EventEmitter<any> = new EventEmitter<any>()
  shipData: any [] = []
  flipped : any = []
  subscription : Subscription
  progressData : any
  userRole : string
  alertConds

  toggleView(id) {
    this.shipData[id].flipped = !this.shipData[id].flipped
  }

  isFalsy = (value) => !value

  ngOnInit() {
    this.homeservice.getUserLogin()
    .pipe(take(1))
    .subscribe(({data} : any) => this.userRole = data.role)

    this.homeservice.getAllShip()
    .pipe(take(1))
    .subscribe(({data} : any) => {
      if(!data.length) return;
      this.shipData = data.map(item => {
        return {
          apiUrl : environment.apiUrl,
          flipped : false,
          ...item
        }
      })
    })
    
    this.tenderService.getProjectSummary('','','','')
    .pipe(take(1))
    .subscribe(({data} : any) => { 
      this.progressData = data
      .map(project => {
        let {variant_work, id_proyek} = project;
        let {kapal, tahun, phase, work_area} = project.proyek;
        const {id_kapal, nama_kapal} = kapal;
        const head = `${nama_kapal} - DD - ${tahun}`;
        if(this.isFalsy(variant_work)) variant_work = [];
        if(this.isFalsy(work_area)) work_area = [];
        const workProgress = [...variant_work, ...work_area];
        let progress = 0;
        workProgress.map(job => progress += parseFloat(job.progress));
        progress = progress / workProgress.length;
        return {id_kapal, head, phase, id_proyek, progress};
      })
      setTimeout(() => this.generateData(), 1500);
    })
  }

  userLoginRole (role) {
    switch (role) {
      case 'admin' :
      return true
      case 'shipmanager' :
      return true
      case 'shipyard' :
      return false
      case 'director' :
      return false
    }
  }

  generateData(){
    if(this.shipData.length === 0 || !this.progressData) return;
    this.shipData.map((ship, id) => {
      this.progressData.forEach(project => {
        if(project.id_kapal === ship.id_kapal) {
            this.shipData[id] = {...this.shipData[id], ...project, phase : this.FNCOL.convertPhase(project.phase)};
        }
      })
    })
  }

  addShipDial(){
    const dialog = this.dialog.open(ShipActionComponent ,{
      disableClose : true,
      autoFocus : true,
      data : {
        dial : "Add"
      }
    });
    this.reloadPage(dialog)
  }

  updateShipDial(id){
    const dialog = this.dialog.open(ShipActionComponent ,{
      disableClose : true,
      autoFocus : true,
      data : {
        id : id,
        dial : "Update"
      }
    });
    this.reloadPage(dialog)
  };

  deleteShip(id){
    const dialog = this.dialog.open(DeleteDialogComponent ,{
      disableClose : true,
      autoFocus : true,
      data : {
        id : id,
        dial : "ship",
      }
    });
    this.reloadPage(dialog)
  };

  reloadPage(dialog){
    return dialog.componentInstance.onSuccess.asObservable().subscribe(()=> {
      this.ngOnInit()
      this.alertCard('success', 'The ship has been added')
    });
  }

  alertCard(status, msg) {
    setTimeout(() => {
      this.alertConds = {status, msg, conds : true}
    }, 1000);
    setTimeout(() => {
      this.alertConds = {...this.alertConds, conds : false}
    }, 5000);
  }

  // ngOnDestroy(): void {
  //   this.subscription.unsubscribe()
  // }

}



