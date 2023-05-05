import { Component, Input, OnInit } from "@angular/core";
import { NbDialogRef } from "@nebular/theme";
import { Subject } from "rxjs";
import { CommonFunction } from "../../common-function/common-function";

@Component({
    selector: 'ngx-work-areas-dialog',
    templateUrl: './work-areas-dialog.component.html',
})
export class WorkAreasDialogComponent implements OnInit {
    constructor(
        public dialog: NbDialogRef<any>,
        public commonFunction : CommonFunction
    ) {
    }

    ngOnInit(): void {
        // console.log(this.dialogData)
    }

    responsible : any = [];
    public disabledChild = false;

    totalPrice
    unitPriceLabel = 'test'

    unitPriceAmount(e, amount) {

    }

    volumeAmount($event) {
        
    }

    private destroy$: Subject<void> = new Subject<void>();
    @Input() public dialogData: any = {};

    closeDialog (arr = null) {
        this.dialog.close(arr);
    } 
    
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

}