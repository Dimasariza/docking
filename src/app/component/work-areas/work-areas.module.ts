import { NgModule } from "@angular/core";
import { WorkAreasComponent } from "./work-areas.component";
import { CommonModule } from "@angular/common";
import { NbButtonModule, 
    NbCardModule, 
    NbIconModule, 
    NbInputModule,
     NbSelectModule, 
     NbTreeGridModule 
    } from "@nebular/theme";
import { ThemeModule } from "../../@theme/theme.module";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { WorkAreasDialogModule } from "./work-areas-dialog/work-areas-dialog.module";

@NgModule({
    imports: [
        CommonModule,
        NbCardModule,
        NbTreeGridModule,
        NbIconModule,
        NbInputModule,
        ThemeModule,
        NgxDatatableModule,
        NbSelectModule,
        NbIconModule,
        NbButtonModule,
        WorkAreasDialogModule
    ],
    declarations: [
        WorkAreasComponent
    ],
    exports : [
        WorkAreasComponent
    ]
  })
  export class WorkAreasModule { }
  