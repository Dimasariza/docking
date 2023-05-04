import { Component, Input, OnInit } from "@angular/core";
import { NbDialogRef } from "@nebular/theme";
import { TableFunctions } from "../../../component/global-component/global-data";
import { ProfileBateraService } from "../../profile-batera/profil-batera.service";
import { ToastrComponent } from "../../../component/toastr-component/toastr.component";

@Component({
    selector: 'ngx-yard-dialog',
    templateUrl: './yard-dialog.component.html',
})
export class YardDialogComponent implements OnInit{
    constructor(
        private dialog: NbDialogRef<any>,
        private profileService : ProfileBateraService,
        private toastr : ToastrComponent,
        public tableFunction : TableFunctions,
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
        this.yardTotalQuote = this.tableFunction.convertToCurrency(this.usedCurrency, yard_total_quote);
        this.additionalDiscount = this.tableFunction.convertToCurrency(this.usedCurrency, additional_diskon);
        this.sumInternal = this.tableFunction.convertToCurrency(this.usedCurrency, sum_internal_adjusment);
    }

    closeDialog (arr = null) {
        if(!arr) return this.dialog.close();
        let { yard_total_quote, additional_diskon, sum_internal_adjusment} = arr;
        yard_total_quote = this.tableFunction.takeNumberOnly(yard_total_quote)
        additional_diskon = this.tableFunction.takeNumberOnly(additional_diskon)
        sum_internal_adjusment = this.tableFunction.takeNumberOnly(sum_internal_adjusment)
        arr = {...this.dialogData?.data, ...arr, yard_total_quote, additional_diskon, sum_internal_adjusment};
        this.dialog.close(arr);
    } 
}