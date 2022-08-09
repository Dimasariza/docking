import { NgModule } from '@angular/core';
import { NbAlertModule, NbButtonModule, NbCardModule, NbIconModule, NbInputModule, NbListModule, NbOptionModule, NbPopoverModule, NbSearchModule, NbSelectModule, NbTreeGridColumnDefDirective, NbTreeGridModule, NbTreeGridRowToggleComponent } from '@nebular/theme';
import { NumberCardModule } from '@swimlane/ngx-charts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { ThemeModule } from '../../@theme/theme.module';
import { ProjectBateraRoutingModule, routedComponents } from './project-batera-routing.module';
import { FsIconComponent, SubMenuProjectComponent } from './sub-menu-project/sub-menu-project.component';

@NgModule({
  imports: [
    NbCardModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    NgxDatatableModule,
    ProjectBateraRoutingModule,
    NbOptionModule,
    NbSelectModule,
    NbButtonModule,
    NbListModule,
    NumberCardModule,
    NbPopoverModule,
    NbSearchModule,
    NbIconModule,
    NbAlertModule,
    NbButtonModule,
    NbTreeGridModule,
    NbInputModule,
  ],
  declarations: [
    ...routedComponents,
    SubMenuProjectComponent,
    FsIconComponent
  ],
})
export class ProjectBateraModule{ 
}
