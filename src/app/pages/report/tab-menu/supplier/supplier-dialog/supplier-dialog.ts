import { Component, Input } from "@angular/core";
import { NbDialogRef } from "@nebular/theme";

@Component({
    selector: 'ngx-supplier-dialog',
    templateUrl: './supplier-dialog.html',
})
export class SupplierDialog { 
    constructor(
        private dialog: NbDialogRef<any>,
    ) {}

    @Input() dialogData;

    closeDialog (arr = null) {
        if(!arr) this.dialog.close();
        arr = {...this.dialogData.data, ...arr};
        this.dialog.close(arr);
    } 
}