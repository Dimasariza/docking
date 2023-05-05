import { Component, Input, OnInit } from "@angular/core";
import { NbDialogRef } from "@nebular/theme";
import { ToastrComponent } from "../../../../component/toastr-component/toastr.component";
import { ProfileService } from "../../../profile/profile.service";
import { CommonFunction } from "../../../../component/common-function/common-function";

@Component({
    selector: 'ngx-yard-dialog',
    templateUrl: './yard-dialog.component.html',
})
export class YardDialogComponent implements OnInit{
    constructor(
        private dialog: NbDialogRef<any>,
        private profileService : ProfileService,
        private toastr : ToastrComponent,
        public commonFunction : CommonFunction,
    ) {    }

    ngOnInit(): void {
        this.profileService.getUserData(10, '', '', 'shipyard', 'active')
            .subscribe(({data} : any) => {
                const responsible = data.find(resp => resp.id_user == this.dialogData?.data?.id_user);
                if(responsible) this.dialogData.data.responsible = responsible;
                this.responsible = data;
            },
            () => this.toastr.onError()
        )
            
        if(this.dialogData.data)  this.bindProjectData();
    }

    @Input() dialogData : any;

    responsible : any = [];
    usedCurrency = "Rp "
    yardTotalQuote
    additionalDiscount
    sumInternal

    bindProjectData() {
        let { yard_total_quote ,additional_diskon,sum_internal_adjusment } = this.dialogData.data;
        this.yardTotalQuote = this.commonFunction.convertToCurrency(this.usedCurrency, yard_total_quote);
        this.additionalDiscount = this.commonFunction.convertToCurrency(this.usedCurrency, additional_diskon);
        this.sumInternal = this.commonFunction.convertToCurrency(this.usedCurrency, sum_internal_adjusment);
    }

    closeDialog (arr = null) {
        if(!arr) return this.dialog.close();
        let { yard_total_quote, additional_diskon, sum_internal_adjusment} = arr;
        yard_total_quote = this.commonFunction.takeNumberOnly(yard_total_quote)
        additional_diskon = this.commonFunction.takeNumberOnly(additional_diskon)
        sum_internal_adjusment = this.commonFunction.takeNumberOnly(sum_internal_adjusment)
        arr = {...this.dialogData?.data, ...arr, yard_total_quote, additional_diskon, sum_internal_adjusment};
        this.dialog.close(arr);
    } 
}