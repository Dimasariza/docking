import { Component, Input, OnInit } from "@angular/core";
import { NbDialogRef } from "@nebular/theme";
import { Subject } from "rxjs";
import { CommonFunction } from "../../common-function/common-function";
import { ProfileService } from "../../../pages/profile/profile.service";
import { takeUntil } from "rxjs/operators";
import { ToastrComponent } from "../../toastr-component/toastr.component";

@Component({
    selector: 'ngx-work-areas-dialog',
    templateUrl: './work-areas-dialog.component.html',
})
export class WorkAreasDialogComponent implements OnInit {
    constructor(
        public dialog: NbDialogRef<any>,
        public commonFunction : CommonFunction,
        private profileService : ProfileService,
        private toastr : ToastrComponent
    ) { }

    ngOnInit(): void {
        this.dialogData.subTitle = this.dialogData?.data?.jobName
        this.usedCurrency = this.dialogData.data?.mata_uang;
        if(this.dialogData.title == 'Add Job')
            this.jobUnit.push(this.commonFunction?.jobUnit[0])
        else if (this.dialogData.title == 'Add Sub Job') {
            const {id, items} = this.dialogData.data;
            this.dialogData.data = {id : id + "." + items?.length, items};
            this.jobUnit = [...this.commonFunction.jobUnit].slice(1);
        }
        else if(this.dialogData.title == 'Quick Add') {
            this.jobUnit = this.commonFunction.jobUnit;
            this.dialogData.data = [];
        }
        else {
            this.jobUnit = [...this.commonFunction.jobUnit].slice(1);
            this.unitPrice = this.commonFunction.convertToCurrency(
                this.usedCurrency, this.dialogData.data['unitPrice' + this.dialogData.label]
            ) 
            this.totalPrice = this.dialogData.data['totalPrice' + this.dialogData.label];

            if(this.dialogData.data?.start)
            this.start[this.dialogData.label] = this.commonFunction.parseDate(this.dialogData.data?.start);
            
            if(this.dialogData.data?.end)
            this.end[this.dialogData.label] = this.commonFunction.parseDate(this.dialogData.data?.end);
        }

        const user =  JSON.parse(localStorage.getItem('user'));
        if(user.role == 'shipyard') return;

        this.profileService.getAllUsers({ role : 'shipyard' })
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          ({data} : any) => this.responsible = data,
          () => this.toastr.onError()
        );
    }
    
    private destroy$: Subject<void> = new Subject<void>();
    @Input() public dialogData: any = {};

    public disabledChild = false;
    responsible : any = [];
    jobUnit : any [] = []

    start : any = {};
    end : any = {};
    usedCurrency;
    unitPrice : any = 0;
    totalPrice : any = 0;
    volume = 0;

    convertPrice(amount) {
        amount = this.commonFunction.priceAmount(amount);
        this.unitPrice = this.commonFunction.convertToCurrency(this.usedCurrency, amount);
        this.volumeAmount(this.volume)
    }

    volumeAmount(volume) {
        this.volume = volume;
        const total = volume * this.commonFunction.priceAmount(this.unitPrice)
        this.totalPrice = this.commonFunction.convertToCurrency(this.usedCurrency, total)
    }

    closeDialog (arr = null) {
        if(!arr) return this.dialog.close();    
        let {mata_uang = this.usedCurrency, volume, start, end, status = 'Not Started'} = arr;
        arr = {...arr, mata_uang, status, ...this.dialogData?.data, volume,
            start : this.commonFunction.transformDate(start),
            end : this.commonFunction.transformDate(end)
        };
        arr['unitPrice' + this.dialogData.label] = this.commonFunction.priceAmount(this.unitPrice)
        arr['totalPrice' + this.dialogData.label] = this.totalPrice;
        arr = this.commonFunction.acceptData(arr, this.dialogData.label)
        this.dialog.close(arr)
    } 

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}