import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NbButtonModule, NbCardModule, NbDialogModule } from "@nebular/theme";
import { ThemeModule } from "../../@theme/theme.module";
import { SubProjectSummary } from "./sub-project-summary/sub_project-summary";
import { SubProjectWorkArea } from "./sub_project-work-area/sub_project-work-area";
import { WorkAreasModule } from "../../component/work-areas/work-areas.module";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { ToastrModule } from "../../component/toastr-component/toastr.module";

@NgModule({
    imports: [
      CommonModule,
      NbCardModule,
      ThemeModule,
      NbButtonModule,
      NbDialogModule,
      WorkAreasModule,
      NgxDatatableModule,
      ToastrModule
    ],
    declarations: [
        SubProjectSummary,
        SubProjectWorkArea
    ],
    exports : [
        SubProjectSummary,
        SubProjectWorkArea
    ]
  })
export class ProjectSubModule{ }
  