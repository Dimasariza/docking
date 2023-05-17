import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FrappeGanttComponent } from "./frappe-gantt.component";

@NgModule({
    declarations : [
        FrappeGanttComponent
    ],
    exports : [FrappeGanttComponent]
})

export class FrappeGanttModule {

}