import { NbDateService, NbDialogRef } from '@nebular/theme';
import { HomeService } from '../../home/home.service';
import { ProfileService } from '../../profile/profile.service';
import { Subject } from 'rxjs';
import { CommonFunction } from '../../../component/common-function/common-function';
import { ToastrComponent } from '../../../component/toastr-component/toastr.component';
import { takeUntil } from 'rxjs/operators';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment'

@Component({
  selector: 'ngx-project-data',
  templateUrl: './project-dialog.component.html',
})
export class ProjectDialogComponent implements OnInit, OnDestroy{
  min 
  max

  constructor(  
    private dateService: NbDateService<Date>,
    private homeService : HomeService,
    private profileService : ProfileService,
    private dialog: NbDialogRef<any>,
    private toastr : ToastrComponent,
    public commonFunction : CommonFunction,
    ) { 
  this.min = this.dateService.addDay(this.dateService.today(), 0);
  this.max = this.dateService.addDay(this.dateService.today(), 1);
  }

  private destroy$: Subject<void> = new Subject<void>();
  @Input() dialogData: any = {};

  disabled : boolean = false
  vesselData;
  responsible : any;

  charterRate;
  bunkerRate;
  usedCurrency;

  currentYear = moment().year()
  defaultOffHirePeriod = moment().add(1, 'month').toDate()//.format('dd.MM.yyyy')

  ngOnInit(): void {
    
    this.homeService.getAllShips({})
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      ({data} : any) => this.vesselData = data,
      () => this.toastr.onError()
    );
    
    this.profileService.getAllUsers({ role : "shipyard" })
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      ({data} : any) => this.responsible = data,
      () => this.toastr.onError()
    );

    this.dialogData.title == "Update"
    ? this.disabled = true
    : this.disabled = false;

    if(this.dialogData?.data) this.bindProjectData();
  }

  bindProjectData() {
    let { data, data : {off_hire_start, off_hire_end, repair_start, mata_uang,
      repair_end, repair_in_dock_start, repair_in_dock_end, 
      off_hire_rate_per_day, off_hire_bunker_per_day, 
      offHirePeriod, repairInDock, repairPeriod}
    } = this.dialogData;

    offHirePeriod = this.commonFunction.parseStartEndDate(off_hire_start, off_hire_end);
    repairInDock = this.commonFunction.parseStartEndDate(repair_in_dock_start, repair_in_dock_end);
    repairPeriod = this.commonFunction.parseStartEndDate(repair_start, repair_end);

    this.usedCurrency = mata_uang;

    this.charterRate = this.commonFunction.convertToCurrency(this.usedCurrency, off_hire_rate_per_day);
    this.bunkerRate = this.commonFunction.convertToCurrency(this.usedCurrency, off_hire_bunker_per_day);

    this.dialogData.data = {...data, offHirePeriod, repairInDock, repairPeriod};
  }

  closeDialog (arr = null) {
    if(!arr) return this.dialog.close();
    
    let { off_hire_bunker_per_day, off_hire_rate_per_day } = arr;
    off_hire_bunker_per_day = this.commonFunction.priceAmount(off_hire_bunker_per_day)
    off_hire_rate_per_day = this.commonFunction.priceAmount(off_hire_rate_per_day)
    arr = {...this.dialogData?.data, ...arr, off_hire_bunker_per_day, off_hire_rate_per_day};
    this.dialog.close(arr);
  } 

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
