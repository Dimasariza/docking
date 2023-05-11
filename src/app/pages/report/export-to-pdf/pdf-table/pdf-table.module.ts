import { NgModule } from "@angular/core";
import { PDFTableComponent } from "./pdf-table.component";
import { CommonModule } from "@angular/common";
import { ThemeModule } from "../../../../@theme/theme.module";
import { NbLayoutModule } from "@nebular/theme";

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        NbLayoutModule
    ],
    declarations : [
        PDFTableComponent
    ],
    exports : [
        PDFTableComponent
    ]
})
export class PDFTableModule {}