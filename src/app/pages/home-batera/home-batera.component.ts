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
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-home-batera',
  templateUrl: './home-batera.component.html',
})
export class HomeBateraComponent implements OnInit {
  constructor(private homeservice:HomeBateraService,
              private dialog : MatDialog,
              private tenderService : TenderBateraService,
              private router : Router,
              private FNCOL : FunctionCollection,
  ){}
    
  onSuccess : EventEmitter<any> = new EventEmitter<any>()
  shipData: any [] = []
  flipped : any = []
  subscription : Subscription
  progressData : any
  role : string

  toggleView(id) {
    this.shipData[id].flipped = !this.shipData[id].flipped
  }

  ngOnInit() {
    this.homeservice.getUserLogin()
    .pipe(take(1))
    .subscribe(({data} : any) => this.role = data.role)

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
        const {kapal, tahun, phase, work_area} = project.proyek
        const {id_kapal, nama_kapal} = kapal
        const head = `${nama_kapal} - DD - ${tahun}`
        const projectId = project.id_proyek
        return {id_kapal, head, phase, projectId}
      })
      setTimeout(() => this.generateData(), 1500);
    })
  }
  
  generateData(){
    if(this.shipData.length === 0 || !this.progressData) return;
    this.shipData.map((ship, id) => {
      this.progressData.forEach(project => {
        const {phase, head, projectId} = project
        if(project.id_kapal === ship.id_kapal) {
            this.shipData[id]['phase'] = this.FNCOL.convertPhase(phase)
            this.shipData[id]['head'] = head
            this.shipData[id]['projectId'] = projectId
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
    });
  }

  // ngOnDestroy(): void {
  //   this.subscription.unsubscribe()
  // }

}



