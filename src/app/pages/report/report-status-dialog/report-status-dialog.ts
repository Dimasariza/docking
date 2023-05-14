import { Component } from "@angular/core";
import { NbDialogRef } from "@nebular/theme";

@Component({
    selector: 'ngx-report-status-dialog',
    templateUrl: './report-status-dialog.html',
})
export class ReportStatusDialog { 
    constructor(
        private dialog: NbDialogRef<any>,
    ) {}

    users: { name: string, title: string }[] = [
        { name: 'Carla Espinosa', title: 'Nurse' },
        { name: 'Bob Kelso', title: 'Doctor of Medicine' },
        { name: 'Janitor', title: 'Janitor' },
        { name: 'Perry Cox', title: 'Doctor of Medicine' },
        { name: 'Ben Sullivan', title: 'Carpenter and photographer' },
    ];

    closeDialog (arr = null) {
        this.dialog.close(arr);
    } 
}