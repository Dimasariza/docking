import { NgModule } from "@angular/core";
import { WorkAreasComponent } from "./work-areas.component";
import { CommonModule } from "@angular/common";
import { NbButtonModule, 
    NbCardModule, 
    NbIconModule, 
    NbInputModule,
     NbPopoverModule,
     NbProgressBarModule,
     NbSelectModule, 
     NbTreeGridModule 
    } from "@nebular/theme";
import { ThemeModule } from "../../@theme/theme.module";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { WorkAreasDialogModule } from "./work-areas-dialog/work-areas-dialog.module";
import { NbDateFnsDateModule } from "@nebular/date-fns";
import { FormsModule } from "@angular/forms";

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        FormsModule,
        NbCardModule,
        NbTreeGridModule,
        NbIconModule,
        NbInputModule,
        NgxDatatableModule,
        NbSelectModule,
        NbIconModule,
        NbButtonModule,
        WorkAreasDialogModule,
        NbPopoverModule,
        NbDateFnsDateModule,
        NbProgressBarModule,
    ],
    declarations: [
        WorkAreasComponent
    ],
    exports : [
        WorkAreasComponent
    ]
  })
  export class WorkAreasModule { }
  