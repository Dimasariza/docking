import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NbButtonModule, 
    NbCardModule, 
    NbDatepickerModule,
    NbIconModule, 
    NbInputModule, 
    NbOptionModule, 
    NbSelectModule 
} from "@nebular/theme";
import { ThemeModule } from "../../../@theme/theme.module";
import { FormsModule } from "@angular/forms";
import { NbDateFnsDateModule } from "@nebular/date-fns";
import { WorkAreasDialogComponent } from "./work-areas-dialog.component";

@NgModule({
    imports: [
        CommonModule,
        NbCardModule,
        NbIconModule,
        NbInputModule,
        ThemeModule,
        NbSelectModule,
        NbIconModule,
        NbButtonModule,
        FormsModule,
        NbOptionModule,
        NbSelectModule,
        NbInputModule,
        NbDateFnsDateModule,
        NbDatepickerModule
    ],
    declarations: [
        WorkAreasDialogComponent
    ],
    exports : [
        WorkAreasDialogComponent
    ]
  })
  export class WorkAreasDialogModule { }
  