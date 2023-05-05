import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { NbDialogRef } from "@nebular/theme";
import { CommonFunction } from "../../../../component/common-function/common-function";

@Component({
    selector: 'ngx-yard-details',
    templateUrl: './yard-details-dialog.component.html',
})
export class YardDetailsDialog implements OnInit {
    constructor(
        private dialog: NbDialogRef<any>,
        private commonFunction : CommonFunction
    ) {

    }

    @Input() dialogData : any;
    tableData : any;
    ngOnInit(): void {
        let { nama_galangan, 
            lokasi_galangan, 
            no_kontrak,
            yard_total_quote,
            sum_internal_adjusment,
            general_diskon_persen,
            additional_diskon,
            proyek,
            mata_uang = "Rp ",
            off_hire_period,
            off_hire_rate_per_day,
            off_hire_bunker_per_day
        } = this.dialogData.data;

        if(proyek)
        ({ yard : {
            lokasi_galangan, 
            no_kontrak, 
            yard_total_quote,
            sum_internal_adjusment,
            general_diskon_persen,
            additional_diskon
        }, proyek : {
            mata_uang,
            off_hire_period,
            off_hire_rate_per_day,
            off_hire_bunker_per_day
        }} = this.dialogData.data);

        const ownerTotalCost = parseInt(off_hire_rate_per_day) + parseInt(off_hire_bunker_per_day);
        this.tableData = {
            nama_galangan,
            lokasi_galangan, 
            no_kontrak, 
            yard_total_quote : 
            this.commonFunction.convertToCurrency(mata_uang, parseInt(yard_total_quote)) ,
            sum_internal_adjusment : 
            this.commonFunction.convertToCurrency(mata_uang, parseInt(sum_internal_adjusment)),
            general_diskon_persen :
            `
            ( ${general_diskon_persen} %)
            ${this.commonFunction.convertToCurrency(mata_uang, (
                parseInt(general_diskon_persen) * ownerTotalCost
            ) / 100 )}
            `
            ,
            additional_diskon :
            this.commonFunction.convertToCurrency(mata_uang, additional_diskon),
            mata_uang,
            off_hire_period : proyek 
            ? `${off_hire_period} Days` 
            : null,
            off_hire_rate_per_day :
            this.commonFunction.convertToCurrency(mata_uang, off_hire_rate_per_day),
            off_hire_bunker_per_day :
            this.commonFunction.convertToCurrency(mata_uang, off_hire_bunker_per_day),
            ownerTotalCost :
            this.commonFunction.convertToCurrency(mata_uang, ownerTotalCost),
        }
    }

    keyTable = [
        { key : "Yard Name" , prop : 'nama_galangan'},
        { key : "Yard Location" , prop : 'lokasi_galangan'},
        { key : "Contract Number" , prop : 'no_kontrak'},
        { key : "Yard Quote" , prop : 'yard_total_quote'},
        { key : "Currency" , prop : 'mata_uang'},
        { key : "Offhire Repair Period (In Dock)" , prop : 'off_hire_period'},
        { key : "Sum Internal Adjusment" , prop : 'sum_internal_adjusment'},
        { key : "General Discount" , prop : 'general_diskon_persen'},
        { key : "Additional Discount" , prop : 'additional_diskon'},
        { key : "Offhire Cost" , prop : 'off_hire_rate_per_day'},
        { key : "Owner Cost" , prop : 'off_hire_bunker_per_day'},
        { key : "Owner Total Cost" , prop : 'ownerTotalCost'},
    ];

    closeDialog (arr = null) {
        this.dialog.close(arr);
    } 

}