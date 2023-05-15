import { NgModule } from "@angular/core";
import { UpdateProgressRoutingModule, routedComponents } from "./update-progress-report-routing.module";
import { CommonModule } from "@angular/common";
import { NbButtonModule, NbCardModule, NbSpinnerModule } from "@nebular/theme";
import { WorkAreasModule } from "../../component/work-areas/work-areas.module";
import { FormsModule } from "@angular/forms";
import { ThemeModule } from "../../@theme/theme.module";

@NgModule({
    imports: [
        CommonModule,
        UpdateProgressRoutingModule,
        NbCardModule,
        WorkAreasModule,
        FormsModule,
        ThemeModule,
        NbButtonModule,
        NbSpinnerModule
    ],
    exports : [],
    declarations : [
        ...routedComponents
    ]
})
export class UpdteProgressReportModule{}