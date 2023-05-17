import { NgModule } from "@angular/core";
import { ListTableComponent } from "./list-table.component";
import { NbButtonModule, NbIconModule, NbPopoverModule } from "@nebular/theme";
import { ThemeModule } from "../../@theme/theme.module";
import { CommonModule } from "@angular/common";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        NbIconModule,
        NbButtonModule,
        NbPopoverModule,
        NgxDatatableModule,
    ],
    declarations : [
        ListTableComponent
    ],
    exports : [
        ListTableComponent
    ]
})
export class ListTableModule {}