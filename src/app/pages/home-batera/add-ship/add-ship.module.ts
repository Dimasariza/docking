import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { NbButtonModule, NbCardModule, NbFormFieldModule, NbIconModule, NbInputModule } from "@nebular/theme";
import { ThemeModule } from "../../../@theme/theme.module";
import { AddShipComponent } from "./add-ship.component";

@NgModule({
    imports: [
      ThemeModule,
      NbCardModule,
      NbIconModule,
      NbButtonModule,
      NbInputModule,
      HttpClientModule,
      MatDialogModule,
      NbFormFieldModule,
      FormsModule
    ],
    entryComponents: [],
    exports: [],
    declarations: [
        AddShipComponent
    ],
  })
  export class AddShipModule { }