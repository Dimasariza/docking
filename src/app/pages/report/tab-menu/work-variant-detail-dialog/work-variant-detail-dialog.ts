import { Component, Input } from "@angular/core";
import { NbDialogRef } from "@nebular/theme";

@Component({
    selector: 'ngx-work-variant-detail-dialog',
    templateUrl: './work-variant-detail-dialog.html',
})
export class WorkVariantDetailDialog { 
    constructor(
        private dialog: NbDialogRef<any>,
    ) {}

    @Input() dialogData;
    closeDialog (arr = null) {
        this.dialog.close(arr);
    } 
}