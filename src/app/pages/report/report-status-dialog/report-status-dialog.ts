import { Component } from "@angular/core";
import { NbDialogRef } from "@nebular/theme";

@Component({
    selector: 'ngx-supplier-dialog',
    templateUrl: './suplier-dialog.html',
})
export class SupplierDialog { 
    constructor(
        private dialog: NbDialogRef<any>,
    ) {}

    closeDialog (arr = null) {
        this.dialog.close(arr);
    } 
}