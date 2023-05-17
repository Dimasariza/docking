import { Component, Input, OnInit } from "@angular/core";
import { NbDialogRef } from "@nebular/theme";

@Component({
    selector: 'ngx-work-variant-detail-dialog',
    templateUrl: './work-variant-detail-dialog.html',
})
export class WorkVariantDetailDialog implements OnInit { 
    constructor(
        private dialog: NbDialogRef<any>,
    ) { }

    ngOnInit(): void {
        console.log(this.dialogData)
    }

    details = [
        { name : 'Job Name', prop : 'jobName' },
        { name : 'Progress', prop : 'last_progress' },
        { name : 'Start', prop : 'start' },
        { name : 'Stop', prop : 'end' },
        { name : 'Volume', prop : 'volume' },
        { name : 'Unit', prop : 'unit' },
        { name : 'Unit Price Actual', prop : 'unitPriceActual' },
        { name : 'Total Price Actual', prop : 'totalPriceActual' },
        { name : 'Category', prop : 'category' },
        { name : 'Supplier', prop : 'supplier' },
        { name : 'Approved By Ship Yard', prop : 'shipYardApproval' },
        { name : 'Approved By Ship Yard', prop : 'ownerApproval' },
    ]

    @Input() dialogData;
    closeDialog (arr = null) {
        this.dialog.close(arr);
    } 
}