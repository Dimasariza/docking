import { Component, Input, OnInit } from "@angular/core";
import { NbDialogRef } from "@nebular/theme";

@Component({
    selector: 'ngx-addjob-supplier-dialog',
    templateUrl: './addjob-supplier-dialog.html',
})
export class AddJobSupplierDialog  { 
    constructor(
        private dialog: NbDialogRef<any>,
    ) {}
    
    @Input() dialogData;

    selectedSupplier : any;
    closeDialog (arr = null) {
        if(!arr) this.dialog.close();
        const {nama_supplier, id_supplier} = this.selectedSupplier;
        arr = {...this.dialogData.data, supplier : { nama_supplier, id_supplier }};
        this.dialog.close(arr);
    } 
}