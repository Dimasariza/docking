import { NgModule } from '@angular/core';
import { NbCardModule, NbIconModule, NbInputModule, NbOptionComponent, NbOptionModule, NbSelectModule, NbTreeGridModule } from '@nebular/theme';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { ThemeModule } from '../../@theme/theme.module';
import { ProjectBateraRoutingModule, routedComponents } from './project-batera-routing.module';

@NgModule({
  imports: [
    NbCardModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    NgxDatatableModule,
    ProjectBateraRoutingModule,
    NbOptionModule,
    NbSelectModule
  ],
  declarations: [
    ...routedComponents,
  ],
})
export class ProjectBateraModule{ 
}
