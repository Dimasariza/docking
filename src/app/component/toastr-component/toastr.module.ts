import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NbToastrModule } from "@nebular/theme";
import { ToastrComponent } from "./toastr.component";

@NgModule({
    imports: [
        CommonModule,
        NbToastrModule
    ],
    declarations: [
        ToastrComponent
    ],
    exports : [
        ToastrComponent
    ]
  })
  export class ToastrModule { }