import { NbDateService, NbDialogRef } from '@nebular/theme';
import { HomeBateraService } from '../../home-batera/home-batera.service';
import { ProfileBateraService } from '../../profile-batera/profil-batera.service';
import { Subject } from 'rxjs';
import { TableFunctions } from '../../../component/global-component/global-data';
import { ToastrComponent } from '../../../component/toastr-component/toastr.component';
import { take, takeUntil } from 'rxjs/operators';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-project-data',
  templateUrl: './project-dialog.component.html',
})
export class ProjectDialogComponent implements OnInit{
  min 
  max

  constructor(  
    private dateService: NbDateService<Date>,
    private homeService : HomeBateraService,
    private profileService : ProfileBateraService,
    private dialog: NbDialogRef<any>,
    private toastr : ToastrComponent,
    public tableFunction : TableFunctions,
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

  ngOnInit(): void {
    
    this.homeService.getAllShip()
    .pipe(takeUntil(this.destroy$), take(1))
    .subscribe(
      ({data} : any) => this.vesselData = data,
      () => this.toastr.onError()
    );
    
    this.profileService.getUserData(1, 10, '', "shipyard", '')
    .pipe(takeUntil(this.destroy$), take(1))
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

    offHirePeriod = this.tableFunction.parseStartEndDate(off_hire_start, off_hire_end);
    repairInDock = this.tableFunction.parseStartEndDate(repair_in_dock_start, repair_in_dock_end);
    repairPeriod = this.tableFunction.parseStartEndDate(repair_start, repair_end);

    this.usedCurrency = mata_uang;

    this.charterRate = this.tableFunction.convertToCurrency(off_hire_rate_per_day, this.usedCurrency);
    this.bunkerRate = this.tableFunction.convertToCurrency(off_hire_bunker_per_day, this.usedCurrency);

    this.dialogData.data = {...data, offHirePeriod, repairInDock, repairPeriod};
  }

  closeDialog (arr = null) {
    if(!arr) return this.dialog.close();
    
    let { off_hire_bunker_per_day, off_hire_rate_per_day } = arr;
    off_hire_bunker_per_day = this.tableFunction.takeNumberOnly(off_hire_bunker_per_day)
    off_hire_rate_per_day = this.tableFunction.takeNumberOnly(off_hire_rate_per_day)
    arr = {...this.dialogData?.data, ...arr, off_hire_bunker_per_day, off_hire_rate_per_day};
    this.dialog.close(arr);
  } 

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
